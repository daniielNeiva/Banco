class AplicacaoError extends Error {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
    }
  }
  
  class ContaInexistenteError extends AplicacaoError {
    constructor(numero: string) {
      super(`Conta ${numero} não encontrada`);
    }
  }
  
  class SaldoInsuficienteError extends AplicacaoError {
    constructor() {
      super("Saldo insuficiente");
    }
  }
  class ValorInvalidoError extends AplicacaoError {
    constructor() {
      super("Valor inválido para crédito/depósito");
    }
  }
  class PoupancaInvalidaError extends AplicacaoError {
    constructor() {
      super("A operação de render juros só pode ser realizada em contas poupança");
    }
  }
  
  class ContaJaExistenteError extends AplicacaoError {
    constructor(numero: string) {
      super(`Conta ${numero} já cadastrada`);
    }
  }
  
  
  
  export { AplicacaoError, ContaInexistenteError, SaldoInsuficienteError,ValorInvalidoError,  PoupancaInvalidaError,ContaJaExistenteError };
  