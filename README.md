# Gran Cookies

Site estático pronto para GitHub Pages. O arquivo principal de configuração é o `cardapio.js`: é nele que você altera produtos, categorias, adicionais, preços extras, estoque, WhatsApp, promoção de entrega e música.

## Arquivos principais

- `index.html`: estrutura da página.
- `style.css`: aparência e estilos.
- `script.js`: funcionamento do cardápio, personalização, carrinho e envio ao WhatsApp. Em geral, não precisa editar este arquivo.
- `cardapio.js`: **arquivo de configuração do dia a dia**.

## Categorias

No começo do `cardapio.js`, edite `CATEGORIAS`. A ordem dos objetos define a ordem em que as categorias aparecem no site.

```js
const CATEGORIAS = [
  { id: "cookies", nome: "Cookies", icone: "🍪", mostrarVazia: false },
  { id: "bebidas", nome: "Bebidas", icone: "🥤", mostrarVazia: true }
];
```

Cada produto deve ter `categoria` igual ao `id` de uma das categorias. Para criar outra categoria, adicione-a nessa lista e depois use o mesmo id nos produtos.

## Adicionar ou editar produtos

Copie um produto dentro de `CARDAPIO` e altere os campos:

- `id`: identificador único e simples, de preferência sem espaços (ex.: `bubble-drink`).
- `categoria`: `cookies`, `bebidas` ou o id de outra categoria criada por você.
- `nome`, `descricao`, `preco`, `estoque` e `imagem`.
- `disponivel`: `true` mostra o produto; `false` deixa o produto oculto.

**Importante sobre Bebidas:** `mostrarVazia: true` mantém a categoria Bebidas visível quando ela ainda não tem produtos, mas não cadastra bebidas automaticamente. No arquivo atual, o Bubble Drink de exemplo está dentro de um comentário. Para aparecer no cardápio, copie o objeto de exemplo para dentro de `CARDAPIO`, fora do comentário, mantenha `categoria: "bebidas"`, `disponivel: true` e estoque maior que zero. Confirme também que o ID da categoria está escrito exatamente como `bebidas`.

Fotos devem ser colocadas na pasta `imagens/`. Depois informe o caminho, por exemplo `imagem: "imagens/bubble-drink.png"`. Deixe `imagem: ""` para usar o ícone provisório da categoria.

## Classes de adicionais e preços extras

Um produto pode ter quantos grupos de escolha forem necessários em `gruposAdicionais`. Exemplos: base, bolinhas, sabor, tamanho, cobertura ou acompanhamento.

Cada grupo aceita:

- `id`: identificador único do grupo.
- `titulo`: nome que aparecerá para o cliente.
- `tipo`: `"unica"` para escolher uma opção ou `"multipla"` para permitir várias.
- `obrigatorio`: `true` ou `false`.
- `minimo` e `maximo`: quantidade de opções que o cliente pode/deve escolher.
- `opcoes`: lista de opções disponíveis.
- `disponivel` no grupo (opcional): `false` oculta a classe inteira, por exemplo, todas as bolinhas.

Cada opção tem `id`, `nome` e `preco`. O preço é individual e será somado automaticamente ao preço-base do produto. Use `preco: 0.00` para algo incluído e, por exemplo, `preco: 2.50` para cobrar R$ 2,50 a mais por aquela opção. Cada opção também aceita `disponivel`: use `false` para ocultar somente aquela opção, sem afetar as outras. Quando omitido, o valor padrão é `true`.

Exemplo para desativar apenas um tipo de bolinha:

```js
{
  id: "bolinhas",
  titulo: "Escolha as bolinhas",
  tipo: "multipla",
  obrigatorio: true,
  minimo: 1,
  maximo: 2,
  opcoes: [
    { id: "blueberry", nome: "Blueberry", preco: 1.50 },
    { id: "maca-verde", nome: "Maçã verde", preco: 1.50 },
    { id: "morango", nome: "Morango", preco: 1.50, disponivel: false }
  ]
}
```

Nesse exemplo, Morango não aparece para o cliente. Blueberry e Maçã verde continuam disponíveis normalmente. A validação de quantidade considera somente as opções ativas.

Exemplo simplificado:

```js
{
  id: "bubble-drink",
  categoria: "bebidas",
  nome: "Bubble Drink",
  imagem: "",
  descricao: "Monte sua bebida.",
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
        { id: "cha", nome: "Chá", preco: 0.00 },
        { id: "refrigerante", nome: "Refrigerante", preco: 2.00 }
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
        { id: "blueberry", nome: "Blueberry", preco: 1.50 },
        { id: "maca-verde", nome: "Maçã verde", preco: 1.50 }
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
        { id: "morango", nome: "Morango", preco: 0.00 },
        { id: "manga", nome: "Manga", preco: 2.00 }
      ]
    }
  ]
}
```

O `cardapio.js` já contém um modelo maior de Bubble Drink comentado, pronto para copiar. Os nomes e valores daquele modelo são apenas exemplos: ajuste para os seus produtos reais antes de colocar `disponivel: true`.

Quando um produto tem grupos de adicionais, o cliente verá o botão **PERSONALIZAR**. A tela de escolhas valida os mínimos e máximos, calcula o preço da unidade e registra a combinação no carrinho. Combinações diferentes do mesmo produto aparecem como linhas separadas no pedido e também são detalhadas na mensagem do WhatsApp.

## Música de fundo sem botão

Não existe mais player visível. O áudio é controlado por `CONFIGURACAO_MUSICA`, no `cardapio.js`:

```js
const CONFIGURACAO_MUSICA = {
  arquivo: "audio/minha-musica.mp3",
  volumeInicial: 0.28,
  repetir: true,
  tentarAutoplay: true,
  iniciarAposInteracao: true
};
```

Coloque o arquivo de música na pasta `audio/` e ajuste o caminho. `volumeInicial` vai de `0` a `1`. Alguns navegadores bloqueiam áudio automático com som; quando isso acontecer, o site tenta iniciar a música no primeiro toque/clique do visitante, sem exibir controles.

## WhatsApp e entrega

No final do `cardapio.js`:

- `WHATSAPP_GRAN_COOKIES`: número que recebe os pedidos, com código do país e DDD.
- `PROMOCAO_ENTREGA.ativa`: liga/desliga a promoção.
- `minimoCookies`: quantidade mínima de cookies para a entrega grátis.
- `raioKm`: raio anunciado na promoção.

A promoção considera somente os produtos da categoria com id `cookies`, não bebidas ou outras categorias. A taxa padrão de entrega continua em R$ 4,00 e pode ser alterada no `script.js` na função `deliveryFee()`.

## Publicar no GitHub Pages

1. Envie os arquivos e as pastas para a raiz do repositório.
2. Abra **Settings → Pages**.
3. Selecione **Deploy from a branch**, a branch `main` e a pasta `/ (root)`.
4. Salve.
