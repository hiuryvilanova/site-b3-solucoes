/* ============================================
   B3 Soluções — Form Handling
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initForms();
});

function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');
  if (!forms.length) return;

  forms.forEach(form => {
    // Real-time validation on blur
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          validateField(field);
        }
      });
    });

    // Submit handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = form.querySelectorAll('[required]');
      let isValid = true;

      fields.forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (isValid) {
        showSuccess(form);
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  let isValid = true;
  let message = '';

  // Check required
  if (field.required && !value) {
    isValid = false;
    message = 'Este campo é obrigatório';
  }

  // Check email
  if (isValid && type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      message = 'Informe um e-mail válido';
    }
  }

  // Check phone
  if (isValid && type === 'tel' && value) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 11) {
      isValid = false;
      message = 'Informe um telefone válido';
    }
  }

  // Check select
  if (isValid && field.tagName === 'SELECT' && field.required && !value) {
    isValid = false;
    message = 'Selecione uma opção';
  }

  // Update UI
  const group = field.closest('.form-group');
  if (!group) return isValid;

  const existingError = group.querySelector('.form-error');

  if (!isValid) {
    field.classList.add('error');
    field.style.borderColor = 'var(--color-error)';

    if (existingError) {
      existingError.textContent = message;
    } else {
      const errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      errorEl.textContent = message;
      errorEl.style.cssText = 'display:block;font-size:0.75rem;color:var(--color-error);margin-top:4px;';
      group.appendChild(errorEl);
    }
  } else {
    field.classList.remove('error');
    field.style.borderColor = '';
    if (existingError) existingError.remove();
  }

  return isValid;
}

function showSuccess(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  submitBtn.textContent = 'Enviado com sucesso! ✓';
  submitBtn.style.background = 'var(--color-success)';
  submitBtn.style.borderColor = 'var(--color-success)';
  submitBtn.disabled = true;

  // Show premium success toast alert
  if (form.classList.contains('newsletter-form')) {
    showToast('Inscrição realizada com sucesso! Você receberá nossas atualizações.', 'success');
  } else {
    showToast('Mensagem enviada com sucesso! Retornaremos o contato em breve.', 'success');
  }

  // Reset form
  setTimeout(() => {
    form.reset();
    submitBtn.textContent = originalText;
    submitBtn.style.background = '';
    submitBtn.style.borderColor = '';
    submitBtn.disabled = false;
  }, 3000);
}

/* ── Phone mask ── */
document.addEventListener('input', (e) => {
  if (e.target.type === 'tel') {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);

    if (value.length > 6) {
      value = `(${value.substring(0,2)}) ${value.substring(2,7)}-${value.substring(7)}`;
    } else if (value.length > 2) {
      value = `(${value.substring(0,2)}) ${value.substring(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }

    e.target.value = value;
  }
});


/* ── Dynamic Success Toast ── */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = document.createElement('div');
  icon.style.display = 'flex';
  icon.style.alignItems = 'center';
  
  if (type === 'success') {
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  } else {
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-error)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  }

  const text = document.createElement('div');
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);

  // Trigger animation after adding to DOM
  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  // Hide and remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 400);
  }, 4000);
}
