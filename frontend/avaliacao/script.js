document.addEventListener("DOMContentLoaded", function () {
  const ratingContainer = document.getElementById("star-rating");
  const stars = ratingContainer.querySelectorAll(".star");

  stars.forEach((star) => {
    star.addEventListener("click", function () {
      const value = parseInt(this.dataset.value);

      stars.forEach((s) => s.classList.remove("active"));

      for (let i = 0; i < value; i++) {
        stars[i].classList.add("active");
      }

      console.log(`Você deu ${value} estrelas!`);
    });
  });
});
