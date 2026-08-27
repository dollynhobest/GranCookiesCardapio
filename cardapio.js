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
    id: "kinder-bueno",
    nome: "Kinder Bueno",
    descricao: "Massa especial com chocolate branco e ao leite, recheado com creme de avelã branco artesanal e finalizada com pedaço de Kinder Bueno (aprox. 100g Massa e 30g Creme de Avelã)",
    preco: 18.50,
    estoque: 01,
    disponivel: false
  },

  {
    id: "grantella",
    nome: "Grantella",
    descricao: "Massa aerada com chocolate ao leite e muita Nutella (Aprox. 30g Nutella, 90g Massa).",
    preco: 15.50,
    estoque: 09,
    disponivel: true
  },

  {
    id: "red-velvet",
    nome: "Red Velvet",
    descricao: "Massa fofinha com chocolate branco recheada com geleia de morango e brigadeiro de cream cheese (aprox. 105g.",
    preco: 13.50,
    estoque: 02,
    disponivel: true
  },
  
  {
    id: "kitkat",
    nome: "KitKat",
    descricao: "Massa com chocolate blend Nestlé, recheado com muita pasta de KitKat e finalizada com um pedaço de KitKat (aprox. 130g, 90g de massa, 30g de Pasta Profissional, 10g de pedaços de KitKat)",
    preco: 15.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "prestigio",
    nome: "Prestígio",
    descricao: "Massa especial com chocolate em pó e cacau black, com chocolates blend e branco Nestlé, recheado com uma ganache artesanal de coco (aprox. 110g, 90g de massa especial e 20g de ganache)",
    preco: 14.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "smores",
    nome: "S'mores",
    descricao: "Massa amanteigada com chocolate ao leite, biscoito amanteigado e marshmallow artesanal (aprox. 120g)",
    preco: 14.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "alpino-black",
    nome: "Alpino Black",
    descricao: "Massa especial de chocolate em pó e cacau black com pedaços de chocolate Alpino, recheada com Blend de chocolates nobre branco e ao leite (aprox. 120g, 90g de massa, 30g de chocolates branco e ao leite)",
    preco: 15.50,
    estoque: 09,
    disponivel: true
  },

  {
    id: "pacoca-com-nutella",
    nome: "Paçoca com Nutella",
    descricao: "Massa com chocolate ao leite e recheio de paçoca com nutella (aprox. 120g, 90g de massa, 30g de paçoca com nutella)",
    preco: 15.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "cappuccino",
    nome: "Cappuccino",
    descricao: "Massa especial amanteigada com café Nestle Gold N°6 e chocolates meio amargo, ao leite e branco  (aprox. 120g)",
    preco: 14.50,
    estoque: 09,
    disponivel: true
  },

  {
    id: "churros",
    nome: "Churros",
    descricao: "Massa especial com chocolate branco e canela, recheada com doce de leite (aprox. 20g de doce de leite, 90g massa)",
    preco: 13.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "pistache",
    nome: "Pistache",
    descricao: "Massa com chocolate branco e grãos de pistache, recheada com ganache artesanal de pistache (aprox. 20g de ganache, 90g de massa)",
    preco: 17.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "maracuja",
    nome: "Maracujá",
    descricao: "Massa com chocolate branco e geleia de maracujá, recheado com mais geleia e brigadeiro de maracujá (aprox. 120g)",
    preco: 13.50,
    estoque: 09,
    disponivel: false
  },
 
  {
    id: "granfetti",
    nome: "Granfetti",
    descricao: "Massa aerada com muito chocolate ao leite e granulados coloridos (aprox. 120g)",
    preco: 10.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "granmaltine",
    nome: "Granmaltine",
    descricao: "Massa aerada com chocolate ao leite e muito Ovomaltine Cremoso (Aprox. 30g Ovomaltien Cremoso, 90g Massa)",
    preco: 15.50,
    estoque: 09,
    disponivel: false
  },
    
  {
    id: "ninho-com-nutella",
    nome: "Ninho com Nutella",
    descricao: "Massa com chocolate branco e chocolate ao leite, recheada com brigadeiro artesanal de Ninho e Nutella, decorado com coberturas de chocolate branco e blend (aprox. 15g de Brigadeiro de Ninho e 15g de Nutella, 90g de Massa; Decoração com aprox. 15g de Coberturas)",
    preco: 16.50,
    estoque: 09,
    disponivel: false
  },
    
  {
    id: "chocochip-milka",
    nome: "Chocochip Milka",
    descricao: "Massa amanteigada com muito chocolate Milka ao leite (aprox. 45g chocolate Milka ao leite, 65g massa amanteigada)",
    preco: 20.50,
    estoque: 09,
    disponivel: false
  },
    
  {
    id: "oreo",
    nome: "Oreo",
    descricao: "Massa com chocolate nobre ao leite e pedaços de bolacha Oreo, recheado com uma ganache de baunilha e chocolate branco (aprox. 110g)",
    preco: 14.50,
    estoque: 09,
    disponivel: true
  },
    
  {
    id: "bacon",
    nome: "Bacon",
    descricao: "Massa amanteigada com chocolates branco e ao leite e pedaços de bacon gourmet (aprox. 105g)",
    preco: 13.50,
    estoque: 09,
    disponivel: false
  },
    
  {
    id: "caramel-lotus",
    nome: "Caramel Lotus",
    descricao: "Massa especial com manteiga clarificada e com chocolate branco, recheado com creme de Biscoito Lotus e ganache de caramelo e finalizado com um biscoito Lotus (Aprox. 90g de massa, 10g de creme de Biscoito Lotus, 10g de ganache de caramelo)",
    preco: 15.50,
    estoque: 01,
    disponivel: true
 },
    
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

// ==========================================================
// 🚚 PROMOÇÃO DE ENTREGA
//
// ativa: true  = mostra a promoção e aplica a regra
//        false = desliga a promoção e também esconde o aviso
//
// A promoção vale para pedidos com o número mínimo de cookies
// dentro do raio indicado.
// ==========================================================
const PROMOCAO_ENTREGA = {
  ativa: true,
  minimoCookies: 3,
  raioKm: 1.5
};  
