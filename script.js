/* =======================================================
   MENU HAMBÚRGUER (MOBILE)
======================================================= */
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const menuBackdrop = document.querySelector('.menu-backdrop');
const linksMenu = document.querySelectorAll('.menu a');

function atualizarMenu(aberto) {
    menu.classList.toggle('ativo', aberto);
    menuToggle.classList.toggle('ativo', aberto);
    document.body.classList.toggle('menu-aberto', aberto);
    menuToggle.setAttribute('aria-expanded', String(aberto));
    menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

if (menuToggle && menu) {
    // Abre e fecha o menu ao clicar no botão hambúrguer
    menuToggle.addEventListener('click', () => {
        atualizarMenu(!menu.classList.contains('ativo'));
    });

    menuBackdrop?.addEventListener('click', () => atualizarMenu(false));

    // Fecha o menu automaticamente quando o usuário clica em um link
    linksMenu.forEach((link) => {
        link.addEventListener('click', () => atualizarMenu(false));
    });

    // Permite fechar o menu pelo teclado.
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && menu.classList.contains('ativo')) {
            atualizarMenu(false);
            menuToggle.focus();
        }
    });

    window.matchMedia('(min-width: 901px)').addEventListener('change', (evento) => {
        if (evento.matches) atualizarMenu(false);
    });
}

/* =======================================================
   EFEITO NAVBAR: Sombra ao rolar a página
======================================================= */
const navbar = document.querySelector('.navbar');

function atualizarNavbar() {
    navbar?.classList.toggle('rolagem', window.scrollY > 50);

    const alturaRolavel = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = alturaRolavel > 0 ? (window.scrollY / alturaRolavel) * 100 : 0;
    navbar?.style.setProperty('--progresso-scroll', `${Math.min(progresso, 100)}%`);
}

atualizarNavbar();
window.addEventListener('scroll', atualizarNavbar, { passive: true });

/* =======================================================
   SCROLL REVEAL: Animação de surgimento
======================================================= */
const elementosOcultos = document.querySelectorAll('.reveal');

document.querySelectorAll('.beneficios-grid, .passos-grid, .adesao-grid, .galeria-medica').forEach((grupo) => {
    [...grupo.children].forEach((elemento, indice) => {
        if (elemento.classList.contains('reveal')) {
            elemento.style.setProperty('--reveal-delay', `${Math.min(indice * 90, 360)}ms`);
        }
    });
});

if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('ativo');
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.15
    });

    elementosOcultos.forEach((elemento) => observador.observe(elemento));

    const gruposAnimados = document.querySelectorAll('.faixa-confianca-grid');
    const observadorGrupos = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('grupo-ativo');
                observadorGrupos.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.18 });

    gruposAnimados.forEach((grupo) => observadorGrupos.observe(grupo));

} else {
    elementosOcultos.forEach((elemento) => elemento.classList.add('ativo'));
    document.querySelectorAll('.faixa-confianca-grid').forEach((grupo) => grupo.classList.add('grupo-ativo'));
}

const linksInternos = [...linksMenu].filter((link) => link.hash);
const secoesMenu = linksInternos
    .map((link) => ({ link, secao: document.querySelector(link.hash) }))
    .filter(({ secao }) => Boolean(secao));

let navegacaoFrame = null;

function atualizarLinkAtivo() {
    const linhaLeitura = window.scrollY + window.innerHeight * 0.42;
    const secoesOrdenadas = [...secoesMenu]
        .sort((a, b) => a.secao.offsetTop - b.secao.offsetTop);
    let hashAtiva = '';

    secoesOrdenadas.forEach(({ link, secao }) => {
        if (secao.offsetTop <= linhaLeitura) hashAtiva = link.hash;
    });

    linksInternos.forEach((link) => {
        const ativo = link.hash === hashAtiva;
        link.classList.toggle('ativo', ativo);
        if (ativo) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });

    navegacaoFrame = null;
}

function solicitarAtualizacaoNavegacao() {
    if (navegacaoFrame !== null) return;
    navegacaoFrame = requestAnimationFrame(atualizarLinkAtivo);
}

window.addEventListener('scroll', solicitarAtualizacaoNavegacao, { passive: true });
window.addEventListener('resize', solicitarAtualizacaoNavegacao);
window.addEventListener('load', solicitarAtualizacaoNavegacao);
atualizarLinkAtivo();
