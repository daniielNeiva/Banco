"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promptSync = require('prompt-sync')();
var Banco_1 = require("./Banco");
var Error_1 = require("./Error");
var b = new Banco_1.Banco();
b.carregarDeArquivo();
var opcao = '';
do {
    try {
        console.log('\nBem-vindo\nDigite uma opção:');
        console.log('1 - Cadastrar 2 - Consultar 3 - Sacar\n' +
            '4 - Depositar 5 - Excluir 6 - Transferir\n' +
            '7 – Totalizações' +
            '0 - Sair\n');
        opcao = promptSync("Opção:");
        switch (opcao) {
            case "1":
                inserir();
                break;
            case "2":
                consultar();
                break;
            case "3":
                sacar();
                break;
            case "4":
                depositar();
                break;
            case "5":
                excluir();
                break;
            case "6":
                transferir();
                break;
            case "7":
                totalizacoes();
                break;
            case "0":
                console.log("Aplicação encerrada");
                b.salvarEmArquivo();
                break;
            default:
                console.log("Opção inválida");
        }
    }
    catch (e) {
        if (e instanceof Error_1.AplicacaoError) {
            console.log(e.message);
        }
        else if (e instanceof Error_1.SaldoInsuficienteError) {
            console.log("Saldo insuficiente para realizar operação.");
        }
        else if (e instanceof Error_1.ValorInvalidoError) {
            console.log("Valor inválido. Digite um valor numérico positivo.");
        }
        else if (e instanceof Error_1.PoupancaInvalidaError) {
            console.log("Operação de render juros só pode ser realizada em contas poupança.");
        }
        else if (e instanceof Error_1.ContaJaExistenteError) {
            console.log(e.message);
        }
        else {
            console.error("Erro não esperado:", e.message);
        }
    }
    finally {
        console.log("Operação finalizada. Digite <enter> para continuar.");
    }
} while (opcao != "0");
function inserir() {
    console.log("\nCadastrar conta\n");
    var numero;
    while (true) {
        numero = promptSync('Digite o número da conta:');
        if (numero && /^\d+$/.test(numero)) {
            break;
        }
        console.log("Insira apenas números. Tente novamente.");
    }
    var tipo;
    while (true) {
        tipo = promptSync('Digite o tipo da conta (C - Conta normal, CP - Poupança, CI - Conta imposto):');
        if (tipo) {
            break;
        }
        console.log("Valor inválido. Tente novamente.");
    }
    var conta;
    if (tipo == 'C') {
        conta = new Banco_1.Conta(numero, 0);
    }
    else if (tipo == 'CP') {
        var taxaDeJuros = void 0;
        while (true) {
            taxaDeJuros = parseFloat(promptSync('Digite a taxa de juros:'));
            if (!isNaN(taxaDeJuros) && taxaDeJuros > 0) {
                break;
            }
            console.log("Valor inválido. Tente novamente.");
        }
        conta = new Banco_1.Poupanca(numero, 0, taxaDeJuros);
    }
    else if (tipo == 'CI') {
        var taxaDesconto = void 0;
        while (true) {
            taxaDesconto = parseFloat(promptSync('Digite a taxa de desconto:'));
            if (!isNaN(taxaDesconto) && taxaDesconto > 0) {
                break;
            }
            console.log("Valor inválido. Tente novamente.");
        }
        conta = new Banco_1.ContaImposto(numero, 0, taxaDesconto);
    }
    else {
        throw new Error_1.ValorInvalidoError;
    }
    b.inserir(conta);
}
function consultar() {
    console.log("\nConsultar conta\n");
    var numero = promptSync('Digite o número da conta:');
    if (!numero) {
        throw new Error_1.ValorInvalidoError;
    }
    try {
        var conta = b.consultar(numero);
        console.log("Conta ".concat(conta.numero, " encontrada"));
        console.log("Saldo: R$ ".concat(conta.saldo.toFixed(2)));
        if (conta instanceof Banco_1.Poupanca) {
            console.log("Taxa de juros: ".concat(conta.taxaDeJuros, "%"));
        }
        else if (conta instanceof Banco_1.ContaImposto) {
            console.log("Taxa de desconto: ".concat(conta.taxaDesconto, "%"));
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
function sacar() {
    console.log("\nSacar da conta\n");
    var numero = promptSync('Digite o número da conta:');
    var valor = parseFloat(promptSync('Digite o valor a ser sacado:'));
    if (!numero || isNaN(valor) || valor <= 0) {
        throw new Error_1.ValorInvalidoError;
    }
    try {
        b.sacar(numero, valor);
        console.log("Saque de R$ ".concat(valor.toFixed(2), " realizado da conta ").concat(numero));
    }
    catch (error) {
        console.error(error.message);
    }
}
function depositar() {
    console.log("\nDepositar na conta\n");
    var numero = promptSync('Digite o número da conta:');
    var valor = parseFloat(promptSync('Digite o valor a ser depositado:'));
    if (!numero || isNaN(valor) || valor <= 0) {
        throw new Error_1.ValorInvalidoError;
    }
    try {
        b.depositar(numero, valor);
        console.log("Dep\u00F3sito de R$ ".concat(valor.toFixed(2), " realizado na conta ").concat(numero));
    }
    catch (error) {
        console.error(error.message);
    }
}
function excluir() {
    console.log("\nExcluir conta\n");
    var numero = promptSync('Digite o número da conta:');
    if (!numero) {
        throw new Error_1.ValorInvalidoError;
    }
    try {
        b.excluir(numero);
        console.log("Conta ".concat(numero, " exclu\u00EDda"));
    }
    catch (error) {
        console.error(error.message);
    }
}
function transferir() {
    console.log("\nTransferir entre contas\n");
    var numeroDebito = promptSync('Digite o número da conta de débito:');
    var numeroCredito = promptSync('Digite o número da conta de crédito:');
    var valor = parseFloat(promptSync('Digite o valor a ser transferido:'));
    if (!numeroDebito || !numeroCredito || isNaN(valor) || valor <= 0) {
        throw new Error_1.ValorInvalidoError;
    }
    try {
        b.transferir(numeroCredito, numeroDebito, valor);
        console.log("Transfer\u00EAncia de R$ ".concat(valor.toFixed(2), " realizada da conta ").concat(numeroDebito, " para a conta ").concat(numeroCredito));
    }
    catch (error) {
        console.error(error.message);
    }
}
function totalizacoes() {
    console.log("\nTotalizações do banco\n");
    console.log("Total depositado: R$ ".concat(b.getTotalDepositado().toFixed(2)));
    console.log("N\u00FAmero de contas: ".concat(b.getTotalContas()));
    console.log("M\u00E9dia depositada: R$ ".concat(b.getMediaDepositada().toFixed(2)));
    console.log("Operação finalizada. Digite <enter> para continuar.");
}
