export function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('form-success');
  const errorMessage = document.getElementById('form-error');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    hideStatus(successMessage);
    hideStatus(errorMessage);

    if (!validateForm(form)) {
      return;
    }

    const nextUrl = window.location.origin + window.location.pathname + '#iletisim';

    form.action = 'https://formsubmit.co/mertegek12@gmail.com';
    form.method = 'POST';

    const nextInput = document.createElement('input');
    nextInput.type = 'hidden';
    nextInput.name = '_next';
    nextInput.value = nextUrl;
    form.appendChild(nextInput);

    const templateInput = document.createElement('input');
    templateInput.type = 'hidden';
    templateInput.name = '_template';
    templateInput.value = 'table';
    form.appendChild(templateInput);

    form.submit();
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
