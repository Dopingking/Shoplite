document.addEventListener('DOMContentLoaded', () => {
  // ===== Hamburger Menu =====
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  // Toggle mobile menu
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('open');
  });

  // Close menu on mobile link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('open');
    });
  });

  // ===== Contact Form Popup =====
  const contactForm = document.getElementById("contact-form");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const popupClose = document.getElementById("popup-close");

  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      popupMessage.textContent = "⚠️ Please fill in all fields before submitting.";
      popup.classList.remove("hidden");
      return;
    }

    // Basic email check
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

  popupClose.addEventListener("click", () => {
    popup.classList.add("hidden");
  });
});
