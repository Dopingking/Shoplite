document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");

  if (!name || !email || !message) {
    popupMessage.textContent = "⚠️ Please fill in all fields before submitting.";
    popup.classList.remove("hidden");
    return;
  }

  // basic email check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    popupMessage.textContent = "❌ Please enter a valid email address.";
    popup.classList.remove("hidden");
    return;
  }

  popupMessage.textContent = "✅ Thank you! Your message has been sent.";
  popup.classList.remove("hidden");
  this.reset();
});

document.getElementById("popup-close").addEventListener("click", () => {
  document.getElementById("popup").classList.add("hidden");
});
