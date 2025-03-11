// Formatar numeros para formato monetario brasileiro e exibir o simbolo R$
export const numberFormat = new Intl.NumberFormat('pt-BR', { 
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}) 

//const limparFormatoReal = (valor) => {

//}