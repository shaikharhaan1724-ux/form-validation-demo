// Validation Rules
const validationRules = {
  name: {
    validate: (value) => value.trim().length >= 3,
    error: "Name must be at least 3 characters long"
  },
  email: {
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value.trim());
    },
    error: "Please enter a valid email address"
  },
  password: {
    validate: (value) => {
      return value.length >= 8 &&
             /[A-Z]/.test(value) &&
             /[a-z]/.test(value) &&
             /\d/.test(value);
    },
    error: "Password must meet all requirements"
  },
  confirmPassword: {
    validate: (value, formData) => value === formData.password,
    error: "Passwords do not match"
  }
};

// Get form elements
const form = document.getElementById('validationForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

// Form data object
const formData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};

// Validation state
const validationState = {
  name: false,
  email: false,
  password: false,
  confirmPassword: false
};

/**
 * Update password requirements display
 */
function updatePasswordRequirements(password) {
  const requirementLength = document.getElementById('requirementLength');
  const requirementMixedCase = document.getElementById('requirementMixedCase');
  const requirementNumber = document.getElementById('requirementNumber');

  const hasLength = password.length >= 8;
  const hasMixedCase = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  updateRequirementUI(requirementLength, hasLength);
  updateRequirementUI(requirementMixedCase, hasMixedCase);
  updateRequirementUI(requirementNumber, hasNumber);
}

/**
 * Update individual requirement element
 */
function updateRequirementUI(element, isMet) {
  if (isMet) {
    element.classList.remove('text-gray-400');
    element.classList.add('text-green-500');
  } else {
    element.classList.remove('text-green-500');
    element.classList.add('text-gray-400');
  }
}

/**
 * Validate a single field
 */
function validateField(fieldName) {
  const input = document.getElementById(fieldName);
  const errorElement = document.getElementById(`${fieldName}Error`);
  const rule = validationRules[fieldName];

  const value = input.value;
  formData[fieldName] = value;

  let isValid = false;
  let errorMessage = '';

  if (value === '') {
    errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    isValid = false;
  } else {
    isValid = rule.validate(value, formData);
    if (!isValid) {
      errorMessage = rule.error;
    }
  }

  // Update validation state
  validationState[fieldName] = isValid;

  // Update UI
  updateFieldUI(input, errorElement, isValid, errorMessage);

  // Special handling for password field
  if (fieldName === 'password') {
    updatePasswordRequirements(value);
    // Re-validate confirm password if it has a value
    if (confirmPasswordInput.value) {
      validateField('confirmPassword');
    }
  }

  // Update submit button state
  updateSubmitButton();
}

/**
 * Update field UI based on validation state
 */
function updateFieldUI(input, errorElement, isValid, errorMessage) {
  if (input.value === '') {
    // Empty state - neutral styling
    input.classList.remove('border-red-500', 'border-green-500');
    input.classList.add('border-gray-300');
    errorElement.classList.add('hidden');
  } else if (isValid) {
    // Valid state
    input.classList.remove('border-red-500', 'border-gray-300');
    input.classList.add('border-green-500');
    errorElement.classList.add('hidden');
  } else {
    // Invalid state
    input.classList.remove('border-green-500', 'border-gray-300');
    input.classList.add('border-red-500');
    errorElement.textContent = errorMessage;
    errorElement.classList.remove('hidden');
  }
}

/**
 * Update submit button state
 */
function updateSubmitButton() {
  const allValid = Object.values(validationState).every(state => state === true);
  const allFieldsFilled = [nameInput, emailInput, passwordInput, confirmPasswordInput]
    .every(input => input.value.trim() !== '');

  submitBtn.disabled = !(allValid && allFieldsFilled);
}

/**
 * Handle form submission
 */
function handleSubmit(e) {
  e.preventDefault();

  // Validate all fields one more time
  ['name', 'email', 'password', 'confirmPassword'].forEach(fieldName => {
    validateField(fieldName);
  });

  // Check if all fields are valid
  const allValid = Object.values(validationState).every(state => state === true);

  if (allValid) {
    // Show success message
    form.classList.add('hidden');
    successMessage.classList.remove('hidden');

    // Log form data (in a real app, send to server)
    console.log('Form submitted successfully:', {
      name: formData.name,
      email: formData.email,
      password: '***hidden***'
    });

    // Reset form after 3 seconds
    setTimeout(() => {
      form.classList.remove('hidden');
      successMessage.classList.add('hidden');
      form.reset();
      ['name', 'email', 'password', 'confirmPassword'].forEach(fieldName => {
        validationState[fieldName] = false;
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`);
        input.classList.remove('border-red-500', 'border-green-500');
        input.classList.add('border-gray-300');
        errorElement.classList.add('hidden');
      });
      updatePasswordRequirements('');
      updateSubmitButton();
    }, 3000);
  }
}

// Add event listeners
nameInput.addEventListener('input', () => validateField('name'));
emailInput.addEventListener('input', () => validateField('email'));
passwordInput.addEventListener('input', () => validateField('password'));
confirmPasswordInput.addEventListener('input', () => validateField('confirmPassword'));

// Add blur listeners for better UX
nameInput.addEventListener('blur', () => validateField('name'));
emailInput.addEventListener('blur', () => validateField('email'));
passwordInput.addEventListener('blur', () => validateField('password'));
confirmPasswordInput.addEventListener('blur', () => validateField('confirmPassword'));

form.addEventListener('submit', handleSubmit);
