document.addEventListener("DOMContentLoaded", () => {
  const avaliacoes = [
    {
      nota: 5,
      autor: "Emília",
      data: "18/02/2025",
      comentario:
        "Produto de boa qualidade e surpreendente, ótimo custo-benefício.",
      util: 4,
      naoUtil: 0,
    },
    {
      nota: 5,
      autor: "franciscoreis",
      data: "09/02/2025",
      comentario: "Muito bom",
      util: 3,
      naoUtil: 1,
    },
    {
      nota: 5,
      autor: "Carlos",
      data: "10/09/2025",
      comentario:
        "Produto de boa qualidade e surpreendente, ótimo custo-benefício.",
      util: 2,
      naoUtil: 0,
    },

    {
      nota: 1,
      autor: "João",
      data: "01/01/2025",
      comentario: "Não gostei, produto veio quebrado.",
      util: 0,
      naoUtil: 5,
    },
    {
      nota: 4,
      autor: "Maria",
      data: "05/01/2025",
      comentario: "Ótimo, mas a entrega demorou um pouco.",
      util: 1,
      naoUtil: 0,
    },
    {
      nota: 5,
      autor: "Lucas",
      data: "15/01/2025",
      comentario: "Perfeito, recomendo a todos!",
      util: 6,
      naoUtil: 1,
    },
    {
      nota: 5,
      autor: "Ana",
      data: "20/01/2025",
      comentario: "Excelente, atendeu todas as minhas expectativas.",
      util: 2,
      naoUtil: 0,
    },
    {
      nota: 3,
      autor: "Pedro",
      data: "25/01/2025",
      comentario: "Bom, mas poderia ser melhor. Chegou no prazo.",
      util: 1,
      naoUtil: 1,
    },
    {
      nota: 4,
      autor: "Carla",
      data: "01/02/2025",
      comentario: "Estou satisfeita, mas a cor é um pouco diferente da foto.",
      util: 3,
      naoUtil: 0,
    },
  ];

  const totalAvaliacoes = avaliacoes.length;
  let somaNotas = 0;
  const contagemNotas = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const initialReviewsToShow = 2;

  avaliacoes.forEach((avaliacao) => {
    somaNotas += avaliacao.nota;
    contagemNotas[avaliacao.nota]++;
  });

  const notaMedia = (somaNotas / totalAvaliacoes).toFixed(1);
  document.querySelector(".fs-1").textContent = notaMedia;
  document.querySelector(
    ".text-muted.small"
  ).textContent = `${totalAvaliacoes} avaliações`;

  const estrelasResumo = document.querySelector(".text-warning.fs-5");
  estrelasResumo.innerHTML = "";
  const notaArredondada = Math.round(notaMedia * 2) / 2;
  for (let i = 1; i <= 5; i++) {
    const estrela = document.createElement("i");
    if (notaArredondada >= i) {
      estrela.classList.add("bi", "bi-star-fill");
    } else if (notaArredondada > i - 1 && notaArredondada < i) {
      estrela.classList.add("bi", "bi-star-half");
    } else {
      estrela.classList.add("bi", "bi-star");
    }
    estrelasResumo.appendChild(estrela);
  }

  const ratingBreakdownContainer = document.querySelector(".rating-breakdown");
  ratingBreakdownContainer.innerHTML = "";
  for (let i = 5; i >= 1; i--) {
    const porcentagem = ((contagemNotas[i] || 0) / totalAvaliacoes) * 100;
    const itemHtml = `
      <div class="d-flex align-items-center mb-1">
        <span class="me-2 small">${i} <i class="bi bi-star-fill text-warning"></i></span>
        <div class="progress flex-grow-1" style="height: 8px">
          <div
            class="progress-bar bg-success"
            role="progressbar"
            style="width: ${porcentagem.toFixed(2)}%"
            aria-valuenow="${porcentagem.toFixed(2)}"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <span class="ms-2 small text-muted">${porcentagem.toFixed(2)}%</span>
      </div>
    `;
    ratingBreakdownContainer.innerHTML += itemHtml;
  }

  const commentsContainer = document.querySelector(".comments-container");
  const verMaisBtn = document.querySelector(".btn-ver-mais");
  const reviewsToShow = avaliacoes.slice(0, initialReviewsToShow);

  if (avaliacoes.length > initialReviewsToShow) {
    verMaisBtn.style.display = "block";
  }

  const createCommentHtml = (avaliacao) => {
    const starIcons =
      '<div class="text-warning me-2">' +
      '<i class="bi bi-star-fill"></i>'.repeat(avaliacao.nota) +
      '<i class="bi bi-star"></i>'.repeat(5 - avaliacao.nota) +
      "</div>";

    return `
      <div class="comment-card border-bottom pb-3 mb-3">
        <div class="d-flex align-items-center mb-2">
          ${starIcons}
          <p class="small text-muted mb-0">Comentário de ${avaliacao.autor}</p>
        </div>
        <div class="small text-muted mb-2">
          <span>${avaliacao.autor} em ${avaliacao.data}</span>
          <span class="ms-2 text-success"><i class="bi bi-check-circle-fill"></i> comprador verificado</span>
        </div>
        <p class="mb-3">${avaliacao.comentario}</p>
        <div class="d-flex align-items-center">
          <p class="me-3 mb-0 small text-muted">Esta avaliação foi útil?</p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-hand-thumbs-up"></i> (${avaliacao.util})</button>
            <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-hand-thumbs-down"></i> (${avaliacao.naoUtil})</button>
          </div>
        </div>
      </div>
    `;
  };

  reviewsToShow.forEach((review) => {
    commentsContainer.innerHTML += createCommentHtml(review);
  });

  verMaisBtn.addEventListener("click", () => {
    const remainingReviews = avaliacoes.slice(initialReviewsToShow);
    remainingReviews.forEach((review) => {
      commentsContainer.innerHTML += createCommentHtml(review);
    });

    verMaisBtn.style.display = "none";
  });
});
