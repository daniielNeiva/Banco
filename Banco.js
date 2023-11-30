"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContaImposto = exports.Poupanca = exports.Conta = exports.Banco = void 0;
// Coloquei as alterações feitas em cada questão no arquivo Respostas.txt
var fs = require("fs");
var Error_1 = require("./Error");
var Conta_1 = require("./Conta");
Object.defineProperty(exports, "Conta", { enumerable: true, get: function () { return Conta_1.Conta; } });
var Poupanca = /** @class */ (function (_super) {
    __extends(Poupanca, _super);
    function Poupanca(numero, saldo, taxaDeJuros) {
        var _this = _super.call(this, numero, saldo) || this;
        _this._taxaDeJuros = taxaDeJuros;
        return _this;
    }
    Poupanca.prototype.renderJuros = function () {
        var juros = this.saldo * this._taxaDeJuros / 100;
        this.depositar(juros);
    };
    Object.defineProperty(Poupanca.prototype, "taxaDeJuros", {
        get: function () {
            return this._taxaDeJuros;
        },
        enumerable: false,
        configurable: true
    });
    return Poupanca;
}(Conta_1.Conta));
exports.Poupanca = Poupanca;
var ContaImposto = /** @class */ (function (_super) {
    __extends(ContaImposto, _super);
    function ContaImposto(numero, saldo, taxaDesconto) {
        var _this = _super.call(this, numero, saldo) || this;
        _this._taxaDesconto = taxaDesconto;
        return _this;
    }
    ContaImposto.prototype.sacar = function (valor) {
        var valorDesconto = this.saldo * this._taxaDesconto / 100;
        _super.prototype.sacar.call(this, valor + valorDesconto);
    };
    Object.defineProperty(ContaImposto.prototype, "taxaDesconto", {
        get: function () {
            return this._taxaDesconto;
        },
        enumerable: false,
        configurable: true
    });
    return ContaImposto;
}(Conta_1.Conta));
exports.ContaImposto = ContaImposto;
var Banco = /** @class */ (function () {
    function Banco() {
        this.contas = [];
        this.CAMINHO_ARQUIVO = "./teste_poo/contas.txt";
    }
    Banco.prototype.inserir = function (conta) {
        // Verificar se a conta já existe na lista
        if (this.contas.some(function (c) { return c.numero === conta.numero; })) {
            console.log("Conta ".concat(conta.numero, " j\u00E1 cadastrada"));
        }
        else {
            this.contas.push(conta);
            console.log("Conta ".concat(conta.numero, " cadastrada"));
        }
    };
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
    Banco.prototype.consultar = function (numero) {
        var contaConsultada;
        for (var _i = 0, _a = this.contas; _i < _a.length; _i++) {
            var conta = _a[_i];
            if (conta.numero == numero) {
                contaConsultada = conta;
                break;
            }
        }
        if (!contaConsultada) {
            throw new Error_1.ContaInexistenteError(numero);
        }
        return contaConsultada;
    };
    Banco.prototype.consultarPorIndice = function (numero) {
        var indice = -1;
        for (var i = 0; i < this.contas.length; i++) {
            if (this.contas[i].numero == numero) {
                indice = i;
                break;
            }
        }
        if (indice === -1) {
            throw new Error_1.ContaInexistenteError(numero);
        }
        return indice;
    };
    Banco.prototype.alterar = function (conta) {
        var indice = this.consultarPorIndice(conta.numero);
        this.contas[indice] = conta;
    };
    Banco.prototype.excluir = function (numero) {
        var indice = this.consultarPorIndice(numero);
        if (indice !== -1) {
            this.contas.splice(indice, 1);
            console.log("Conta ".concat(numero, " exclu\u00EDda"));
        }
    };
    Banco.prototype.depositar = function (numero, valor) {
        var contaConsultada = this.consultar(numero);
        contaConsultada.depositar(valor);
    };
    Banco.prototype.sacar = function (numero, valor) {
        var contaConsultada = this.consultar(numero);
        contaConsultada.sacar(valor);
    };
    Banco.prototype.transferir = function (numeroCredito, numeroDebito, valor) {
        var contaCredito = this.consultar(numeroCredito);
        var contaDebito = this.consultar(numeroDebito);
        contaDebito.transferir(contaCredito, valor);
    };
    Banco.prototype.getTotalDepositado = function () {
        var totalDepositado = this.contas.reduce(function (totalAcumulado, conta) {
            return totalAcumulado + conta.saldo;
        }, 0);
        return totalDepositado;
    };
    Banco.prototype.renderJuros = function (numero) {
        var conta = this.consultar(numero);
        if (conta instanceof Poupanca) {
            conta.renderJuros();
        }
    };
    Banco.prototype.getTotalContas = function () {
        return this.contas.length;
    };
    Banco.prototype.getMediaDepositada = function () {
        return this.getTotalDepositado() / this.getTotalContas();
    };
    Banco.prototype.carregarDeArquivo = function () {
        var arquivo = fs.readFileSync(this.CAMINHO_ARQUIVO, 'utf-8');
        var linhas = arquivo.split('\r\n');
        console.log("Iniciando leitura de arquivo");
        for (var i = 0; i < linhas.length; i++) {
            var linhaConta = linhas[i].split(";");
            var conta = void 0;
            var tipo = linhaConta[2];
            if (linhas[i] != "") {
                if (tipo == 'C') {
                    conta = new Conta_1.Conta(linhaConta[0], parseFloat(linhaConta[1]));
                }
                else if (tipo == 'CP') {
                    conta = new Poupanca(linhaConta[0], parseFloat(linhaConta[1]), parseFloat(linhaConta[3]));
                }
                else if (tipo == 'CI') {
                    conta = new ContaImposto(linhaConta[0], parseFloat(linhaConta[1]), parseFloat(linhaConta[3]));
                }
                this.contas.push(conta); // Adicione a conta diretamente à lista de contas do banco
                console.log("Conta ".concat(conta.numero, " carregada"));
            }
        }
        console.log("Fim do arquivo");
    };
    Banco.prototype.salvarEmArquivo = function () {
        var stringContas = "";
        var linha = "";
        for (var _i = 0, _a = this.contas; _i < _a.length; _i++) {
            var conta = _a[_i];
            if (conta instanceof Poupanca) {
                linha = "".concat(conta.numero, ";").concat(conta.saldo, ";CP;").concat(conta.taxaDeJuros, "\r\n");
            }
            else if ((conta instanceof ContaImposto)) {
                linha = "".concat(conta.numero, ";").concat(conta.saldo, ";CI;").concat(conta.taxaDesconto, "\r\n");
            }
            else {
                linha = "".concat(conta.numero, ";").concat(conta.saldo, ";C\r\n");
            }
            stringContas += linha;
        }
        stringContas = stringContas.slice(0, stringContas.length - 2);
        fs.writeFileSync(this.CAMINHO_ARQUIVO, stringContas, 'utf-8');
        console.log("Contas salvas em arquivo.");
    };
    return Banco;
}());
exports.Banco = Banco;
