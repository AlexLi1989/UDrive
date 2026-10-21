const toggleButtons = document.querySelectorAll(".toggle-password-btn");

toggleButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const container = this.closest(".input-with-eye-icon");
    const passwordInput = container ? container.querySelector("input") : null;

    if (passwordInput) {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.textContent = type === "password" ? "👁️" : "🕶️";
    }
  });
});
