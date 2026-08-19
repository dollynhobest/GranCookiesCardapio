/*
==========================================================
🍪 GRAN COOKIES - CARDÁPIO

ALTERE O CARDÁPIO AQUI.

- disponivel: true = aparece / false = oculto
- estoque: quantidade disponível; 0 = ESGOTADO
- preco: use ponto nos centavos (14.90 = R$ 14,90)
==========================================================
*/

const CARDAPIO = [
  {
    id: "chocolate-chip",
    nome: "Chocolate Chip",
    descricao: "Massa de baunilha com gotas de chocolate meio amargo.",
    preco: 12.00,
    estoque: 8,
    disponivel: true
  },

  {
    id: "oreo",
    nome: "Oreo",
    descricao: "Massa de baunilha com pedaços de Oreo e chocolate branco.",
    preco: 13.00,
    estoque: 5,
    disponivel: true
  },

  {
    id: "red-velvet",
    nome: "Red Velvet",
    descricao: "Massa de red velvet com chocolate branco e recheio cremoso.",
    preco: 13.00,
    estoque: 0,
    disponivel: false
  },

  {
    id: "nutella",
    nome: "Nutella",
    descricao: "Recheio de Nutella com gotas de chocolate.",
    preco: 14.00,
    estoque: 6,
    disponivel: true
  }

  // Exemplo para adicionar outro:
  /*
  ,
  {
    id: "novo-cookie",
    nome: "Novo Cookie",
    descricao: "Descrição do novo cookie.",
    preco: 15.00,
    estoque: 10,
    disponivel: true
  }
  */
];

const WHATSAPP_GRAN_COOKIES = "5516989999559";
