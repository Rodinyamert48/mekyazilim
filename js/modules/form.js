export function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('form-success');
  const errorMessage = document.getElementById('form-error');
  const submitBtn = form?.querySelector('[type="submit"]');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    hideStatus(successMessage);
    hideStatus(errorMessage);

    if (!validateForm(form)) {
      return;
    }

    const formData = new FormData(form);
    const payload = {
      access_key: 'dcee7bc0-66ff-4aa7-8f4a-637affa5860b',
      subject: 'MEKYAZILIM - Yeni iletişim formu mesajı',
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      package: String(formData.get('package') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      botcheck: String(formData.get('website') || '').trim()
    };

    setSubmitting(submitBtn, true);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showStatus(errorMessage, data.message || 'Gönderim başarısız. Lütfen tekrar deneyin.');
        return;
      }

      form.reset();
      form.style.display = 'none';
      showStatus(successMessage, 'Mesajınız alındı. En kısa sürede dönüş yapacağız.');

      setTimeout(() => {
        form.style.display = 'block';
        hideStatus(successMessage);
      }, 6000);
    } catch {
      showStatus(
        errorMessage,
        'Bağlantı hatası. Lütfen internetinizi kontrol edin veya WhatsApp ile yazın.'
      );
    } finally {
      setSubmitting(submitBtn, false);
    }
  });

  const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
}

function setSubmitting(btn, isSubmitting) {
  if (!btn) return;
  btn.disabled = isSubmitting;
  btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
  btn.textContent = isSubmitting ? 'Gönderiliyor…' : btn.dataset.originalText;
}

function showStatus(el, text) {
  if (!el) return;
  if (text) el.textContent = text;
  el.classList.add('visible');
}

function hideStatus(el) {
  if (!el) return;
  el.classList.remove('visible');
}

function validateForm(form) {
  const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
  let isValid = true;

  inputs.forEach(input => {
    if (input.name === 'website') return; // honeypot
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

function setFieldError(input, errorMessage) {
  const errorEl = input.parentElement.querySelector('.form-error');
  input.classList.add('error');
  if (errorEl) {
    errorEl.textContent = errorMessage;
    errorEl.classList.add('visible');
  }
}

function validateField(input) {
  if (input.name === 'website') return true;

  const errorEl = input.parentElement.querySelector('.form-error');
  let isValid = true;
  let errorMessage = '';

  if (input.hasAttribute('required') && !input.value.trim()) {
    isValid = false;
    errorMessage = 'Bu alan zorunludur.';
  }

  if (input.type === 'email' && input.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      isValid = false;
      errorMessage = 'Geçerli bir e-posta adresi girin.';
    } else {
      const domain = input.value.split('@')[1].toLowerCase();
      const allowedDomains = ['gmail.com', 'yopmail.com', 'outlook.com', 'hotmail.com', 'live.com', 'msn.com'];
      const isAllowed = allowedDomains.includes(domain);
      const hasSubdomain = (domain.match(/\./g) || []).length >= 2;
      if (!isAllowed && !hasSubdomain) {
        isValid = false;
        errorMessage = 'Yalnızca @gmail.com, @outlook.com veya kurumsal e-posta adresleri kabul edilir.';
      }
    }
  }

  if (input.type === 'tel' && input.value.trim()) {
    const cleaned = input.value.replace(/[\s\-()]/g, '');
    const isTurkish = /^(\+90|0)?[0-9]{10}$/.test(cleaned) && /^(\+90|0)?5[0-9]{9}$/.test(cleaned);
    if (!isTurkish) {
      isValid = false;
      errorMessage = 'Geçerli bir Türk telefon numarası girin (05xx xxx xx xx).';
    }
  }

  if (input.name === 'message' && input.value.trim().length < 25) {
    isValid = false;
    errorMessage = 'Mesaj en az 25 karakter olmalıdır.';
  }

  if (isValid) {
    input.classList.remove('error');
    if (errorEl) errorEl.classList.remove('visible');
  } else {
    setFieldError(input, errorMessage);
  }

  return isValid;
}
