import { Resend } from 'resend';

const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_MAX = 5;
const rateMap = new Map();

const ALLOWED_PACKAGES = new Set([
  '',
  'Standart Paket',
  'İşletme Paketi',
  'Kurumsal Paket',
  'Özel Teklif'
]);

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    rateMap.set(ip, { start: now, count: 1 });
    return true;
  }

  if (entry.count >= RATE_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    let size = 0;
    const MAX = 16 * 1024;

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX) {
        reject(new Error('BODY_TOO_LARGE'));
        req.destroy();
        return;
      }
      data += chunk;
    });

    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('INVALID_JSON'));
      }
    });

    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Yalnızca POST kabul edilir.' });
    return;
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    sendJson(res, 429, { message: 'Çok fazla istek. Lütfen birkaç dakika sonra tekrar deneyin.' });
    return;
  }

  let body;
  try {
    // Vercel may already parse body
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      body = req.body;
    } else {
      body = await readBody(req);
    }
  } catch (err) {
    if (err.message === 'BODY_TOO_LARGE') {
      sendJson(res, 413, { message: 'İstek çok büyük.' });
      return;
    }
    sendJson(res, 400, { message: 'Geçersiz istek gövdesi.' });
    return;
  }

  // Honeypot: bots fill this field
  if (body.website) {
    sendJson(res, 200, { message: 'Mesajınız alındı. En kısa sürede dönüş yapacağız.' });
    return;
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const phone = String(body.phone || '').trim();
  const pkg = String(body.package || '').trim();
  const message = String(body.message || '').trim();

  const errors = {};

  if (name.length < 2 || name.length > 80) {
    errors.name = 'Ad soyad 2–80 karakter olmalıdır.';
  }
  if (!isValidEmail(email) || email.length > 120) {
    errors.email = 'Geçerli bir e-posta adresi girin.';
  }
  if (phone && (phone.length < 10 || phone.length > 30 || !/^[\d\s+\-()]+$/.test(phone))) {
    errors.phone = 'Geçerli bir telefon numarası girin.';
  }
  if (!ALLOWED_PACKAGES.has(pkg)) {
    errors.package = 'Geçersiz paket seçimi.';
  }
  if (message.length < 10 || message.length > 2000) {
    errors.message = 'Mesaj 10–2000 karakter olmalıdır.';
  }

  if (Object.keys(errors).length > 0) {
    sendJson(res, 400, { message: 'Lütfen formu kontrol edin.', errors });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'mertegek12@gmail.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'MEKYAZILIM <onboarding@resend.dev>';

  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    sendJson(res, 503, {
      message: 'E-posta servisi yapılandırılmamış. Lütfen WhatsApp veya e-posta ile ulaşın.'
    });
    return;
  }

  const resend = new Resend(apiKey);

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || '—');
  const safePkg = escapeHtml(pkg || 'Belirtilmedi');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `[MEKYAZILIM] Yeni iletişim: ${name}`,
      html: `
        <h2>Yeni iletişim formu mesajı</h2>
        <p><strong>Ad:</strong> ${safeName}</p>
        <p><strong>E-posta:</strong> ${safeEmail}</p>
        <p><strong>Telefon:</strong> ${safePhone}</p>
        <p><strong>Paket:</strong> ${safePkg}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${safeMessage}</p>
        <hr>
        <p style="color:#666;font-size:12px;">IP: ${escapeHtml(ip)}</p>
      `,
      text: [
        'Yeni iletişim formu mesajı',
        `Ad: ${name}`,
        `E-posta: ${email}`,
        `Telefon: ${phone || '—'}`,
        `Paket: ${pkg || 'Belirtilmedi'}`,
        '',
        'Mesaj:',
        message
      ].join('\n')
    });

    if (error) {
      console.error('Resend error:', error);
      sendJson(res, 502, {
        message: 'E-posta gönderilemedi. Lütfen WhatsApp ile yazın veya daha sonra deneyin.'
      });
      return;
    }

    sendJson(res, 200, {
      message: 'Mesajınız alındı. En kısa sürede dönüş yapacağız.'
    });
  } catch (err) {
    console.error('Contact handler error:', err);
    sendJson(res, 500, {
      message: 'Sunucu hatası. Lütfen WhatsApp ile iletişime geçin.'
    });
  }
}
