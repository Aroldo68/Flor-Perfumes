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
    if(numeroItens.innerHTML > 0) {
        mostrarElemento(sectionCarrinho)
        ocultarElemento(sectionfaixa)
        ocultarElemento(sectionProdutos)
        ocultarElemento(sectionDetalhesProduto)
        ocultarElemento(sectionIdentificacao)
        ocultarElemento(sectionPagamento)  
    }
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

//Validações
const formularioIdentificacao = document.querySelector('.form_identificacao')
const todosCamposObrigatorios = formularioIdentificacao.querySelectorAll('[required]')
const todosCampos = formularioIdentificacao.querySelectorAll('input')

const pegarDados = () => {
    const dados = {}
    todosCampos.forEach( campo => {
        dados[campo.id] = campo.value.trim()
    })
    return dados
}

const validacaoDoFormulario = () => {
    let formularioValido = true
    todosCamposObrigatorios.forEach( campoObrigatorio => {
        const isEmpty = campoObrigatorio.value.trim() === ''
        const isNotChecked = campoObrigatorio.type === 'checkbox' && !campoObrigatorio.checked
        if(isEmpty) {
            campoObrigatorio.classList.add('campo-invalido')
            campoObrigatorio.nextElementSibling.textContent = `${campoObrigatorio.id} obrigatorio`
            formularioValido = false
        } else {
            campoObrigatorio.classList.add('campo-valido')
            campoObrigatorio.classList.remove('campo-invalido')
            campoObrigatorio.nextElementSibling.textContent = ''
        }
        if(isNotChecked) {
            campoObrigatorio.parentElement.classList.add('erro')
            formularioValido = false
        } else {
            campoObrigatorio.parentElement.classList.remove('erro')
        }
    })
    return formularioValido
}

const btnFinalizarCadastro = document.querySelector('.btn_finalizar_cadastro')
btnFinalizarCadastro.addEventListener('click', (event) => {
    event.preventDefault()
    validacaoDoFormulario()
    if(validacaoDoFormulario()) {
        localStorage.setItem('dados', JSON.stringify(pegarDados()))
        formularioIdentificacao.reset()
        ocultarElemento(sectionIdentificacao)
        mostrarElemento(sectionPagamento)
    }
})

// Validação onBlur
todosCamposObrigatorios.forEach( campo => {
    const emailRegex = /\S+@\S+\.\S+/
    campo.addEventListener('blur', (e) => {
        if(campo.value !== "" && e.target.type !== "email") {
            campo.classList.add('campo-valido')
            campo.classList.remove('campo-invalido')
            campo.nextElementSibling.textContent = ''
        } else {
            campo.classList.add('campo-invalido')
            campo.classList.remove('campo-valido')
            campo.nextElementSibling.textContent = `${campo.id} é obrigatório`
        }
        if(emailRegex.test(e.target.value)) {
            campo.classList.add('campo-valido')
            campo.classList.remove('campo-invalido')
            campo.nextElementSibling.textContent = ''
        }
        if(e.target.type === "checkbox" && !e.target.checked) {
            campo.parentElement.classList.add('erro')
        } else {
            campo.parentElement.classList.remove('erro')
        }
    })
})

const btnFinalizarCompra = document.querySelector('.btn_finalizar_compra')
btnFinalizarCompra.addEventListener('click', () => {
    ocultarElemento(sectionPagamento)
    mostrarElemento(sectionfaixa, 'flex')
    mostrarElemento(sectionProdutos, 'flex')

})

// Completar os dados após vreificar o CEP
const buscarCEP = async (cep) => {
    const url = `https://viacep.com.br/ws/${cep}/json`
    const response = await fetch(url)
    const data = await response.json()
    return data
}

document.querySelector('#cep1').addEventListener('blur', async (e) => {
    const cep = e.target.value
    if (!cep) {
        limparCampos()
        return
    }
    const resposta = await buscarCEP(cep)
    if (resposta.erro) {
        limparCampos()
        return
    }
    preencherCampos(resposta)
    document.querySelector('#numero').focus()
})
  
const limparCampos = () => {
    document.querySelector('#endereco').value = ''
    document.querySelector('#bairro').value = ''
    document.querySelector('#cidade').value = ''
    document.querySelector('#estado').value = ''
}
  
const preencherCampos = (resposta) => {
    document.querySelector('#endereco').value = resposta.logradouro
    document.querySelector('#bairro').value = resposta.bairro
    document.querySelector('#cidade').value = resposta.localidade
    document.querySelector('#estado').value = resposta.uf
}

// Criação da janela de login
const btnOpenLogin = document.querySelector('#btn_open_login')
const modalLogin = document.querySelector('.modal_login')
const overlayLogin = document.querySelector('.modal_overlay')
const btnCloseLogin = document.querySelector('.btn_close_login')

btnOpenLogin.addEventListener('click', () => {
    mostrarModal()
})

document.addEventListener('click', (event) => {
    if(event.target === overlayLogin || event.target === btnCloseLogin) {
        fecharModal()
    }
} )

const mostrarModal = () => {
    modalLogin.classList.add('show')
    overlayLogin.classList.add('show')
}

const fecharModal = () => {
    modalLogin.classList.remove('show')
    overlayLogin.classList.remove('show')
}

// Controle de login
const nomeUsuario = document.querySelector('#nome_usuario')
const btnLogout = document.querySelector('#btn_logout')
const formularioLogar = document.querySelector('.form_logar')
const emailLogin = document.querySelector('#email_login')
const senhaLogin = document.querySelector('#senha_login')

ocultarElemento(btnLogout) // esconder o botao Sair

formularioLogar.addEventListener('submit', (e) => {
    e.preventDefault()
    // pegar dados e validar para autorizar entrada
    console.log(emailLogin.value, senhaLogin.value)
    nomeUsuario.innerHTML = emailLogin.value
    mostrarElemento(btnLogout)
    formularioLogar.reset()
    fecharModal()
})

const logout = () => {
    ocultarElemento(btnLogout)
    nomeUsuario.innerHTML = ''
}

btnLogout.addEventListener('click', logout)

//Cadastrar Usuario
const modalCadastrarUsuario = document.querySelector('.modal_cadastrar_usuario')
const overlayCadastrarUsuario = document.querySelector('.modal_overlay_cadastrar')
const btnCloseCadastrar = document.querySelector('.btn_close_cadastrar')
const linkCadastrar = document.querySelector('.link_cadastrar')

linkCadastrar.addEventListener('click', (e) => {
    e.preventDefault()
    fecharModal()
    modalCadastrarUsuario.classList.add('show')
    overlayCadastrarUsuario.classList.add('show')
})

btnCloseCadastrar.addEventListener('click', () => {
    modalCadastrarUsuario.classList.remove('show')
    overlayCadastrarUsuario.classList.remove('show')
})

const formularioCadastrarUsuario = document.querySelector('.form_cadastrar_usuario')
const formAviso = document.querySelector('.form_aviso')

formularioCadastrarUsuario.addEventListener('submit', (e) => {
    e.preventDefault()
    // pegar dados, validar e autenticar
    const email = document.querySelector('#email_usuario').value
    const senha = document.querySelector('#senha_usuario').value
    const confirmaSenha = document.querySelector('#confirma_senha_usuario').value

    // validação
    const mensagemSenhaInvalida = senha.length < 5 ? 'Digite uma senha com no mínimo 5 caracteres' : 'Senha e confirmação SÃO DIFERENTES'
    if(senha.length < 5 || senha !== confirmaSenha) {
        formAviso.innerHTML = mensagemSenhaInvalida
        return
    }

    // armazenar e autenticar - login
    formularioCadastrarUsuario.reset()
    formAviso.innerHTML = ''
    modalCadastrarUsuario.classList.remove('show')
    overlayCadastrarUsuario.classList.remove('show')

    const usuario = {
        email,
        senha
    }
    console.log(usuario)
    nomeUsuario.innerHTML = usuario.email
    mostrarElemento(btnLogout)
})