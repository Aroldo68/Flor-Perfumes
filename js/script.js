const botaoVoltar = document.querySelector('.voltar')
const sectionDetalhesProduto = document.querySelector('.produto__detalhes')
const sectionProdutos = document.querySelector('.produtos')

const ocultarBotaoEsecao = () => {
    botaoVoltar.style.display = 'none'
    sectionDetalhesProduto.style.display = 'none'   
}

ocultarBotaoEsecao()    

const numberFormat = new Intl.NumberFormat('pt-BR', { 
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) 

const getProducts = async () => {
    const response = await fetch('js/products.json')
    const data = await response.json()
    return data
}

const generateCard = async () => {
    const products = await getProducts()
    products.map(product => {
        let card = document.createElement('div')
        card.id = product.id  //Identificação de cada card
        card.classList.add('card__produto')
        card.innerHTML = `
            <figure>
                <img src="images/${product.image}" alt="${product.product_name}" />
            </figure>
            <div class="card__produto_detalhes">
                <h4>${product.product_name}</h4>
                <h5>${product.product_model}</h5>
            </div>
            <h6>${numberFormat.format(product.price)}</h6>
        `
        const listaProdutos = document.querySelector('.lista__produtos')
        listaProdutos.appendChild(card)
        preencherCard(card, products)
    })
}

generateCard()

botaoVoltar.addEventListener('click', () => {
        sectionProdutos.style.display = 'flex'
        ocultarBotaoEsecao()
})

const preencherDadosProduto = (product) => {
    //Preencher imagens
    const images = document.querySelectorAll('.produto__detalhes_imagens figure img')
    const imagensArray = Array.from(images)
    imagensArray.map( image => {
        image.src = `./images/${product.image}`
    })

    //Preencher nome, quant. e preço
    document.querySelector('.detalhes h4').innerHTML = product.product_name
    document.querySelector('.detalhes h5').innerHTML = product.product_model
    document.querySelector('.detalhes h6').innerHTML = numberFormat.format(product.price)
}

const details = document.querySelector('details')

details.addEventListener('toggle', () => {
    const summary = document.querySelector('summary')
    summary.classList.toggle('icone-expandir')
    summary.classList.toggle('icone-recolher')
})

//Preencher Card
const preencherCard = (card, products) => {
    card.addEventListener('click', (e) => {
        // Ocultar e Mostrar o botão e a area de detalhes do produto
        sectionProdutos.style.display = 'none'
        botaoVoltar.style.display = 'block'
        sectionDetalhesProduto.style.display = 'grid'

        //Identificar qual o card foi clicado
        const cardClicado = e.currentTarget
        const idProduto = cardClicado.id
        const produtoClicado = products.find( product => product.id == idProduto )
        
        //Preencher os dados de detalhes do produto
        preencherDadosProduto(produtoClicado)
    })
}