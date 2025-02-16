import { numberFormatBR, limparFormatoReal } from './utils.js'

const sectionflor = document.querySelector('.flor')
const sectionProdutos = document.querySelector('.produtos')
const botaoVoltar = document.querySelector('.voltar')
const sectionDetalhesProduto = document.querySelector('.produto__detalhes')
const sectionCarrinho = document.querySelector('.carrinho')

let usuarioLogado = false

//Navegação
const ocultarElemento = (elemento) => {
    elemento.style.display = 'none'
}

const mostrarElemento = (elemento, display='block') => {
    elemento.style.display = display
}

const irParaHome = () => {
    ocultarElemento(sectionPagamento)
    ocultarElemento(sectionIdentificacao)
    ocultarElemento(sectionIdentifiquese)
    ocultarElemento(sectionCarrinho)
    ocultarElemento(botaoVoltar)
    ocultarElemento(sectionDetalhesProduto)
    mostrarElemento(sectionHero, 'flex')
    mostrarElemento(sectionProdutos, 'flex')
}

const irParaPagamento = () => {
    ocultarElemento(sectionIdentifiquese)
    if(numeroItens.innerHTML > 0) {
        ocultarElemento(sectionHero)
        ocultarElemento(sectionProdutos)
        ocultarVoltarEsecaoDetalhes()
        ocultarElemento(sectionCarrinho)
        mostrarElemento(sectionPagamento)
    }
}

const ocultarVoltarEsecaoDetalhes = () => {
    ocultarElemento(botaoVoltar)
    ocultarElemento(sectionDetalhesProduto)
}
ocultarVoltarEsecaoDetalhes()

botaoVoltar.addEventListener('click', () => {
    mostrarElemento(sectionProdutos, 'flex')
    ocultarVoltarEsecaoDetalhes()
})

const btnCarrinho = document.querySelector('.btn__carrinho .icone')
btnCarrinho.addEventListener('click', () => {
    if(numeroItens.innerHTML > 0) {
        mostrarElemento(sectionCarrinho)
        ocultarElemento(sectionHero)
        ocultarElemento(sectionProdutos)
        ocultarElemento(sectionDetalhesProduto)
        ocultarElemento(sectionIdentificacao)
        ocultarElemento(sectionPagamento)
    }
})

const btnHome = document.querySelector('.link_home')
btnHome.addEventListener('click', (event) => {
    event.preventDefault()
    irParaHome()
})

// NUMERO DE ITENS do CARRINHO
const numeroItens = document.querySelector('.numero_itens')
ocultarElemento(numeroItens)

const atualizarNumeroItens = () => {
    numeroItens.style.display = cart.length ? 'block' : 'none'
    numeroItens.innerHTML = cart.length
}

//PAGE HOME


// Ocultar o botão voltar e seção de detalhes do produto
botaoVoltar.style.display = 'none'
sectionDetalhesProduto.style.display = 'none'

const numberFormat = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})

const getProducts = async () => {
    const response =  await fetch('js/products.json')
    const data = await response.json()
    return data
}
const generateCard = async () => {
    const products = await getProducts()
    products.map(product => {
        let card = document.createElement('div')
        card.classList.add('card__produto')
        card.innerHTML = `
        <figure>
            <img src="Images/${product.image}" alt="${product.product_name}" />
        </figure>
        <div class="card__produto_detalhes">
            <H4>${product.product_name}</H4>
            <h5>${product.product_model}</h5>
        </div>
        <h6>${formatCurrency(product.price)}</h6>
        `
        const listaProdutos = document.querySelector('.lista__produtos')
        listaProdutos.appendChild(card)

        card.addEventListener('click', () => {
            sectionProdutos.style.display = 'none'
            // Mostrar o botão e a página de detalhes do produto
            botaoVoltar.style.display = 'block'
            sectionDetalhesProduto.style.display = 'grid'
        })

        botaoVoltar.addEventListener('click', () => {
            sectionProdutos.style.display = 'flex'
            botaoVoltar.style.display = 'none'
            sectionDetalhesProduto.style.display = 'none'
        })
    })
}

generateCard()