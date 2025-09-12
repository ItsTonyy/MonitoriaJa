document.addEventListener('DOMContentLoaded', function () {
    const cards = Array.from(document.querySelectorAll('.agendamento-card'));
    const btnAnterior = document.getElementById('btnAnterior');
    const btnProxima = document.getElementById('btnProxima');
    const paginaAtualSpan = document.getElementById('paginaAtual');
    let paginaAtual = 1;
    let cardsPorPagina = getCardsPerPage();

    function getCardsPerPage() {
        const alturaReservada = 250; 
        const alturaCard = 200; 
        const alturaDisponivel = window.innerHeight - alturaReservada;
        return Math.max(1, Math.floor(alturaDisponivel / alturaCard));
    }

    function mostrarPagina(pagina) {
        cardsPorPagina = getCardsPerPage();
        const totalPaginas = Math.ceil(cards.length / cardsPorPagina);
        paginaAtual = Math.max(1, Math.min(pagina, totalPaginas));
        cards.forEach((card, i) => {
            card.style.display = (i >= (paginaAtual - 1) * cardsPorPagina && i < paginaAtual * cardsPorPagina) ? '' : 'none';
        });
        paginaAtualSpan.textContent = paginaAtual;
        btnAnterior.disabled = paginaAtual === 1;
        btnProxima.disabled = paginaAtual === totalPaginas;
    }

    btnAnterior.addEventListener('click', () => mostrarPagina(paginaAtual - 1));
    btnProxima.addEventListener('click', () => mostrarPagina(paginaAtual + 1));
    window.addEventListener('resize', () => mostrarPagina(paginaAtual));

    mostrarPagina(1);
});