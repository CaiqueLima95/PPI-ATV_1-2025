import express from 'express';
const app = express();
const porta = 3000;


app.get('/', (req, res) => {
    const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

    // Verificações de dados
    const idadeNum = parseInt(idade);
    const salario = parseFloat(salario_base);
    const ano = parseInt(anoContratacao);
    const mat = parseInt(matricula);

    if (
        isNaN(idadeNum) || idadeNum <= 16 ||
        isNaN(salario) || salario <= 0 ||
        isNaN(ano) || ano <= 1960 ||
        isNaN(mat) || mat <= 0 ||
        (sexo !== 'M' && sexo !== 'F')
    ) {
        return res.send('<h2>Dados inválidos. Verifique se preencheu tudo corretamente.</h2>');
    }

    // Calcula tempo de empresa
    const tempoEmpresa = new Date().getFullYear() - ano;
    const maisDe10Anos = tempoEmpresa > 10;

    // Regras da tabela
    let reajuste = 0, desconto = 0, acrescimo = 0;

    if (idadeNum >= 18 && idadeNum <= 39) {
        if (sexo === 'M') 
            { reajuste = 0.10; desconto = 10.00; acrescimo = 17.00; }
        else 
            { reajuste = 0.08; desconto = 11.00; acrescimo = 16.00; }
    } 
    else if (idadeNum >= 40 && idadeNum <= 69) {
        if (sexo === 'M') 
            { reajuste = 0.08; desconto = 5.00; acrescimo = 15.00; }
        else 
            { reajuste = 0.10; desconto = 7.00; acrescimo = 14.00; }
    } 
    else if (idadeNum >= 70 && idadeNum <= 99) {
        if (sexo === 'M') 
            { reajuste = 0.15; desconto = 15.00; acrescimo = 13.00; }
        else 
            { reajuste = 0.17; desconto = 17.00; acrescimo = 12.00; }
    }

    // Cálculo do salário reajustado
    let novoSalario = salario + (salario * reajuste);
    //novoSalario += maisDe10Anos ? acrescimo : -desconto;
    if (maisDe10Anos) {
        novoSalario += acrescimo;
    } else {
        novoSalario -= desconto;
    }
    
    res.send(`
        <h1>Resultado do Cálculo</h1>
        <p><strong>Matrícula:</strong> ${mat}</p>
        <p><strong>Idade:</strong> ${idadeNum}</p>
        <p><strong>Sexo:</strong> ${sexo}</p>
        <p><strong>Salário Base:</strong> R$ ${salario.toFixed(2)}</p>
        <p><strong>Ano de Contratação:</strong> ${ano}</p>
        <p><strong>Tempo de Empresa:</strong> ${tempoEmpresa} anos</p>
        <h2 style="color:green;"><strong>Novo Salário:</strong> R$ ${novoSalario.toFixed(2)}</h2>
    `);
});


app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});



