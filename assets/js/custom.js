// === "Works!" Feedback on Button/Link Click ===
document.addEventListener('DOMContentLoaded', () => {
  const interactiveElements = document.querySelectorAll('.hover-btn, .nav-link');
  const message = document.getElementById('message');

  function showMessage() {
    message.classList.add('show');
    setTimeout(() => {
      message.classList.remove('show');
    }, 3000);
  }

  interactiveElements.forEach(el => {
    el.addEventListener('click', function(e) {
      if (el.tagName === 'A') {
        e.preventDefault();
        const targetId = el.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const target = document.querySelector(targetId);
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        }
      }
      showMessage();
    });
  });

  // === Contact Form Validation & Submission ===
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const resultsDiv = document.getElementById('results');
  const popup = document.getElementById('successPopup');

  // Update rating displays
  ['rating1', 'rating2', 'rating3'].forEach(id => {
    const slider = document.getElementById(id);
    const valueSpan = document.getElementById(id + 'Value');
    slider.addEventListener('input', () => {
      valueSpan.textContent = slider.value;
      validateForm();
    });
  });

  // Real-time validation
  const fields = ['name', 'surname', 'email', 'phone', 'address'];
  fields.forEach(field => {
    document.getElementById(field).addEventListener('input', validateForm);
  });

  function validateForm() {
    let valid = true;

    // Name
    const name = document.getElementById('name').value.trim();
    const nameValid = /^[A-Za-z\s]+$/.test(name) && name.length > 0;
    toggleError('name', !nameValid, nameValid ? '' : 'Name must contain only letters.');

    // Surname
    const surname = document.getElementById('surname').value.trim();
    const surnameValid = /^[A-Za-z\s]+$/.test(surname) && surname.length > 0;
    toggleError('surname', !surnameValid, surnameValid ? '' : 'Surname must contain only letters.');

    // Email
    const email = document.getElementById('email').value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length > 0;
    toggleError('email', !emailValid, emailValid ? '' : 'Please enter a valid email.');

    // Phone
    const phone = document.getElementById('phone').value.trim();
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('370')) {
      digits = digits.substring(3);
    }
    const phoneValid = digits.length === 8 || digits.length === 9;
    toggleError('phone', !phoneValid, phoneValid ? '' : 'Enter a valid Lithuanian phone number (8 or 9 digits after +370).');

    // Address
    const address = document.getElementById('address').value.trim();
    const addressValid = address.length >= 5;
    toggleError('address', !addressValid, addressValid ? '' : 'Address must be at least 5 characters.');

    valid = nameValid && surnameValid && emailValid && phoneValid && addressValid;
    submitBtn.disabled = !valid;
    return valid;
  }

  function toggleError(field, hasError, message) {
    const input = document.getElementById(field);
    const error = document.getElementById(field + 'Error');
    input.classList.toggle('error', hasError);
    error.textContent = message;
  }

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      name: document.getElementById('name').value.trim(),
      surname: document.getElementById('surname').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      address: document.getElementById('address').value.trim(),
      rating1: parseInt(document.getElementById('rating1').value),
      rating2: parseInt(document.getElementById('rating2').value),
      rating3: parseInt(document.getElementById('rating3').value)
    };

    console.log('Form Data:', data);

    const avg = ((data.rating1 + data.rating2 + data.rating3) / 3).toFixed(1);
    let color = 'red';
    if (avg >= 7) color = 'green';
    else if (avg >= 4) color = 'orange';

    resultsDiv.innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Surname:</strong> ${data.surname}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone number:</strong> ${data.phone}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p class="average ${color}">${data.name} ${data.surname}: ${avg}</p>
    `;
    resultsDiv.style.display = 'block';

    popup.classList.remove('hidden');
    setTimeout(() => popup.classList.add('hidden'), 3000);
  });
});