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
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      package: String(formData.get('package') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      website: String(formData.get('website') || '').trim() // honeypot
    };

    setSubmitting(submitBtn, true);

    try {
      const res = await fetch('https://formsubmit.co/ajax/mertegek12@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        const msg = data.message || 'Gönderim başarısız. Lütfen tekrar deneyin.';
        showStatus(errorMessage, msg);

        if (data.errors && typeof data.errors === 'object') {
          Object.entries(data.errors).forEach(([field, message]) => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
              setFieldError(input, message);
            }
          });
        }
        return;
      }

      form.reset();
      form.style.display = 'none';
      showStatus(successMessage, data.message || 'Mesajınız alındı. En kısa sürede dönüş yapacağız.');

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
    }
  }

  if (input.type === 'tel' && input.value.trim()) {
    const phoneRegex = /^[\d\s+\-()]{10,}$/;
    if (!phoneRegex.test(input.value)) {
      isValid = false;
      errorMessage = 'Geçerli bir telefon numarası girin.';
    }
  }

  if (input.minLength > 0 && input.value.trim().length < input.minLength) {
    isValid = false;
    errorMessage = `En az ${input.minLength} karakter girin.`;
  }

  if (isValid) {
    input.classList.remove('error');
    if (errorEl) errorEl.classList.remove('visible');
  } else {
    setFieldError(input, errorMessage);
  }

  return isValid;
}
