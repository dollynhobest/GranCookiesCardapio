/* ==========================================================
   GRAN COOKIES - CONFIGURAÇÃO DO CARDÁPIO

   É AQUI que você vai mexer todos os dias.

   Para adicionar um sabor, copie um bloco e altere os dados.

   disponivel: true  = aparece no cardápio
   disponivel: false = fica oculto

   estoque: quantidade disponível.
   Se colocar 0, aparece como ESGOTADO.

   preço deve ser escrito como número:
   12.50 = R$ 12,50
   ========================================================== */

/* Cardápio e WhatsApp ficam em cardapio.js */



/* ==========================================================
   FUNCIONAMENTO DO SITE
   ========================================================== */

let cart = {};
let mode = "Entrega";
let payment = "Pix";
let schoolDelivery = false;

function money(v){
  return v.toLocaleString("pt-BR",{
    style:"currency",
    currency:"BRL"
  });
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

function render(){
  const box = document.getElementById("products");
  box.innerHTML = "";

  const av = availableProducts();
  document.getElementById("countLabel").textContent =
    av.length + (av.length === 1 ? " sabor" : " sabores");

  if(!av.length){
    box.innerHTML =
      '<div class="empty">Hoje estamos sem sabores disponíveis.</div>';
    updateCart();
    return;
  }

  av.forEach(p => {
    const q = cart[p.id] || 0;
    const sold = p.estoque <= 0;

    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <div class="card-top">
        <div class="info">
          <h3>${esc(p.nome)}</h3>
          <div class="desc">${esc(p.descricao)}</div>
          <div class="price">${money(p.preco)}</div>
        </div>
      </div>

      <div class="row">
        <span></span>
        ${
          sold
          ? '<span class="badge sold">ESGOTADO</span>'
          : `
            <span class="qty">
              <button onclick="change('${p.id}',-1)">−</button>
              <b>${q}</b>
              <button onclick="change('${p.id}',1)">+</button>
            </span>
          `
        }
      </div>
    `;

    box.appendChild(el);
  });

  updateCart();
  updateCheckoutTotals();
}

function esc(s){
  return String(s || "").replace(/[&<>"']/g,m=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[m]));
}

function change(id,d){
  const p = getProduct(id);
  if(!p) return;

  const current = cart[id] || 0;
  const next = Math.max(0, Math.min(p.estoque, current + d));

  if(next === 0) delete cart[id];
  else cart[id] = next;

  render();
}

function cartItems(){
  return Object.entries(cart)
    .map(([id,q]) => ({p:getProduct(id),q}))
    .filter(x => x.p);
}

function total(){
  return cartItems().reduce(
    (sum,x) => sum + x.p.preco * x.q,
    0
  );
}

function cookieCount(){
  return Object.values(cart).reduce((a,b)=>a+b,0);
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
      '<div>Cookies <span style="float:right">'+money(total())+'</span></div>' +
      '<div>Entrega <span style="float:right">'+(schoolDelivery ? 'GRÁTIS (ESCOLA)' : (fee === 0 ? 'GRÁTIS' : money(fee)))+'</span></div>' +
      '<strong style="display:block;margin-top:7px">Total <span style="float:right">'+money(grand)+'</span></strong>';
  }
}

function updateCart(){
  const count = Object.values(cart)
    .reduce((a,b)=>a+b,0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent =
    money(total()) + " ›";
}

function openCart(){
  renderCart();
  document.getElementById("cartOverlay").classList.add("open");
}

function renderCart(){
  const box = document.getElementById("cartLines");
  const items = cartItems();

  if(!items.length){
    box.innerHTML =
      '<div class="empty">Seu pedido está vazio.<br>Escolha seus cookies primeiro.</div>';
  } else {
    box.innerHTML = items.map(x => `
      <div class="lineitem">
        <div class="grow">
          <b>${esc(x.p.nome)}</b>
          <div class="desc">
            ${x.q} unidade${x.q > 1 ? "s" : ""} × ${money(x.p.preco)}
          </div>
        </div>

        <span class="qty">
          <button onclick="change('${x.p.id}',-1);renderCart()">−</button>
          <b>${x.q}</b>
          <button onclick="change('${x.p.id}',1);renderCart()">+</button>
        </span>
      </div>
    `).join("");
  }

  updateCheckoutTotals();
}

function setMode(m){
  mode = m;

  document.getElementById("deliveryBtn")
    .classList.toggle("active",m === "Entrega");

  document.getElementById("pickupBtn")
    .classList.toggle("active",m === "Retirada");

  document.getElementById("deliveryFields").style.display =
    m === "Entrega" ? "block" : "none";
  document.getElementById("schoolField").style.display =
    m === "Entrega" ? "block" : "none";

  if(m !== "Entrega") setSchool(false);
  updateCheckoutTotals();
}

function sendWhatsApp(){
  if(!cartItems().length){
    alert("Adicione pelo menos um cookie ao pedido.");
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

  let msg =
`*GRAN COOKIES | NOVO PEDIDO*

*ITENS*
`;

  cartItems().forEach(x => {
    msg += `${x.q}x ${x.p.nome} - ${money(x.p.preco * x.q)}\n`;
  });

  msg += `\n*SUBTOTAL: ${money(total())}*\n`;

  if(mode === "Entrega"){
    msg += `*ENTREGA: ${fee === 0 ? "GRÁTIS" : money(fee)}*\n`;
  }

  msg += `*TOTAL: ${money(finalTotal)}*

*RECEBIMENTO*
${mode}

*PAGAMENTO*
${payment}
`;

  if(payment === "Dinheiro"){
    msg += `Troco para: ${changeFor}\n`;
  }

  if(mode === "Entrega"){
    msg += `
*ENDEREÇO*
${address}
`;
    if(complement) msg += `Complemento: ${complement}\n`;
    msg += `Entrega em escola: ${schoolDelivery ? "Sim" : "Não"}\n`;
  }

  msg += `
*CLIENTE*
Nome: ${name}
`;

  if(phone) msg += `WhatsApp: ${phone}\n`;
  if(notes) msg += `Observações: ${notes}\n`;

  if(mode === "Entrega" && fee === 0){
    msg += `\n*Entrega gratuita: 3 ou mais cookies, dentro de 1,5 km.*\n`;
  }

  msg += `
------------------------------
Aguardo a confirmação do pedido.
`;

  const url = "https://wa.me/" + WHATSAPP_GRAN_COOKIES + "?text=" + encodeURIComponent(msg);
  window.location.href = url;
}

function closeModal(id){
  document.getElementById(id).classList.remove("open");
}

function backdrop(e,id){
  if(e.target.id === id){
    closeModal(id);
  }
}

setMode("Entrega");
setPayment("Pix");
setSchool(false);
renderHomePromo();
render();
