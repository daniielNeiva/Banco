 // Coloquei as alterações feitas em cada questão no arquivo Respostas.txt
 import * as fs from 'fs';
 import { AplicacaoError, ContaInexistenteError, SaldoInsuficienteError, ValorInvalidoError } from './Error';
 import { Conta } from './Conta'
class Poupanca extends Conta {
  private _taxaDeJuros: number;

  constructor(numero: string, saldo: number, taxaDeJuros: number) {
    super(numero, saldo);
    this._taxaDeJuros = taxaDeJuros;
  }

  renderJuros(): void {
    let juros: number = this.saldo * this._taxaDeJuros / 100;
    this.depositar(juros);
  }

  get taxaDeJuros(): number {
    return this._taxaDeJuros;
  }
}

class ContaImposto extends Conta {
  private _taxaDesconto: number;

  constructor(numero: string, saldo: number, taxaDesconto: number) {
    super(numero, saldo);
    this._taxaDesconto = taxaDesconto
  }

  sacar(valor: number): void {
    let valorDesconto = this.saldo * this._taxaDesconto / 100;
    super.sacar(valor + valorDesconto);
  }

  get taxaDesconto(): number {
    return this._taxaDesconto;
  }
}

class Banco {
  private contas: Conta[] = [];
  private CAMINHO_ARQUIVO: string = "./teste_poo/contas.txt";
  public inserir(conta: Conta): void {
    // Verificar se a conta já existe na lista
    if (this.contas.some((c) => c.numero === conta.numero)) {
      console.log(`Conta ${conta.numero} já cadastrada`);
    } else {
      this.contas.push(conta);
      console.log(`Conta ${conta.numero} cadastrada`);
    }
  } 

  /*public inserir(conta: Conta): void {     
    try {
      // Verificar se a conta já existe na lista
      this.consultar(conta.numero);
      console.log(`Conta ${conta.numero} já cadastrada`);
    } catch (error) {
      if (error instanceof ContaInexistenteError) {
        // A conta não existe, pode ser adicionada
        this.contas.push(conta);
        console.log(`Conta ${conta.numero} cadastrada`);
      } else {
        // Outro erro inesperado
        throw error;
      }
    }
  }*/
  

  public consultar(numero: string): Conta {
    let contaConsultada!: Conta;
    for (let conta of this.contas) {
      if (conta.numero == numero) {
        contaConsultada = conta;
        break;
      }
    }

    if (!contaConsultada) {
      throw new ContaInexistenteError(numero);
    }

    return contaConsultada;
  }

  private consultarPorIndice(numero: string): number {
    let indice: number = -1;
    for (let i: number = 0; i < this.contas.length; i++) {
      if (this.contas[i].numero == numero) {
        indice = i;
        break;
      }
    }

    if (indice === -1) {
      throw new ContaInexistenteError(numero);
    }

    return indice;
  }


  public alterar(conta: Conta): void {
    let indice: number = this.consultarPorIndice(conta.numero);
    this.contas[indice] = conta;
  }


 
public excluir(numero: string): void {
  let indice: number = this.consultarPorIndice(numero);

  if (indice !== -1) {
    this.contas.splice(indice, 1);
    console.log(`Conta ${numero} excluída`);
  }
}


  public depositar(numero: string, valor: number): void {
    let contaConsultada = this.consultar(numero);
    contaConsultada.depositar(valor);
  }


  public sacar(numero: string, valor: number): void {
    let contaConsultada = this.consultar(numero);
    contaConsultada.sacar(valor);
  }

  public transferir(numeroCredito: string, numeroDebito: string, valor: number): void {
    let contaCredito = this.consultar(numeroCredito);
    let contaDebito = this.consultar(numeroDebito);

    contaDebito.transferir(contaCredito, valor);
  }

  public getTotalDepositado(): number {
    let totalDepositado =
      this.contas.reduce((totalAcumulado: number, conta: Conta) => {
        return totalAcumulado + conta.saldo;
      }, 0);

    return totalDepositado;
  }

  renderJuros(numero: string) {
    let conta: Conta = this.consultar(numero);
    if (conta instanceof Poupanca) {
      conta.renderJuros();
    }
  }

  public getTotalContas(): number {
    return this.contas.length;
  }

  public getMediaDepositada(): number {
    return this.getTotalDepositado() / this.getTotalContas();
  }

  public carregarDeArquivo() {
    const arquivo: string = fs.readFileSync(this.CAMINHO_ARQUIVO, 'utf-8');
    const linhas: string[] = arquivo.split('\r\n');
    console.log("Iniciando leitura de arquivo");
  
    for (let i: number = 0; i < linhas.length; i++) {
      let linhaConta: string[] = linhas[i].split(";");
      let conta!: Conta;
      let tipo: string = linhaConta[2];
      if (linhas[i] != "") {
        if (tipo == 'C') {
          conta = new Conta(linhaConta[0], parseFloat(linhaConta[1]));
        } else if (tipo == 'CP') {
          conta = new Poupanca(linhaConta[0], parseFloat(linhaConta[1]), parseFloat(linhaConta[3]));
        } else if (tipo == 'CI') {
          conta = new ContaImposto(linhaConta[0], parseFloat(linhaConta[1]), parseFloat(linhaConta[3]));
        }
  
        this.contas.push(conta); // Adicione a conta diretamente à lista de contas do banco
        console.log(`Conta ${conta.numero} carregada`);
      }
    }
  
    console.log("Fim do arquivo");
  }
  

  public salvarEmArquivo() {
    let stringContas: string = "";
    let linha: string = "";

    for (let conta of this.contas) {
      if (conta instanceof Poupanca) {
        linha = `${conta.numero};${conta.saldo};CP;${conta.taxaDeJuros}\r\n`;
      } else if ((conta instanceof ContaImposto)) {
        linha = `${conta.numero};${conta.saldo};CI;${conta.taxaDesconto}\r\n`;
      } else {
        linha = `${conta.numero};${conta.saldo};C\r\n`;
      }

      stringContas += linha;
    }

    stringContas = stringContas.slice(0, stringContas.length - 2);
    fs.writeFileSync(this.CAMINHO_ARQUIVO, stringContas, 'utf-8');
    console.log("Contas salvas em arquivo.")
  }
}

export { Banco, Conta, Poupanca, ContaImposto };