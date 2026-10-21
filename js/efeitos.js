/* ==========================================================
   EFEITOS DE ROLAGEM
   1) Paralaxe: a imagem de fundo anda mais devagar que a página.
   2) Anel de texto: além de girar sozinho (CSS), gira mais conforme a rolagem.
   ========================================================== */
const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fundos = document.querySelectorAll("[data-parallax]");
const anel = document.querySelector(".anel");
let aguardando = false;

function atualizarEfeitos() {
    aguardando = false;
    fundos.forEach(function (img) {
        const caixa = img.parentElement.getBoundingClientRect();
        if (caixa.bottom < 0 || caixa.top > window.innerHeight) return; // fora da tela
        const distanciaDoCentro = caixa.top + caixa.height / 2 - window.innerHeight / 2;
        img.style.transform = "translate3d(0," + (distanciaDoCentro * -0.1) + "px,0)";
    });
    if (anel) anel.style.setProperty("--giro", window.scrollY * 0.12 + "deg");
}

if (!reduzMovimento) {
    window.addEventListener("scroll", function () {
        if (!aguardando) {
            aguardando = true;
            requestAnimationFrame(atualizarEfeitos); // no máximo uma atualização por quadro
        }
    }, { passive: true });
    atualizarEfeitos();
}
