// Contact form: validation, then hand-off to the visitor's email app (mailto).
(() => {
  const EMAIL = '05250175.jnec@rub.edu.bt';
  const form = $('#form');
  const status = $('#ok');

  function check(field, isValid, message) {
    field.setAttribute('aria-invalid', !isValid);
    field.parentElement.querySelector('.err').textContent = isValid ? '' : message;
    return isValid;
  }

  form.onsubmit = (event) => {
    event.preventDefault();
    const name = $('#n');
    const email = $('#e');
    const message = $('#m');

    const nameOk = check(name, name.value.trim().length > 1, 'Enter your name.');
    const emailOk = check(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value), 'Enter a valid email address.');
    const messageOk = check(message, message.value.trim().length > 9, 'Write at least 10 characters.');

    if (!(nameOk && emailOk && messageOk)) {
      status.textContent = '';
      return;
    }

    const subject = encodeURIComponent('Portfolio message from ' + name.value.trim());
    const body = encodeURIComponent(`${message.value}\n\n${name.value} (${email.value})`);
    location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    status.textContent = 'Your email app should open with the message ready to send.';
    form.reset();
  };
})();
