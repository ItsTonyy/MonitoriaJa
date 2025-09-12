document.addEventListener('DOMContentLoaded', function () {
    const inputMateria = document.getElementById('inputMateria');
    const selectMateria = document.getElementById('selectMateria');
    const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');
    const monitoresLista = document.querySelector('.row-monitores');
    const inputBuscaNome = document.getElementById('inputBuscaNome');
    const btnBuscarNome = document.getElementById('btnBuscarNome');
    const btnMostrarTodos = document.getElementById('btnMostrarTodos');
    const cards = Array.from(document.querySelectorAll('.monitor-card'));
    const btnAnterior = document.getElementById('btnAnterior');
    const btnProxima = document.getElementById('btnProxima');
    const paginaAtualSpan = document.getElementById('paginaAtual');
    let paginaAtual = 1;

    function getCardsPerPage() {
        
        const alturaReservada = 250;
        const alturaCard = 200;
        const alturaDisponivel = window.innerHeight - alturaReservada;
        let cardsPorPagina = Math.max(1, Math.floor(alturaDisponivel / alturaCard));
        if (window.innerWidth >= 1400) {
            cardsPorPagina *= 2;
        }
        return cardsPorPagina;
    }

    function mostrarPagina(pagina) {
        const cardsVisiveis = cards.filter(card => !card.classList.contains('filtrado'));
        let cardsPorPagina = getCardsPerPage();
        const totalPaginas = Math.ceil(cardsVisiveis.length / cardsPorPagina);
        paginaAtual = Math.max(1, Math.min(pagina, totalPaginas));
        let idx = 0;
        cards.forEach(card => {
            if (card.classList.contains('filtrado')) {
                card.style.display = 'none';
                return;
            }
            if (idx >= (paginaAtual - 1) * cardsPorPagina && idx < paginaAtual * cardsPorPagina) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
            idx++;
        });
        paginaAtualSpan.textContent = paginaAtual;
        btnAnterior.disabled = paginaAtual === 1;
        btnProxima.disabled = paginaAtual === totalPaginas || totalPaginas === 0;
    }

    inputMateria.addEventListener('input', function () {
        const filtro = inputMateria.value.toLowerCase();
        Array.from(selectMateria.options).forEach(option => {
            const palavras = option.text.toLowerCase().split(' ');
            option.style.display = palavras.some(word => word.startsWith(filtro)) ? '' : 'none';
        });
    });

    btnAplicarFiltro.addEventListener('click', function () {
        const materiaSelecionada = selectMateria.value.toLowerCase();
        let algumFiltro = false;
        cards.forEach(card => {
            const materiaCard = card.querySelector('.monitor-materia');
            if (materiaCard) {
                const materiaTexto = materiaCard.textContent.toLowerCase();
                const palavras = materiaTexto.split(' ');
                if (palavras.some(word => word.startsWith(materiaSelecionada))) {
                    card.classList.remove('filtrado');
                    algumFiltro = true;
                } else {
                    card.classList.add('filtrado');
                }
            } else {
                card.classList.add('filtrado');
            }
        });
        btnMostrarTodos.style.display = algumFiltro ? '' : '';
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalFiltro'));
        modal.hide();
        mostrarPagina(1);
    });

    btnBuscarNome && btnBuscarNome.addEventListener('click', function () {
        const nomeBusca = inputBuscaNome.value.trim().toLowerCase();
        let algumFiltro = false;
        cards.forEach(card => {
            const nomeCard = card.querySelector('.monitor-nome');
            if (nomeCard) {
                const nomeTexto = nomeCard.textContent.toLowerCase();
                const palavras = nomeTexto.split(' ');
                if (palavras.some(word => word.startsWith(nomeBusca))) {
                    card.classList.remove('filtrado');
                    algumFiltro = true;
                } else {
                    card.classList.add('filtrado');
                }
            } else {
                card.classList.add('filtrado');
            }
        });
        btnMostrarTodos.style.display = nomeBusca ? '' : 'none';
        mostrarPagina(1);
    });

    btnMostrarTodos && btnMostrarTodos.addEventListener('click', function () {
        cards.forEach(card => {
            card.classList.remove('filtrado');
        });
        btnMostrarTodos.style.display = 'none';
        inputBuscaNome.value = '';
        mostrarPagina(1);
    });

    if (btnAnterior && btnProxima && paginaAtualSpan) {
        btnAnterior.addEventListener('click', () => mostrarPagina(paginaAtual - 1));
        btnProxima.addEventListener('click', () => mostrarPagina(paginaAtual + 1));
        window.addEventListener('resize', () => mostrarPagina(paginaAtual));
    }

    mostrarPagina(1);
});