import { numberFormat } from './utils.js'

const botaoVoltar = document.querySelector('.voltar')
const sectionDetalhesProduto = document.querySelector('.produto__detalhes')
const sectionProdutos = document.querySelector('.produtos')
const sectionfaixa = document.querySelector('.faixa')
const sectionCarrinho = document.querySelector('.carrinho')

// NAVEGACAO
const ocultarElemento = (elemento) => {
    elemento.style.display = 'none'
}

const mostrarElemento = (elemento, display='block') => {
    elemento.style.display = display
}

const ocultarBotaoEsecao = () => {
    botaoVoltar.style.display = 'none'
    sectionDetalhesProduto.style.display = 'none'   
}

ocultarBotaoEsecao()    

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
        resetarSelecao(radios)  
})

const preencherDadosProduto = (product) => {
    //Preencher imagens
    const images = document.querySelectorAll('.produto__detalhes_imagens figure img')
    const imagensArray = Array.from(images)
    imagensArray.map( image => {
        image.src = `./images/${product.image}`
    })

    //Preencher nome, quant. e preço
    document.querySelector('.detalhes span').innerHTML = product.id
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

// Criação pagina carrinho
const btnCarrinho = document.querySelector('.btn__carrinho .icone')
btnCarrinho.addEventListener('click', () => {
    mostrarElemento(sectionCarrinho)
    ocultarElemento(sectionfaixa)
    ocultarElemento(sectionProdutos)
    ocultarElemento(sectionDetalhesProduto)
    ocultarElemento(sectionIdentificacao)
    ocultarElemento(sectionPagamento)   
})

const btnHome = document.querySelector('.link_home')
btnHome.addEventListener('click', (event) => {
    event.preventDefault()
    ocultarElemento(sectionCarrinho)
    mostrarElemento(sectionfaixa, 'flex')
    mostrarElemento(sectionProdutos, 'flex')
    ocultarBotaoEsecao() //ajustes no site
    ocultarElemento(sectionIdentificacao)
    ocultarElemento(sectionPagamento)   
})

//Continuação da montagem da pagina carrinho
const radios = document.querySelectorAll('input[type="radio"]')
radios.forEach(radio => {
    radio.addEventListener('change', () => {
        const label = document.querySelector(`label[for="${radio.id}"]`)
        label.classList.add('selecionado')
        console.log(label)
        radios.forEach(radioAtual => {
            if (radioAtual !== radio) {
                const outroLabel = document.querySelector(`label[for="${radioAtual.id}"]`)
                outroLabel.classList.remove('selecionado')
            }
        })
    })
})

const resetarSelecao = (radios) => {
    radios.forEach(radio => {
        radios.forEach(radioAtual => {
            if (radioAtual !== radio) {
                const outroLabel = document.querySelector(`label[for="${radioAtual.id}"]`)
                outroLabel.classList.remove('selecionado')
            }
        })
    })
}

const cart = []

const btnAddCarrinho = document.querySelector('.btn__add_cart')
btnAddCarrinho.addEventListener('click', () => {
//pegar dados do produto adicionado 
    const produto = {
        id: document.querySelector('.detalhes span').innerHTML,
        nome: document.querySelector('.detalhes h4').innerHTML,
        modelo: document.querySelector('.detalhes h5').innerHTML,
        preco: document.querySelector('.detalhes h6').innerHTML,
        tamanho: document.querySelector('input[type="radio"][name="size"]:checked').value
    }
    console.log(produto)
    cart.push(produto) // Adicionar o produto ao array cart -> Carrinho
    console.log(cart)
    // Ocultar o botão voltar, faixa e a seção detalhes do produto e mostrar pagina carrinho
    ocultarBotaoEsecao()
    sectionfaixa.style.display = 'none'
    sectionCarrinho.style.display = 'block'

    atualizarCarrinho(cart)
    atualizarNumeroItens()

})

const corpoTabela = document.querySelector('.carrinho tbody')

const atualizarCarrinho = (cart) => {
    corpoTabela.innerHTML = "" //Limpar a tabela
    cart.map(produto => {
        corpoTabela.innerHTML += `
            <tr>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td class='coluna_tamanho'>${produto.tamanho}</td>
                <td class='coluna_preco'>${produto.preco}</td>
                <td class='coluna_apagar'>
                    <span class="material-symbols-outlined" data-id="${produto.id}">
                        Delete
                    </span>
                </td>
            </tr>
        `
    })

    const total = cart.reduce( (valorAcumulado, item) => {
        return valorAcumulado + parseFloat(item.preco.replace('R$&nbsp;', '').replace('.', '').replace(',', '.'))
    }, 0)
    document.querySelector('.coluna_total').innerHTML = numberFormat.format(total) // 1123.45
    spanSubTotal.innerHTML = numberFormat.format(total)
    spanTotalCompra.innerHTML = numberFormat.format(total + valorFrete - valorDesconto)

    acaoBotaoApagar()
}

const numeroItens = document.querySelector('.numero_itens')
numeroItens.style.display = 'none'  // ocultar numero itens carrinho

const atualizarNumeroItens = () => {
    (cart.length > 0) ? numeroItens.style.display = 'block' : numeroItens.style.display = 'none'
    numeroItens.innerHTML = cart.length
}   

// Botão apagar
const acaoBotaoApagar = () => {
    const botaoApagar = document.querySelectorAll('.coluna_apagar span')
    botaoApagar.forEach( botao => {
        botao.addEventListener('click', () => {
            console.log('Apagar')
            const id = botao.getAttribute('data-id')
            const posicao = cart.findIndex( item => item.id == id )
            cart.splice(posicao, 1)
            atualizarCarrinho(cart)
        })
    })
    atualizarNumeroItens()
}

// Selecionar o span do id e ocultar.
const spanId = document.querySelector('.detalhes span')
spanId.style.display = 'none'

// Detalhes da pagina de pedidos
let valorFrete = 0
let valorDesconto = 0

const spanSubTotal = document.querySelector('.sub_total')
const spanFrete = document.querySelector('.valor_frete')
const spanDesconto = document.querySelector('.valor_desconto')
const spanTotalCompra = document.querySelector('.total_compra')

spanFrete.innerHTML = numberFormat.format(valorFrete)
spanDesconto.innerHTML = numberFormat.format(valorDesconto)

// Montagem da pagina cadastro de cliente e pagamento
const sectionIdentificacao = document.querySelector('.identificacao')
const sectionPagamento = document.querySelector('.pagamento')

ocultarElemento(sectionIdentificacao)
ocultarElemento(sectionPagamento)

const btnContinuarCarrinho = document.querySelector('.btn_continuar')
btnContinuarCarrinho.addEventListener('click', () => {
    ocultarElemento(sectionCarrinho)
    mostrarElemento(sectionIdentificacao)

})

const btnFinalizarCadastro = document.querySelector('.btn_finalizar_cadastro')
btnFinalizarCadastro.addEventListener('click', (event) => {
    // ocultarElemento(sectionIdentificacao)
    // mostrarElemento(sectionPagamento)
    event.preventDefault()

    const nome = document.querySelector('#nome').value
    const email = document.querySelector('#email').value
    const telefone = document.querySelector('#tel').value
    const cep = document.querySelector('#cep1').value
    const endereco = document.querySelector('#endereco').value
    const numero = document.querySelector('#numero').value
    const bairro = document.querySelector('#bairro').value
    const complemento = document.querySelector('#complemento').value
    const cidade = document.querySelector('#cidade').value
    const estado = document.querySelector('#estado').value
    const concordo = document.querySelector('#concordo').checked

    // Validações dos dados
    const cadastro = {
        nome,
        email,
        telefone,
        cep,
        endereco,
        numero,
        bairro,
        complemento,
        cidade,
        estado,
        concordo
    }

    console.log(cadastro)

})

const btnFinalizarCompra = document.querySelector('.btn_finalizar_compra')
btnFinalizarCompra.addEventListener('click', () => {
    ocultarElemento(sectionPagamento)
    mostrarElemento(sectionfaixa, 'flex')
    mostrarElemento(sectionProdutos, 'flex')

})
