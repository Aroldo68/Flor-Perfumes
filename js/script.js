const botaoVoltar = document.querySelector('.voltar')
const sectionDetalhesProduto = document.querySelector('.produto__detalhes')
const sectionProdutos = document.querySelector('.produtos')
// Ocultar o botao detalhes e a seção de detalhes do produtos
botaoVoltar.style.display = 'none'
sectionDetalhesProduto.style.display = 'none'   

const formatCurrency = (number) => {
    return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })

}

const getProducts = async () => {
    const response = await fetch('js/products.json')
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
                <img src="images/${product.image}" alt="${product.product_name}" />
            </figure>
            <div class="card__produto_detalhes">
                <h4>${product.product_name}</h4>
                <h5>${product.product_model}</h5>
            </div>
            <h6>${formatCurrency(product.price)}</h6>
        `
        const listaProdutos = document.querySelector('.lista__produtos')
        listaProdutos.appendChild(card)

        card.addEventListener('click', () => {
            sectionProdutos.style.display = 'none'
            // Mostrar o botão e a area de detalhes do produto
            botaoVoltar.style.display = 'block'
            sectionDetalhesProduto.style.display = 'grid'
        })
    })
}

generateCard()

botaoVoltar.addEventListener('click', () => {
        sectionProdutos.style.display = 'flex'
        botaoVoltar.style.display = 'none'
        sectionDetalhesProduto.style.display = 'none'
})