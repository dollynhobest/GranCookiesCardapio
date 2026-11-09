/* ==========================================================
   GRAN COOKIES - FUNCIONAMENTO DO SITE
   O conteúdo editável do cardápio e da música fica em cardapio.js.
   ========================================================== */

function iniciarAbertura(){
  const splash = document.getElementById("introSplash");
  if(!splash) return;

  window.setTimeout(() => {
    splash.classList.add("is-leaving");
    document.body.classList.remove("intro-active");
    window.setTimeout(() => splash.remove(), 900);
  }, 1850);
}

/*
  Música sem controles visíveis.
  O navegador pode bloquear autoplay com som. Quando isso acontecer,
  o site tenta novamente no primeiro toque/clique/tecla do visitante.
  Toda a configuração fica em CONFIGURACAO_MUSICA, no cardapio.js.
*/
function iniciarMusica(){
  const audio = document.getElementById("backgroundMusic");
  if(!audio || !CONFIGURACAO_MUSICA || !CONFIGURACAO_MUSICA.arquivo) return;

  audio.src = CONFIGURACAO_MUSICA.arquivo;
  audio.volume = Math.min(1, Math.max(0, Number(CONFIGURACAO_MUSICA.volumeInicial) || 0));
  audio.loop = CONFIGURACAO_MUSICA.repetir !== false;

  let primeiraInteracaoRegistrada = false;
  const tentarTocar = () => {
    if(!audio.paused) return;
    audio.play().catch(() => {
      // A tentativa será repetida após a primeira interação, se habilitado.
    });
  };

  if(CONFIGURACAO_MUSICA.tentarAutoplay !== false){
    tentarTocar();
  }

  if(CONFIGURACAO_MUSICA.iniciarAposInteracao !== false){
    const iniciarNaInteracao = () => {
      if(primeiraInteracaoRegistrada) return;
      primeiraInteracaoRegistrada = true;
      tentarTocar();
      document.removeEventListener("pointerdown", iniciarNaInteracao);
      document.removeEventListener("keydown", iniciarNaInteracao);
    };
    document.addEventListener("pointerdown", iniciarNaInteracao, { once:true });
    document.addEventListener("keydown", iniciarNaInteracao, { once:true });
  }
}

iniciarAbertura();
iniciarMusica();

/* Cada linha do carrinho representa um produto + uma combinação de adicionais. */
let cart = [];
let mode = "Entrega";
let payment = "Pix";
let schoolDelivery = false;
let produtoEmPersonalizacao = null;

function money(v){
  return Number(v || 0).toLocaleString("pt-BR",{
    style:"currency",
    currency:"BRL"
  });
}

function esc(s){
  return String(s ?? "").replace(/[&<>"']/g,m=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[m]));
}

function renderHomePromo(){
  const box = document.getElementById("homePromo");
  if(!box) return;

  if(PROMOCAO_ENTREGA && PROMOCAO_ENTREGA.ativa){
    box.innerHTML = `
      <strong>🚚 ENTREGA GRÁTIS</strong>
      <span>Pedidos com ${PROMOCAO_ENTREGA.minimoCookies} ou mais cookies em um raio de ${String(PROMOCAO_ENTREGA.raioKm).replace(".",",")} km</span>
    `;
    box.style.display = "flex";
  } else {
    box.style.display = "none";
  }
}

function setSchool(value){
  schoolDelivery = value;
  document.getElementById("schoolYesBtn").classList.toggle("active", value);
  document.getElementById("schoolNoBtn").classList.toggle("active", !value);
  updateCheckoutTotals();
}

function availableProducts(){
  return CARDAPIO.filter(p => p.disponivel);
}

function getProduct(id){
  return CARDAPIO.find(p => p.id === id);
}

function gruposDoProduto(p){
  return Array.isArray(p.gruposAdicionais) ? p.gruposAdicionais : [];
}

// Um grupo ou uma opção fica ativo por padrão. Use disponivel:false para ocultá-lo.
function gruposAtivosDoProduto(p){
  return gruposDoProduto(p)
    .map((grupo, index) => ({ grupo, index }))
    .filter(item => item.grupo && item.grupo.disponivel !== false);
}

function opcoesAtivasDoGrupo(grupo){
  return (grupo?.opcoes || [])
    .map((opcao, index) => ({ opcao, index }))
    .filter(item => item.opcao && item.opcao.disponivel !== false);
}

function minimoDoGrupo(grupo){
  const padrao = grupo.obrigatorio === false ? 0 : 1;
  const valor = grupo.minimo == null ? padrao : Number(grupo.minimo);
  return Number.isFinite(valor) ? Math.max(0, valor) : padrao;
}

function maximoDoGrupo(grupo, quantidadeOpcoes){
  const padrao = grupo.tipo === "multipla" ? quantidadeOpcoes : 1;
  const valor = grupo.maximo == null ? padrao : Number(grupo.maximo);
  const maximo = Number.isFinite(valor) ? Math.max(0, valor) : padrao;
  return Math.min(maximo, quantidadeOpcoes);
}

// Evita exibir um produto personalizável que não possa cumprir escolhas obrigatórias.
function adicionaisDoProdutoEstaoConfigurados(p){
  return gruposAtivosDoProduto(p).every(({ grupo }) => {
    const quantidadeOpcoes = opcoesAtivasDoGrupo(grupo).length;
    return minimoDoGrupo(grupo) <= maximoDoGrupo(grupo, quantidadeOpcoes);
  });
}

function quantidadeDoProduto(productId){
  return cart.reduce((sum, line) => sum + (line.productId === productId ? line.quantity : 0), 0);
}

function limiteEstoque(p){
  const n = Number(p.estoque);
  return Number.isFinite(n) ? Math.max(0, n) : Infinity;
}

function precoDosAdicionais(selecoes){
  return (selecoes || []).reduce((sum, item) => sum + Number(item.preco || 0), 0);
}

function render(){
  const box = document.getElementById("products");
  const nav = document.getElementById("categoryNav");
  if(!box || !nav) return;

  box.innerHTML = "";
  nav.innerHTML = "";

  const disponiveis = availableProducts();
  const categoriasAtivas = CATEGORIAS.filter(cat =>
    disponiveis.some(p => (p.categoria || CATEGORIAS[0]?.id) === cat.id) || cat.mostrarVazia === true
  );

  document.getElementById("countLabel").textContent =
    disponiveis.length + (disponiveis.length === 1 ? " item disponível" : " itens disponíveis");

  // Renderiza primeiro as categorias. Assim, mostrarVazia:true funciona até
  // quando não existe nenhum produto disponível no cardápio.
  categoriasAtivas.forEach(cat => {
    nav.insertAdjacentHTML("beforeend", `
      <button class="category-chip" type="button" onclick="irParaCategoria('${esc(cat.id)}')">
        <span>${esc(cat.icone || "•")}</span> ${esc(cat.nome)}
      </button>
    `);

    const produtosDaCategoria = disponiveis.filter(p => (p.categoria || CATEGORIAS[0]?.id) === cat.id);
    if(!produtosDaCategoria.length && !cat.mostrarVazia) return;

    const section = document.createElement("section");
    section.className = "category-section";
    section.id = `categoria-${cat.id}`;
    section.innerHTML = `
      <div class="category-heading">
        <h2>${esc(cat.icone || "")} ${esc(cat.nome)}</h2>
        <small>${produtosDaCategoria.length ? `${produtosDaCategoria.length} ${produtosDaCategoria.length === 1 ? "item" : "itens"}` : ""}</small>
      </div>
      <div class="category-products"></div>
    `;

    const productsBox = section.querySelector(".category-products");
    if(!produtosDaCategoria.length){
      productsBox.innerHTML = '<div class="empty category-empty">Em breve, novidades por aqui. ☕</div>';
    } else {
      produtosDaCategoria.forEach(p => productsBox.appendChild(criarCardProduto(p)));
    }
    box.appendChild(section);
  });

  if(!disponiveis.length && !box.children.length){
    box.innerHTML = '<div class="empty">Hoje estamos sem produtos disponíveis.</div>';
  }

  updateCart();
  updateCheckoutTotals();
}

function irParaCategoria(id){
  const section = document.getElementById(`categoria-${id}`);
  if(section) section.scrollIntoView({ behavior:"smooth", block:"start" });
}

function criarCardProduto(p){
  const el = document.createElement("article");
  el.className = "card";

  const qtd = quantidadeDoProduto(p.id);
  const sold = limiteEstoque(p) <= 0;
  const gruposAtivos = gruposAtivosDoProduto(p);
  const temPersonalizacao = gruposAtivos.some(({ grupo }) => opcoesAtivasDoGrupo(grupo).length > 0);
  const personalizacaoInvalida = gruposAtivos.length > 0 && !adicionaisDoProdutoEstaoConfigurados(p);
  const emoji = p.categoria === "bebidas" ? "🥤" : "🍪";
  const photo = p.imagem
    ? `
      <div class="product-photo">
        <img src="${esc(p.imagem)}" alt="Foto de ${esc(p.nome)}" loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="photo-placeholder" style="display:none" aria-label="Foto não encontrada">${emoji}</div>
      </div>`
    : `
      <div class="product-photo">
        <div class="photo-placeholder" aria-label="Adicione a foto deste item">${emoji}</div>
      </div>`;

  const precoLabel = temPersonalizacao ? `A partir de ${money(p.preco)}` : money(p.preco);
  let acao;
  if(sold){
    acao = '<span class="badge sold">ESGOTADO</span>';
  } else if(personalizacaoInvalida){
    acao = '<span class="badge sold">INDISPONÍVEL</span>';
  } else if(temPersonalizacao){
    acao = `
      <div class="product-action-custom">
        ${qtd ? `<span class="in-cart">${qtd} no pedido</span>` : ""}
        <button class="add-custom" type="button" onclick="abrirPersonalizacao('${esc(p.id)}')">PERSONALIZAR</button>
      </div>
    `;
  } else {
    const defaultLine = cart.find(line => line.productId === p.id && !line.selecoes.length);
    const qDefault = defaultLine ? defaultLine.quantity : 0;
    acao = `
      <span class="qty">
        <button type="button" aria-label="Remover ${esc(p.nome)}" onclick="alterarProdutoSimples('${esc(p.id)}',-1)">−</button>
        <b>${qDefault}</b>
        <button type="button" aria-label="Adicionar ${esc(p.nome)}" onclick="alterarProdutoSimples('${esc(p.id)}',1)">+</button>
      </span>
    `;
  }

  el.innerHTML = `
    <div class="card-top">
      ${photo}
      <div class="info">
        <h3>${esc(p.nome)}</h3>
        <div class="desc">${esc(p.descricao)}</div>
        <div class="price">${precoLabel}</div>
      </div>
    </div>
    <div class="row">
      <span></span>
      ${acao}
    </div>
  `;
  return el;
}

function alterarProdutoSimples(productId, delta){
  const p = getProduct(productId);
  if(!p) return;
  const line = cart.find(item => item.productId === productId && !item.selecoes.length);
  if(delta > 0){
    adicionarAoCarrinho(p, []);
  } else if(line){
    alterarLinha(line.key, -1);
  }
}

function abrirPersonalizacao(productId){
  const p = getProduct(productId);
  if(!p || limiteEstoque(p) <= quantidadeDoProduto(productId)){
    alert("Esse item está esgotado ou atingiu o limite de estoque.");
    return;
  }

  produtoEmPersonalizacao = p;
  document.getElementById("customizationTitle").textContent = p.nome;
  document.getElementById("customizationDescription").textContent = p.descricao || "Escolha os adicionais do seu jeito.";
  renderizarGruposAdicionais(p);
  document.getElementById("customizationOverlay").classList.add("open");
}

function renderizarGruposAdicionais(p){
  const box = document.getElementById("customizationFields");
  box.innerHTML = gruposAtivosDoProduto(p).map(({ grupo, index }) => {
    const multiplas = grupo.tipo === "multipla";
    const opcoes = opcoesAtivasDoGrupo(grupo);
    const minimo = minimoDoGrupo(grupo);
    const maximo = maximoDoGrupo(grupo, opcoes.length);

    // Grupo opcional sem opções ativas não precisa ocupar espaço na personalização.
    if(!opcoes.length && minimo === 0) return "";

    const orientacao = multiplas
      ? `Escolha ${minimo === maximo ? `exatamente ${minimo}` : `de ${minimo} até ${maximo}`} opção(ões).`
      : (minimo === 0 ? "Escolha uma opção, se desejar." : "Escolha uma opção.");

    return `
      <section class="option-group" data-group-index="${index}">
        <div class="option-group-heading">
          <h3>${esc(grupo.titulo)}</h3>
          <small>${esc(orientacao)}</small>
        </div>
        <div class="option-list">
          ${opcoes.map(({ opcao, index: optionIndex }) => {
            const inputType = multiplas ? "checkbox" : "radio";
            const price = Number(opcao.preco || 0);
            return `
              <label class="option-choice">
                <input type="${inputType}" name="grupo-${index}" data-group="${index}" data-option="${optionIndex}">
                <span class="option-choice-name">${esc(opcao.nome)}</span>
                <strong>${price > 0 ? `+ ${money(price)}` : price < 0 ? `− ${money(Math.abs(price))}` : "Incluído"}</strong>
              </label>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("");

  box.querySelectorAll("input[data-group]").forEach(input => {
    input.addEventListener("change", atualizarTotalPersonalizacao);
  });
  atualizarTotalPersonalizacao();
}

function obterSelecoesPersonalizacao(){
  if(!produtoEmPersonalizacao) return [];
  const selecoes = [];
  document.querySelectorAll("#customizationFields input:checked").forEach(input => {
    const grupo = gruposDoProduto(produtoEmPersonalizacao)[Number(input.dataset.group)];
    const opcao = grupo?.opcoes?.[Number(input.dataset.option)];
    if(!grupo || grupo.disponivel === false || !opcao || opcao.disponivel === false) return;
    selecoes.push({
      grupoId: grupo.id,
      grupoNome: grupo.titulo,
      opcaoId: opcao.id,
      nome: opcao.nome,
      preco: Number(opcao.preco || 0)
    });
  });
  return selecoes;
}

function atualizarTotalPersonalizacao(){
  if(!produtoEmPersonalizacao) return;
  const adicionais = precoDosAdicionais(obterSelecoesPersonalizacao());
  document.getElementById("customizationTotal").textContent = money(Number(produtoEmPersonalizacao.preco) + adicionais);
}

function confirmarPersonalizacao(){
  if(!produtoEmPersonalizacao) return;
  const selecoes = obterSelecoesPersonalizacao();

  for(const { grupo } of gruposAtivosDoProduto(produtoEmPersonalizacao)){
    const quantidade = selecoes.filter(item => item.grupoId === grupo.id).length;
    const quantidadeOpcoes = opcoesAtivasDoGrupo(grupo).length;
    const minimo = minimoDoGrupo(grupo);
    const maximo = maximoDoGrupo(grupo, quantidadeOpcoes);

    if(quantidade < minimo){
      alert(`Escolha pelo menos ${minimo} opção(ões) em "${grupo.titulo}".`);
      return;
    }
    if(quantidade > maximo){
      alert(`Escolha no máximo ${maximo} opção(ões) em "${grupo.titulo}".`);
      return;
    }
  }

  adicionarAoCarrinho(produtoEmPersonalizacao, selecoes);
  fecharPersonalizacao();
}

function fecharPersonalizacao(){
  document.getElementById("customizationOverlay").classList.remove("open");
  produtoEmPersonalizacao = null;
}

function adicionarAoCarrinho(p, selecoes){
  if(quantidadeDoProduto(p.id) >= limiteEstoque(p)){
    alert("Você atingiu o limite de estoque deste item.");
    return;
  }

  const chaveOpcoes = selecoes
    .map(item => `${item.grupoId}:${item.opcaoId}`)
    .sort()
    .join("|");
  const key = `${p.id}::${chaveOpcoes}`;
  const existente = cart.find(item => item.key === key);

  if(existente) existente.quantity += 1;
  else cart.push({ key, productId:p.id, quantity:1, selecoes:selecoes.map(item => ({...item})) });

  render();
}

function alterarLinha(key, delta){
  const line = cart.find(item => item.key === key);
  if(!line) return;
  const p = getProduct(line.productId);
  if(!p) return;

  if(delta > 0 && quantidadeDoProduto(p.id) >= limiteEstoque(p)){
    alert("Você atingiu o limite de estoque deste item.");
    return;
  }

  line.quantity = Math.max(0, line.quantity + delta);
  if(line.quantity === 0) cart = cart.filter(item => item.key !== key);

  render();
  if(document.getElementById("cartOverlay").classList.contains("open")) renderCart();
}

function cartItems(){
  return cart.map(line => {
    const p = getProduct(line.productId);
    if(!p) return null;
    const adicionais = precoDosAdicionais(line.selecoes);
    return {
      ...line,
      p,
      q:line.quantity,
      unitPrice:Number(p.preco) + adicionais,
      adicionais
    };
  }).filter(Boolean);
}

function total(){
  return cartItems().reduce((sum, item) => sum + item.unitPrice * item.q, 0);
}

function itemCount(){
  return cartItems().reduce((sum, item) => sum + item.q, 0);
}

/* A promoção continua contando somente itens da categoria Cookies. */
function cookieCount(){
  return cartItems().reduce((sum, item) =>
    sum + ((item.p.categoria || "cookies") === "cookies" ? item.q : 0), 0);
}

function deliveryFee(){
  if(mode !== "Entrega") return 0;
  if(schoolDelivery) return 0;
  if(PROMOCAO_ENTREGA && PROMOCAO_ENTREGA.ativa && cookieCount() >= PROMOCAO_ENTREGA.minimoCookies) return 0;
  return 4;
}

function grandTotal(){
  return total() + deliveryFee();
}

function setPayment(p){
  payment = p;
  const ids = {
    "Pix":"pixBtn",
    "Cartão de crédito":"creditBtn",
    "Cartão de débito":"debitBtn",
    "Dinheiro":"cashBtn"
  };
  Object.values(ids).forEach(id => document.getElementById(id).classList.remove("active"));
  document.getElementById(ids[p]).classList.add("active");
  document.getElementById("changeField").style.display = p === "Dinheiro" ? "block" : "none";
  if(p !== "Dinheiro") document.getElementById("changeFor").value = "";
}

function updateCheckoutTotals(){
  const fee = deliveryFee();
  const grand = grandTotal();
  document.getElementById("sheetTotal").textContent = money(grand);

  const notice = document.getElementById("freeDeliveryNotice");
  if(notice){
    const promoGratis = PROMOCAO_ENTREGA && PROMOCAO_ENTREGA.ativa && cookieCount() >= PROMOCAO_ENTREGA.minimoCookies;
    notice.style.display = mode === "Entrega" && promoGratis ? "block" : "none";
    if(promoGratis){
      notice.textContent = `Pedidos com ${PROMOCAO_ENTREGA.minimoCookies} ou mais cookies em um raio de ${String(PROMOCAO_ENTREGA.raioKm).replace(".",",")} km tem ENTREGA GRATUITA`;
    }
  }

  const breakdown = document.getElementById("checkoutBreakdown");
  if(breakdown){
    breakdown.innerHTML =
      '<div>Produtos <span style="float:right">'+money(total())+'</span></div>' +
      '<div>Entrega <span style="float:right">'+(schoolDelivery ? 'GRÁTIS (ESCOLA)' : (fee === 0 ? 'GRÁTIS' : money(fee)))+'</span></div>' +
      '<strong style="display:block;margin-top:7px">Total <span style="float:right">'+money(grand)+'</span></strong>';
  }
}

function updateCart(){
  document.getElementById("cartCount").textContent = itemCount();
  document.getElementById("cartTotal").textContent = money(total()) + " ›";
}

function openCart(){
  renderCart();
  document.getElementById("cartOverlay").classList.add("open");
}

function renderCart(){
  const box = document.getElementById("cartLines");
  const items = cartItems();

  if(!items.length){
    box.innerHTML = '<div class="empty">Seu pedido está vazio.<br>Escolha seus produtos primeiro.</div>';
  } else {
    box.innerHTML = items.map(item => {
      const detalhes = item.selecoes.length
        ? `<div class="cart-options">${item.selecoes.map(op => `<div>${esc(op.grupoNome)}: ${esc(op.nome)}${Number(op.preco) !== 0 ? ` (${Number(op.preco) > 0 ? "+ " : "− "}${money(Math.abs(Number(op.preco)))})` : ""}</div>`).join("")}</div>`
        : "";
      return `
        <div class="lineitem">
          <div class="grow">
            <b>${esc(item.p.nome)}</b>
            <div class="desc">${item.q} unidade${item.q > 1 ? "s" : ""} × ${money(item.unitPrice)}</div>
            ${detalhes}
          </div>
          <span class="qty">
            <button type="button" aria-label="Remover uma unidade" onclick="alterarLinha('${esc(item.key)}',-1)">−</button>
            <b>${item.q}</b>
            <button type="button" aria-label="Adicionar uma unidade" onclick="alterarLinha('${esc(item.key)}',1)">+</button>
          </span>
        </div>
      `;
    }).join("");
  }

  updateCheckoutTotals();
}

function setMode(m){
  mode = m;

  document.getElementById("deliveryBtn").classList.toggle("active",m === "Entrega");
  document.getElementById("pickupBtn").classList.toggle("active",m === "Retirada");
  document.getElementById("deliveryFields").style.display = m === "Entrega" ? "block" : "none";
  document.getElementById("schoolField").style.display = m === "Entrega" ? "block" : "none";

  if(m !== "Entrega") setSchool(false);
  updateCheckoutTotals();
}

function sendWhatsApp(){
  if(!cartItems().length){
    alert("Adicione pelo menos um produto ao pedido.");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("address").value.trim();
  const complement = document.getElementById("complement").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const changeFor = document.getElementById("changeFor").value.trim();

  if(!name){
    alert("Digite seu nome.");
    return;
  }
  if(mode === "Entrega" && !address){
    alert("Digite o endereço de entrega.");
    return;
  }
  if(payment === "Dinheiro" && !changeFor){
    alert("Informe para quanto você precisa de troco.");
    return;
  }

  const fee = deliveryFee();
  const finalTotal = grandTotal();
  let msg = `*GRAN COOKIES | NOVO PEDIDO*\n\n*ITENS*\n`;

  cartItems().forEach(item => {
    msg += `${item.q}x ${item.p.nome} - ${money(item.unitPrice * item.q)}\n`;
    item.selecoes.forEach(op => {
      const valor = Number(op.preco) !== 0 ? ` (${Number(op.preco) > 0 ? "+ " : "− "}${money(Math.abs(Number(op.preco)))})` : "";
      msg += `   • ${op.grupoNome}: ${op.nome}${valor}\n`;
    });
  });

  msg += `\n*SUBTOTAL: ${money(total())}*\n`;
  if(mode === "Entrega") msg += `*ENTREGA: ${fee === 0 ? "GRÁTIS" : money(fee)}*\n`;
  msg += `*TOTAL: ${money(finalTotal)}*\n\n*RECEBIMENTO*\n${mode}\n\n*PAGAMENTO*\n${payment}\n`;

  if(payment === "Dinheiro") msg += `Troco para: ${changeFor}\n`;
  if(mode === "Entrega"){
    msg += `\n*ENDEREÇO*\n${address}\n`;
    if(complement) msg += `Complemento: ${complement}\n`;
    msg += `Entrega em escola: ${schoolDelivery ? "Sim" : "Não"}\n`;
  }

  msg += `\n*CLIENTE*\nNome: ${name}\n`;
  if(phone) msg += `WhatsApp: ${phone}\n`;
  if(notes) msg += `Observações: ${notes}\n`;
  if(mode === "Entrega" && fee === 0 && PROMOCAO_ENTREGA?.ativa && cookieCount() >= PROMOCAO_ENTREGA.minimoCookies){
    msg += `\n*Entrega gratuita: ${PROMOCAO_ENTREGA.minimoCookies} ou mais cookies, dentro de ${String(PROMOCAO_ENTREGA.raioKm).replace(".",",")} km.*\n`;
  }
  msg += `\n------------------------------\nAguardo a confirmação do pedido.\n`;

  const url = "https://wa.me/" + WHATSAPP_GRAN_COOKIES + "?text=" + encodeURIComponent(msg);
  window.location.href = url;
}

function closeModal(id){
  document.getElementById(id).classList.remove("open");
}

function backdrop(e,id){
  if(e.target.id === id) closeModal(id);
}

setMode("Entrega");
setPayment("Pix");
setSchool(false);
renderHomePromo();
render();
