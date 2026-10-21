/* ==========================================================
   CARDÁPIO: monta a lista, filtra pela busca e envia o pedido ao WhatsApp.
   ATENÇÃO: itens e preços são EXEMPLOS. Cada item é [nome, descrição, preço].
   ========================================================== */
const WHATSAPP = "5500000000000"; // trocar: 55 + DDD + número

const CARDAPIO = [
    { id: "temakis", nome: "Temakis", obs: "Cone de alga crocante, arroz e recheio. Enrolado depois do pedido.", itens: [
        ["Salmão com cebolinha", "Salmão, cream cheese e cebolinha.", 26.9],
        ["Philadelphia", "Salmão, cream cheese e pepino.", 27.9],
        ["Salmão skin", "Pele de salmão crocante, cebolinha e molho tarê.", 24.9],
        ["Salmão grelhado", "Salmão grelhado, cream cheese e molho tarê.", 28.9],
        ["Camarão empanado", "Camarão empanado, cream cheese e abacate.", 29.9],
        ["Atum spicy", "Atum picado com maionese picante e cebolinha.", 31.9],
        ["Kani cheese", "Kani, cream cheese e gergelim.", 22.9],
        ["Vegetariano", "Pepino, cenoura, abacate e cream cheese.", 21.9]] },
    { id: "combinados", nome: "Combinados", obs: "Para dividir.", itens: [
        ["Combo dupla", "2 temakis à escolha e 8 uramakis.", 64.9],
        ["Combinado 20 peças", "6 nigiris, 6 uramakis e 8 hossomakis.", 69.9],
        ["Combinado 40 peças", "10 nigiris, 12 uramakis, 8 hot rolls e 10 hossomakis.", 119.9],
        ["Combo festa", "6 temakis à escolha e 16 hot rolls.", 189.9]] },
    { id: "rolls", nome: "Rolls", obs: "Cada porção vem com 8 peças.", itens: [
        ["Uramaki com ovas", "Salmão, cream cheese e pepino, cobertos com ovas tobiko.", 34.9],
        ["Uramaki salmão grelhado", "Salmão grelhado, cream cheese e cebolinha.", 33.9],
        ["Hot roll de camarão", "Camarão empanado e abacate, com molho tarê.", 32.9],
        ["Hot roll philadelphia", "Salmão, cream cheese e cebolinha, empanado e frito.", 31.9],
        ["Hossomaki de pepino", "Pepino e gergelim, enrolado em alga nori.", 18.9]] },
    { id: "sushis", nome: "Nigiris e sashimis", obs: "Direto da bancada.", itens: [
        ["Nigiri de salmão", "5 unidades, com cebolinha e brotos.", 29.9],
        ["Nigiri maçaricado", "5 unidades, salmão maçaricado com molho tarê.", 32.9],
        ["Sashimi de salmão", "10 fatias.", 36.9],
        ["Sashimi misto", "12 fatias de salmão e peixe branco.", 42.9]] },
    { id: "pokes", nome: "Pokes", obs: "Arroz, base de folhas e molho shoyu.", itens: [
        ["Poke de salmão", "Salmão, manga, pepino, edamame e gergelim.", 38.9],
        ["Poke de camarão", "Camarão, abacate, pepino e cebolinha.", 39.9],
        ["Poke vegetariano", "Tofu, manga, cenoura, pepino e edamame.", 32.9]] },
    { id: "quentes", nome: "Pratos quentes", obs: "Saem da cozinha direto para a embalagem.", itens: [
        ["Yakisoba de legumes", "Macarrão, legumes frescos e molho shoyu.", 34.9],
        ["Yakisoba misto", "Macarrão, frango, carne e legumes.", 39.9],
        ["Guioza", "6 unidades, recheio de carne suína.", 24.9],
        ["Tempurá de camarão", "6 unidades, com molho agridoce.", 36.9]] },
    { id: "bebidas", nome: "Bebidas", obs: "", itens: [
        ["Água", "Sem gás, 500 ml.", 6],
        ["Refrigerante", "Lata, 350 ml.", 7],
        ["Chá gelado", "Garrafa, 450 ml.", 9],
        ["Cerveja long neck", "Para maiores de 18 anos.", 14]] },
    { id: "sobremesas", nome: "Sobremesas", obs: "", itens: [
        ["Harumaki de banana", "4 unidades, com doce de leite.", 19.9],
        ["Mochi de sorvete", "3 unidades.", 22.9]] }
];

// "Salmão skin" vira "salmao_skin": o nome do item é o nome do arquivo em img/cardapio/
const arquivo = (nome) => nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "_");
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pedido = {}; // guarda a quantidade de cada item: { "0-1": 2 }
const lista = document.getElementById("lista");
const abas = document.getElementById("abas");

// 1) Monta abas e categorias a partir da lista CARDAPIO
CARDAPIO.forEach(function (cat, c) {
    abas.insertAdjacentHTML("beforeend", '<li><a href="#' + cat.id + '">' + cat.nome + "</a></li>");
    const itens = cat.itens.map(function (it, i) {
        return '<li class="item" data-k="' + c + "-" + i + '" data-busca="' + (it[0] + " " + it[1]).toLowerCase() + '">' +
            '<img src="img/cardapio/' + arquivo(it[0]) + '.jpg" alt="" width="88" height="88" loading="lazy" />' +
            "<div><h3>" + it[0] + "</h3><p>" + it[1] + "</p></div>" +
            '<span class="preco">' + brl(it[2]) + "</span>" +
            '<div class="qtd"><button type="button" data-d="-1" aria-label="Tirar ' + it[0] + '">−</button>' +
            '<output aria-live="polite">0</output>' +
            '<button type="button" data-d="1" aria-label="Adicionar ' + it[0] + '">+</button></div></li>';
    }).join("");
    lista.insertAdjacentHTML("beforeend",
        '<section class="categoria" id="' + cat.id + '"><h2>' + cat.nome.toLowerCase() + ".</h2>" +
        (cat.obs ? '<p class="obs">' + cat.obs + "</p>" : "") + '<ul class="itens">' + itens + "</ul></section>");
});

// 2) Clique nos botões + e -
lista.addEventListener("click", function (e) {
    const botao = e.target.closest("button[data-d]");
    if (!botao) return;
    const li = botao.closest(".item");
    const k = li.dataset.k;
    pedido[k] = Math.max(0, (pedido[k] || 0) + Number(botao.dataset.d));
    li.querySelector("output").textContent = pedido[k];
    atualizar();
});

// 3) Atualiza barra, resumo, total e o link do WhatsApp
function linhasDoPedido() {
    return Object.keys(pedido).filter((k) => pedido[k] > 0).map(function (k) {
        const par = k.split("-");
        const it = CARDAPIO[par[0]].itens[par[1]];
        return { nome: it[0], qtd: pedido[k], subtotal: it[2] * pedido[k] };
    });
}

function atualizar() {
    const linhas = linhasDoPedido();
    const total = linhas.reduce((s, l) => s + l.subtotal, 0);
    const unidades = linhas.reduce((s, l) => s + l.qtd, 0);
    document.getElementById("barra").hidden = unidades === 0;
    document.body.classList.toggle("com-pedido", unidades > 0);
    document.getElementById("resumo-barra").textContent = unidades + (unidades === 1 ? " item · " : " itens · ") + brl(total);
    document.getElementById("resumo").innerHTML = linhas.map((l) =>
        "<li><span>" + l.qtd + "x " + l.nome + "</span><span>" + brl(l.subtotal) + "</span></li>").join("");
    document.getElementById("total").textContent = brl(total);

    let msg = "Olá! Quero fazer um pedido na Akira Rolls:\n\n" +
        linhas.map((l) => l.qtd + "x " + l.nome + " - " + brl(l.subtotal)).join("\n") + "\n\nTotal: " + brl(total);
    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const obs = document.getElementById("obs").value.trim();
    if (nome) msg += "\nNome: " + nome;
    if (endereco) msg += "\nEndereço: " + endereco;
    if (obs) msg += "\nObs: " + obs;
    document.getElementById("enviar").href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
}

["nome", "endereco", "obs"].forEach((id) => document.getElementById(id).addEventListener("input", atualizar));

// 4) Abrir e fechar a janela do pedido
const painel = document.getElementById("painel");
document.getElementById("abrir").addEventListener("click", () => painel.showModal());
document.getElementById("fechar").addEventListener("click", () => painel.close());

// 5) Busca: esconde itens que não combinam e categorias vazias
document.getElementById("busca").addEventListener("input", function (e) {
    const q = e.target.value.trim().toLowerCase();
    let achou = 0;
    lista.querySelectorAll(".categoria").forEach(function (sec) {
        let visiveis = 0;
        sec.querySelectorAll(".item").forEach(function (li) {
            li.hidden = !li.dataset.busca.includes(q);
            if (!li.hidden) visiveis++;
        });
        sec.hidden = visiveis === 0;
        achou += visiveis;
    });
    document.getElementById("vazio").hidden = achou > 0;
});

atualizar();
