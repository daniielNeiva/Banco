const promptSync = require('prompt-sync')();
import { Banco, Conta, Poupanca, ContaImposto } from "./Banco";
import {
  AplicacaoError,
  ContaInexistenteError,
  SaldoInsuficienteError,
  ValorInvalidoError,
  PoupancaInvalidaError,
  ContaJaExistenteError
} from "./Error";

let b: Banco = new Banco();
b.carregarDeArquivo();
let opcao: string = '';

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
  } catch (e: any) {
    if (e instanceof AplicacaoError) {
      console.log(e.message);
    } else if (e instanceof SaldoInsuficienteError) {
      console.log("Saldo insuficiente para realizar operação.");
    } else if (e instanceof ValorInvalidoError) {
      console.log("Valor inválido. Digite um valor numérico positivo.");
    } else if (e instanceof PoupancaInvalidaError) {
      console.log("Operação de render juros só pode ser realizada em contas poupança.");
    } else if (e instanceof ContaJaExistenteError) {
      console.log(e.message);
    } else {
      console.error("Erro não esperado:", e.message);
    }
  } finally {
    console.log("Operação finalizada. Digite <enter> para continuar.");
  }
} while (opcao != "0");

function inserir() {
  console.log("\nCadastrar conta\n");
  
  let numero;
  while (true) {
    numero = promptSync('Digite o número da conta:');
    if (numero && /^\d+$/.test(numero)) {
      break;
    }
    console.log("Insira apenas números. Tente novamente.");
  }

  let tipo;
  while (true) {
    tipo = promptSync('Digite o tipo da conta (C - Conta normal, CP - Poupança, CI - Conta imposto):');
    if (tipo) {
      break;
    }
    console.log("Valor inválido. Tente novamente.");
  }

  let conta;

  if (tipo == 'C') {
    conta = new Conta(numero, 0);
  } else if (tipo == 'CP') {
    let taxaDeJuros;
    while (true) {
      taxaDeJuros = parseFloat(promptSync('Digite a taxa de juros:'));
      if (!isNaN(taxaDeJuros) && taxaDeJuros > 0) {
        break;
      }
      console.log("Valor inválido. Tente novamente.");
    }
    conta = new Poupanca(numero, 0, taxaDeJuros);
  } else if (tipo == 'CI') {
    let taxaDesconto;
    while (true) {
      taxaDesconto = parseFloat(promptSync('Digite a taxa de desconto:'));
      if (!isNaN(taxaDesconto) && taxaDesconto > 0) {
        break;
      }
      console.log("Valor inválido. Tente novamente.");
    }
    conta = new ContaImposto(numero, 0, taxaDesconto);
  } else {
    throw new ValorInvalidoError;
  }

  b.inserir(conta);
}

function consultar() {
  console.log("\nConsultar conta\n");
  let numero = promptSync('Digite o número da conta:');

  if (!numero) {
    throw new ValorInvalidoError;
  }

  try {
    let conta = b.consultar(numero);
    console.log(`Conta ${conta.numero} encontrada`);
    console.log(`Saldo: R$ ${conta.saldo.toFixed(2)}`);
    if (conta instanceof Poupanca) {
      console.log(`Taxa de juros: ${conta.taxaDeJuros}%`);
    } else if (conta instanceof ContaImposto) {
      console.log(`Taxa de desconto: ${conta.taxaDesconto}%`);
    }
  } catch (error) {
    console.log(error.message);
  }
}

function sacar() {
  console.log("\nSacar da conta\n");
  let numero = promptSync('Digite o número da conta:');
  let valor = parseFloat(promptSync('Digite o valor a ser sacado:'));

  if (!numero || isNaN(valor) || valor <= 0) {
    throw new ValorInvalidoError;
  }

  try {
    b.sacar(numero, valor);
    console.log(`Saque de R$ ${valor.toFixed(2)} realizado da conta ${numero}`);
  } catch (error) {
    console.error(error.message);
  }
}

function depositar() {
  console.log("\nDepositar na conta\n");
  let numero = promptSync('Digite o número da conta:');
  let valor = parseFloat(promptSync('Digite o valor a ser depositado:'));

  if (!numero || isNaN(valor) || valor <= 0) {
    throw new ValorInvalidoError;
  }

  try {
    b.depositar(numero, valor);
    console.log(`Depósito de R$ ${valor.toFixed(2)} realizado na conta ${numero}`);
  } catch (error) {
    console.error(error.message);
  }
}

function excluir() {
  console.log("\nExcluir conta\n");
  let numero = promptSync('Digite o número da conta:');

  if (!numero) {
    throw new ValorInvalidoError;
  }

  try {
    b.excluir(numero);
    console.log(`Conta ${numero} excluída`);
  } catch (error) {
    console.error(error.message);
  }
}

function transferir() {
  console.log("\nTransferir entre contas\n");
  let numeroDebito = promptSync('Digite o número da conta de débito:');
  let numeroCredito = promptSync('Digite o número da conta de crédito:');
  let valor = parseFloat(promptSync('Digite o valor a ser transferido:'));

  if (!numeroDebito || !numeroCredito || isNaN(valor) || valor <= 0) {
    throw new ValorInvalidoError;
  }

  try {
    b.transferir(numeroCredito, numeroDebito, valor);
    console.log(`Transferência de R$ ${valor.toFixed(2)} realizada da conta ${numeroDebito} para a conta ${numeroCredito}`);
  } catch (error) {
    console.error(error.message);
  }
}

function totalizacoes() {
  console.log("\nTotalizações do banco\n");
  console.log(`Total depositado: R$ ${b.getTotalDepositado().toFixed(2)}`);
  console.log(`Número de contas: ${b.getTotalContas()}`);
  console.log(`Média depositada: R$ ${b.getMediaDepositada().toFixed(2)}`);
  console.log("Operação finalizada. Digite <enter> para continuar.");
}
