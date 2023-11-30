"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conta = void 0;
var Error_1 = require("./Error");
var Conta = /** @class */ (function () {
    function Conta(numero, saldoInicial) {
        if (saldoInicial < 0) {
            throw new Error("O saldo inicial não pode ser negativo");
        }
        this._numero = numero;
        this._saldo = saldoInicial;
    }
    Conta.prototype.validarValor = function (valor) {
        if (valor <= 0) {
            throw new Error_1.ValorInvalidoError();
        }
    };
    Conta.prototype.sacar = function (valor) {
        this.validarValor(valor);
        if (this._saldo < valor) {
            throw new Error_1.SaldoInsuficienteError();
        }
        this._saldo -= valor;
    };
    Conta.prototype.depositar = function (valor) {
        this.validarValor(valor);
        this._saldo += valor;
    };
    Conta.prototype.transferir = function (contaDestino, valor) {
        this.sacar(valor);
        contaDestino.depositar(valor);
    };
    Object.defineProperty(Conta.prototype, "numero", {
        get: function () {
            return this._numero;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Conta.prototype, "saldo", {
        get: function () {
            return this._saldo;
        },
        enumerable: false,
        configurable: true
    });
    return Conta;
}());
exports.Conta = Conta;
