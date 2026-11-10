/*
==========================================================
🍪 GRAN COOKIES - CARDÁPIO

ALTERE O CARDÁPIO, AS CATEGORIAS E A MÚSICA AQUI.

- disponivel: true = aparece / false = oculto
- estoque: quantidade disponível; 0 = ESGOTADO
- preco: use ponto nos centavos (14.90 = R$ 14,90)
- categoria: id de uma categoria definida em CATEGORIAS (cookies, bebidas etc.)
- gruposAdicionais: opções como base, bolinhas e sabor; cada opção pode ter preço extra
- disponivel: também pode ser usado em um grupo ou opção de adicional. false oculta só aquele item
- imagem: caminho da foto; deixe "" para usar o ícone provisório

Para adicionar uma foto: envie o arquivo à pasta imagens/ e informe o caminho no campo imagem do sabor correspondente.
==========================================================
*/

// ==========================================================
// CATEGORIAS
// A ordem aqui é a ordem em que aparecem no site.
// Use o mesmo id no campo "categoria" de cada produto.
// mostrarVazia: true mantém a categoria visível mesmo sem produtos ativos.
// Isso mostra a categoria vazia, mas NÃO cria produtos nela.
// ==========================================================
const CATEGORIAS = [
  { id: "cookies", nome: "Cookies", icone: "🍪", mostrarVazia: false },
  { id: "bebidas", nome: "Bebidas", icone: "🥤", mostrarVazia: true }
];

// ==========================================================
// MÚSICA DE FUNDO (SEM PLAYER NA TELA)
// Coloque o áudio na pasta audio/ e altere o caminho abaixo.
// volumeInicial: de 0 a 1. O navegador pode exigir um primeiro toque
// para liberar o áudio; nesse caso o site inicia a música nesse toque.
// ==========================================================
const CONFIGURACAO_MUSICA = {
  arquivo: "audio/minha-musica.mp3",
  volumeInicial: 0.28,
  repetir: true,
  tentarAutoplay: true,
  iniciarAposInteracao: true
};

const CARDAPIO = [
   {
    id: "ferrero-rocher",
    nome: "Ferrero Rocher",
    imagem: "imagens/ferrero.png",
    descricao: "Massa especial Black com bastante chocolate ao leite, recheado com creme de avelã e avelãs tostadas laminadas, finalizado com um Ferrero Rocher no topo (aprox. 90g Massa e 30g Creme de Avelã)",
    preco: 19.50,
    estoque: 09,
    disponivel: true
  },

    {
    id: "halloween",
    nome: "Halloween (Especial)",
    imagem: "",
    descricao: "Massa de coloração Violeta com gotas de chocolate ao leite nobre, recheada com uma ganache de chocolate branco e um pouquinho de doce de abóbora. (",
    preco: 13.50,
    estoque: 09,
    disponivel: true
  },
  
  {
    id: "kinder-bueno",
    categoria: "cookies",
    nome: "Kinder Bueno",
    imagem: "imagens/kinder-bueno.png",
    descricao: "Massa especial com chocolate branco e ao leite, recheado com creme de avelã branco artesanal e finalizada com pedaço de Kinder Bueno (aprox. 100g Massa e 30g Creme de Avelã)",
    preco: 18.50,
    estoque: 01,
    disponivel: true
  },

  {
    id: "grantella",
    categoria: "cookies",
    nome: "Grantella",
    imagem: "imagens/Grantella.png",
    descricao: "Massa aerada com chocolate ao leite e muita Nutella (Aprox. 30g Nutella, 90g Massa).",
    preco: 15.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "red-velvet",
    categoria: "cookies",
    nome: "Red Velvet",
    imagem: "imagens/RedVelt.png",
    descricao: "Massa fofinha com chocolate branco recheada com geleia de morango e brigadeiro de cream cheese (aprox. 105g.",
    preco: 13.50,
    estoque: 06,
    disponivel: false
  },
  
  {
    id: "kitkat",
    categoria: "cookies",
    nome: "KitKat",
    imagem: "imagens/KitKat.png",
    descricao: "Massa com chocolate blend Nestlé, recheado com muita pasta de KitKat e finalizada com um pedaço de KitKat (aprox. 130g, 90g de massa, 30g de Pasta Profissional, 10g de pedaços de KitKat)",
    preco: 15.50,
    estoque: 09,
    disponivel: true
  },

  {
    id: "prestigio",
    categoria: "cookies",
    nome: "Prestígio",
    imagem: "",
    descricao: "Massa especial com chocolate em pó e cacau black, com chocolates blend e branco Nestlé, recheado com uma ganache artesanal de coco (aprox. 110g, 90g de massa especial e 20g de ganache)",
    preco: 14.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "smores",
    categoria: "cookies",
    nome: "S'mores",
    imagem: "",
    descricao: "Massa amanteigada com chocolate ao leite, biscoito amanteigado e marshmallow artesanal (aprox. 120g)",
    preco: 14.50,
    estoque: 04,
    disponivel: false
  },

  {
    id: "alpino-black",
    categoria: "cookies",
    nome: "Alpino Black",
    imagem: "imagens/AlpinoBlack.png",
    descricao: "Massa especial de chocolate em pó e cacau black com pedaços de chocolate Alpino, recheada com Blend de chocolates nobre branco e ao leite (aprox. 120g, 90g de massa, 30g de chocolates branco e ao leite)",
    preco: 15.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "pacoca-com-nutella",
    categoria: "cookies",
    nome: "Paçoca com Nutella",
    imagem: "",
    descricao: "Massa com chocolate ao leite e recheio de paçoca com nutella (aprox. 120g, 90g de massa, 30g de paçoca com nutella)",
    preco: 15.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "cappuccino",
    categoria: "cookies",
    nome: "Cappuccino",
    imagem: "imagens/Cappuccino.png",
    descricao: "Massa especial amanteigada com café Nestle Gold N°6 e chocolates meio amargo, ao leite e branco  (aprox. 120g)",
    preco: 14.50,
    estoque: 04,
    disponivel: false
  },

  {
    id: "churros",
    categoria: "cookies",
    nome: "Churros",
    imagem: "",
    descricao: "Massa especial com chocolate branco e canela, recheada com doce de leite (aprox. 20g de doce de leite, 90g massa)",
    preco: 13.50,
    estoque: 01,
    disponivel: false
  },

  {
    id: "pistache",
    categoria: "cookies",
    nome: "Pistache",
    imagem: "",
    descricao: "Massa com chocolate branco e grãos de pistache, recheada com ganache artesanal de pistache (aprox. 20g de ganache, 90g de massa)",
    preco: 17.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "maracuja",
    categoria: "cookies",
    nome: "Maracujá",
    imagem: "",
    descricao: "Massa com chocolate branco e geleia de maracujá, recheado com mais geleia e brigadeiro de maracujá (aprox. 120g)",
    preco: 13.50,
    estoque: 09,
    disponivel: false
  },
 
  {
    id: "granfetti",
    categoria: "cookies",
    nome: "Granfetti",
    imagem: "",
    descricao: "Massa aerada com muito chocolate ao leite e granulados coloridos (aprox. 120g)",
    preco: 10.50,
    estoque: 09,
    disponivel: false
  },

  {
    id: "granmaltine",
    categoria: "cookies",
    nome: "Granmaltine",
    imagem: "imagens/Granmaltine.png",
    descricao: "Massa aerada com chocolate ao leite e muito Ovomaltine Cremoso (Aprox. 30g Ovomaltine Cremoso, 90g Massa)",
    preco: 15.50,
    estoque: 01,
    disponivel: true
  },
    
  {
    id: "ninho-com-nutella",
    categoria: "cookies",
    nome: "Ninho com Nutella",
    imagem: "",
    descricao: "Massa com chocolate branco e chocolate ao leite, recheada com brigadeiro artesanal de Ninho e Nutella, decorado com coberturas de chocolate branco e blend (aprox. 15g de Brigadeiro de Ninho e 15g de Nutella, 90g de Massa; Decoração com aprox. 15g de Coberturas)",
    preco: 16.50,
    estoque: 09,
    disponivel: false
  },
    
  {
    id: "chocochip-milka",
    categoria: "cookies",
    nome: "Chocochip Milka",
    imagem: "",
    descricao: "Massa amanteigada com muito chocolate Milka ao leite (aprox. 45g chocolate Milka ao leite, 65g massa amanteigada)",
    preco: 20.50,
    estoque: 09,
    disponivel: false
  },
    
  {
    id: "oreo",
    categoria: "cookies",
    nome: "Oreo",
    imagem: "",
    descricao: "Massa com chocolate nobre ao leite e pedaços de bolacha Oreo, recheado com uma ganache de baunilha e chocolate branco (aprox. 110g)",
    preco: 14.50,
    estoque: 09,
    disponivel: false
  },
    
  {
    id: "bacon",
    categoria: "cookies",
    nome: "Bacon",
    imagem: "",
    descricao: "Massa amanteigada com chocolates branco e ao leite e pedaços de bacon gourmet (aprox. 105g)",
    preco: 13.50,
    estoque: 09,
    disponivel: false
  },
    
  {
    id: "caramel-lotus",
    categoria: "cookies",
    nome: "Caramel Lotus",
    imagem: "",
    descricao: "Massa especial com manteiga clarificada e com chocolate branco, recheado com creme de Biscoito Lotus e ganache de caramelo e finalizado com um biscoito Lotus (Aprox. 90g de massa, 10g de creme de Biscoito Lotus, 10g de ganache de caramelo)",
    preco: 15.50,
    estoque: 03,
    disponivel: false
 },

  {
    id: "ninho",
    categoria: "cookies",
    nome: "Ninho",
    imagem: "",
    descricao: "Massa amanteigada com chocolate branco, recheado com ganache de leite Ninho (Aprox. 100g de massa, 20g de ganache de Ninho)",
    preco: 13.50,
    estoque: 08,
    disponivel: false
 },

  {
    id: "mm",
    categoria: "cookies",
    nome: "(Novo) M M's",
    imagem: "imagens/MMs.png",
    descricao: "Massa amanteigada com chocolate blend e chocolate M&M's (Aprox. 120g)",
    preco: 14.50,
    estoque: 09,
    disponivel: true
 },

 {
    id: "bubble-drink",
    categoria: "bebidas",
    nome: "Bubble Drink",
    imagem: "imagens/BubbleDrinks.png",
    descricao: "Bebida personalizada com base, bolinhas e sabor à sua escolha.",
    preco: 18.50,
    estoque: 20,
    disponivel: false,
    gruposAdicionais: [
      {
        id: "base",
        titulo: "Escolha a base",
        tipo: "unica",
        obrigatorio: true,
        minimo: 1,
        maximo: 1,
        opcoes: [
          { id: "asg", nome: "Água sem Gás", preco: 0.00, disponivel: true },
          { id: "acg", nome: "Água com Gás", preco: 0.50, disponivel: true },
          { id: "cham", nome: "Chamyto", preco: 2.50, disponivel: false },
          { id: "alc", nome: "Álcool", preco: 3.00, disponivel: false }
        ]
      },
      {
        id: "bolinhas",
        titulo: "Escolha as bolinhas",
        tipo: "unica",
        obrigatorio: true,
        minimo: 1,
        maximo: 1,
        opcoes: [
          { id: "bb", nome: "Blueberry", preco: 0.00, disponivel: true },
          { id: "mor", nome: "Morango", preco: 0.00, disponivel: false },
          { id: "mv", nome: "Maçã Verde", preco: 0.00, disponivel: false }
        ]
      },
      {
        id: "sabor",
        titulo: "Escolha o sabor",
        tipo: "unica",
        obrigatorio: true,
        minimo: 1,
        maximo: 1,
        opcoes: [
          { id: "amora", nome: "Amora", preco: 0.00, disponivel: true },
          { id: "blueberry", nome: "Blueberry", preco: 0.00, disponivel: true },
          { id: "macaverde", nome: "Maçã Verde", preco: 0.00, disponivel: true },
          { id: "maracuja", nome: "Marácuja", preco: 0.00, disponivel: true },
          { id: "melancia", nome: "Melância", preco: 0.00, disponivel: true },
          { id: "morango", nome: "Morango", preco: 0.00, disponivel: true },
          { id: "pessego", nome: "Pêssego", preco: 0.00, disponivel: true },
          { id: "pinklemonade", nome: "Pink Lemonade", preco: 0.00, disponivel: true },
          { id: "kiwi", nome: "Kiwi", preco: 0.00, disponivel: true }
        ]
      }
    ]
  },

  {
    id: "granshake",
    categoria: "bebidas",
    nome: "GranShake de Nutella",
    imagem: "",
    descricao: "Milk shake com base de baunilha e nutella, aprox. 500 ml",
    preco: 18.50,
    estoque: 09,
    disponivel: false
 },
    
  // MODELO DE BEBIDA COM ADICIONAIS (copie para dentro de CARDAPIO e retire os comentários).
  // ATENÇÃO: este modelo está comentado e NÃO aparece no site até ser copiado para fora do comentário.
  // Os preços abaixo são exemplos: substitua pelos valores reais do seu cardápio.
  // Para ocultar uma opção sem mexer nas outras, use disponivel: false somente nela.
  /*
  ,
  {
    id: "bubble-drink",
    categoria: "bebidas",
    nome: "Bubble Drink",
    imagem: "",
    descricao: "Bebida personalizada com base, bolinhas e sabor à sua escolha.",
    preco: 12.00,
    estoque: 20,
    disponivel: true,
    gruposAdicionais: [
      {
        id: "base",
        titulo: "Escolha a base",
        tipo: "unica",
        obrigatorio: true,
        minimo: 1,
        maximo: 1,
        opcoes: [
          { id: "base-1", nome: "Base 1", preco: 0.00 },
          { id: "base-2", nome: "Base 2", preco: 2.00 }
        ]
      },
      {
        id: "bolinhas",
        titulo: "Escolha as bolinhas",
        tipo: "multipla",
        obrigatorio: true,
        minimo: 1,
        maximo: 2,
        opcoes: [
          { id: "bolinha-1", nome: "Bolinhas 1", preco: 0.00 },
          { id: "bolinha-2", nome: "Bolinhas 2", preco: 1.50, disponivel: false },
          { id: "bolinha-3", nome: "Bolinhas 3", preco: 1.50 }
        ]
      },
      {
        id: "sabor",
        titulo: "Escolha o sabor",
        tipo: "unica",
        obrigatorio: true,
        minimo: 1,
        maximo: 1,
        opcoes: [
          { id: "sabor-1", nome: "Sabor 1", preco: 0.00 },
          { id: "sabor-2", nome: "Sabor 2", preco: 2.00 }
        ]
      }
    ]
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
