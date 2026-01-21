// assets/js/custom.js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  // Get all inputs
  const nameInput = document.getElementById('name');
  const surnameInput = document.getElementById('surname');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const addressInput = document.getElementById('address');
  const rating1Input = document.getElementById('rating1');
  const rating2Input = document.getElementById('rating2');
  const rating3Input = document.getElementById('rating3');

  // Live rating display
  [rating1Input, rating2Input, rating3Input].forEach((input, i) => {
    const span = document.getElementById(`${input.id}-value`);
    input.addEventListener('input', () => {
      span.textContent = input.value;
    });
  });

  let validationState = {
    name: false,
    surname: false,
    email: false,
    phone: false,
    address: false,
    rating1: true, // sliders have default value
    rating2: true,
    rating3: true
  };

  // Helper: set error
  function setError(input, message) {
    input.classList.add('error');
    const errorEl = document.getElementById(input.id + '-error');
    if (errorEl) errorEl.textContent = message;
    validationState[input.id] = false;
    updateSubmitButton();
  }

  // Helper: clear error
  function clearError(input) {
    input.classList.remove('error');
    const errorEl = document.getElementById(input.id + '-error');
    if (errorEl) errorEl.textContent = '';
    validationState[input.id] = true;
    updateSubmitButton();
  }

  function updateSubmitButton() {
    const allValid = Object.values(validationState).every(Boolean);
    submitBtn.disabled = !allValid;
  }

  // Validators
  const validateName = (value) => /^[A-Za-z\u00C0-\u017F\s]+$/.test(value.trim()) && value.trim().length > 1;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateAddress = (addr) => addr.trim().length >= 5;
  const validatePhone = (phone) => /^\+370 6\d{2} \d{3} \d{2}$/.test(phone);

  // Real-time validation on input
  function setupValidation(input, validator, errorMsg, emptyMsg) {
    input.addEventListener('input', () => {
      const val = input.value.trim();
      if (!val) {
        setError(input, emptyMsg);
      } else if (validator(val)) {
        clearError(input);
      } else {
        setError(input, errorMsg);
      }
    });

    // Also validate on blur (so empty fields turn red when user leaves them)
    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        setError(input, emptyMsg);
      }
    });
  }

  // Set up validators
  setupValidation(nameInput, validateName, 'Only letters allowed.', 'Name is required.');
  setupValidation(surnameInput, validateName, 'Only letters allowed.', 'Surname is required.');
  setupValidation(emailInput, validateEmail, 'Invalid email format.', 'Email is required.');
  setupValidation(addressInput, validateAddress, 'At least 5 characters.', 'Address is required.');

  // Phone masking + validation
  phoneInput.addEventListener('input', function (e) {
    let digits = e.target.value.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    if (digits && !digits.startsWith('370')) digits = '370' + digits.replace(/^370/, '');

    let formatted = '';
    if (digits) {
      formatted = '+' + digits.substring(0, 3);
      if (digits.length > 3) formatted += ' ' + digits.substring(3, 4);
      if (digits.length > 4) formatted += digits.substring(4, 6);
      if (digits.length > 6) formatted += ' ' + digits.substring(6, 9);
      if (digits.length > 9) formatted += ' ' + digits.substring(9, 11);
    }
    e.target.value = formatted;

    if (validatePhone(formatted)) {
      clearError(phoneInput);
    } else if (formatted) {
      setError(phoneInput, 'Use format: +370 6xx xxxxx');
    }
  });

  phoneInput.addEventListener('blur', () => {
    if (!phoneInput.value.trim()) {
      setError(phoneInput, 'Phone is required.');
    }
  });

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Final validation
    const data = {
      name: nameInput.value.trim(),
      surname: surnameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
      rating1: rating1Input.value,
      rating2: rating2Input.value,
      rating3: rating3Input.value
    };

    let valid = true;
    if (!data.name) { setError(nameInput, 'Name is required.'); valid = false; }
    else if (!validateName(data.name)) { setError(nameInput, 'Only letters allowed.'); valid = false; }

    if (!data.surname) { setError(surnameInput, 'Surname is required.'); valid = false; }
    else if (!validateName(data.surname)) { setError(surnameInput, 'Only letters allowed.'); valid = false; }

    if (!data.email) { setError(emailInput, 'Email is required.'); valid = false; }
    else if (!validateEmail(data.email)) { setError(emailInput, 'Invalid email.'); valid = false; }

    if (!data.phone) { setError(phoneInput, 'Phone is required.'); valid = false; }
    else if (!validatePhone(data.phone)) { setError(phoneInput, 'Invalid phone format.'); valid = false; }

    if (!data.address) { setError(addressInput, 'Address is required.'); valid = false; }
    else if (!validateAddress(data.address)) { setError(addressInput, 'At least 5 characters.'); valid = false; }

    if (!valid) return;

    // Calculate average
    const avg = ((parseFloat(data.rating1) + parseFloat(data.rating2) + parseFloat(data.rating3)) / 3).toFixed(1);

    // Log to console
    console.log('Form Data:', data);
    console.log('Average Rating:', avg);

    // Display results
    document.getElementById('result-text').innerHTML = `
      Name: ${data.name}<br>
      Surname: ${data.surname}<br>
      Email: ${data.email}<br>
      Phone number: ${data.phone}<br>
      Address: ${data.address}<br>
      Communication: ${data.rating1}<br>
      Responsibility: ${data.rating2}<br>
      Technical Knowledge: ${data.rating3}
    `;

    const avgEl = document.getElementById('average-result');
    avgEl.textContent = `${data.name} ${data.surname}: ${avg}`;
    avgEl.className = 'mt-2 fw-bold';
    if (avg <= 4) avgEl.classList.add('red');
    else if (avg <= 7) avgEl.classList.add('orange');
    else avgEl.classList.add('green');

    document.getElementById('form-results').style.display = 'block';

    // Show success popup
    const popup = document.getElementById('success-popup');
    popup.style.display = 'block';
    setTimeout(() => popup.style.display = 'none', 3000);
  });
});