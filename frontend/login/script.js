document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("senha");

  togglePassword.addEventListener("click", function (e) {
    // Altera o tipo do campo de senha
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Altera o ícone
    this.classList.toggle("bi-eye");
    this.classList.toggle("bi-eye-slash");
  });
});
