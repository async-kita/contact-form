import "../styles/style.css";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  const toast = document.querySelector(".toast");

  if(!form || !toast) return;

  // Input
  const firstNameInput = document.getElementById("first-name");
  const lastNameInput = document.getElementById("last-name");
  const emailInput = document.getElementById("email");
  const messageTextarea = document.getElementById("message");

  // Radio
  const queryTypeRadio = document.querySelectorAll("input[name='query-type']");
  const queryFields = queryTypeRadio[0]?.closest(".field-group--fieldset");

  // Checkbox
  const consentCheckbox = document.getElementById("consent");
  const consentGroup = consentCheckbox?.closest(".field-group--checkbox");

  // All fields
  const fieldGroups = document.querySelectorAll(".field-group, .field-group--fieldset, .field-group--checkbox");

  // Timer
  let timerToast = null;

  function clearAllError() {
    fieldGroups.forEach(group => {
      group.removeAttribute("aria-invalid");
    })
  }

  function setError(group) {
    group.setAttribute("aria-invalid", "true")
  }

  function showToast() {
    if(timerToast) {
      clearTimeout(timerToast);
    }

    toast.hidden = false;
    toast.setAttribute("aria-hidden", "false");

    timerToast = setTimeout(() => {
      hideToast();
    }, 3000);
  }

  function hideToast() {
    toast.setAttribute("aria-hidden", "true");
    toast.addEventListener("transitionend", function handler() {
      toast.hidden = true;
      toast.removeEventListener("transitionend", handler);
    })

    setTimeout(() => {
      if(toast.getAttribute("aria-hidden") === true) {
        toast.hidden = true;
      }
    }, 400);
  }

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    clearAllError();

    let isValid = true;

    if(firstNameInput.value.trim() === "") {
      setError(firstNameInput.closest(".field-group"));
      isValid = false;
    }

    if(lastNameInput.value.trim() === "") {
      setError(lastNameInput.closest(".field-group"));
      isValid = false;
    }

    const emailValue = emailInput.value.trim();
    if(emailValue === "") {
      setError(emailInput.closest(".field-group"));
      isValid = false;
    } else if (!isValidEmail(emailValue)) {
      setError(emailInput.closest(".field-group"));
      isValid = false;
    }

    const queryChecked = document.querySelector("input[name='query-type']:checked");
    if(!queryChecked && queryFields) {
      setError(queryFields);
      isValid = false;
    }

    if(messageTextarea.value.trim() === "") {
      setError(messageTextarea.closest(".field-group"));
      isValid = false;
    }

    if(!consentCheckbox.checked && consentGroup) {
      setError(consentGroup);
      isValid = false;
    }

    if(isValid) {
      showToast();

      form.reset();
    }
  })

  document.addEventListener("keydown", (event) => {
    if(event.key === "Escape" && toast.getAttribute("aria-hidden") === "false") {
      hideToast();
    }
  })

  const inputsToWatch = [
    firstNameInput,
    lastNameInput,
    emailInput,
    messageTextarea,
  ]

  inputsToWatch.forEach(input => {
    if(!input) return;
    input.addEventListener("input", () => {
      const group = input.closest(".field-group");
      if(group && group.hasAttribute("aria-invalid")) {
        group.removeAttribute("aria-invalid");
      }
    })
  })

  queryTypeRadio.forEach((radio) => {
    radio.addEventListener("change", () => {
      if(queryFields && queryFields.closest(".field-group")) {
        queryFields.removeAttribute("aria-invalid");
      }
    })
  })

  if(consentCheckbox) {
    consentCheckbox.addEventListener("change", () => {
      if(consentGroup && consentGroup.hasAttribute("aria-invalid")) {
        consentGroup.removeAttribute("aria-invalid");
      }
    })
  }
})