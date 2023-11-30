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
exports.ContaJaExistenteError = exports.PoupancaInvalidaError = exports.ValorInvalidoError = exports.SaldoInsuficienteError = exports.ContaInexistenteError = exports.AplicacaoError = void 0;
var AplicacaoError = /** @class */ (function (_super) {
    __extends(AplicacaoError, _super);
    function AplicacaoError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        return _this;
    }
    return AplicacaoError;
}(Error));
exports.AplicacaoError = AplicacaoError;
var ContaInexistenteError = /** @class */ (function (_super) {
    __extends(ContaInexistenteError, _super);
    function ContaInexistenteError(numero) {
        return _super.call(this, "Conta ".concat(numero, " n\u00E3o encontrada")) || this;
    }
    return ContaInexistenteError;
}(AplicacaoError));
exports.ContaInexistenteError = ContaInexistenteError;
var SaldoInsuficienteError = /** @class */ (function (_super) {
    __extends(SaldoInsuficienteError, _super);
    function SaldoInsuficienteError() {
        return _super.call(this, "Saldo insuficiente") || this;
    }
    return SaldoInsuficienteError;
}(AplicacaoError));
exports.SaldoInsuficienteError = SaldoInsuficienteError;
var ValorInvalidoError = /** @class */ (function (_super) {
    __extends(ValorInvalidoError, _super);
    function ValorInvalidoError() {
        return _super.call(this, "Valor inválido para crédito/depósito") || this;
    }
    return ValorInvalidoError;
}(AplicacaoError));
exports.ValorInvalidoError = ValorInvalidoError;
var PoupancaInvalidaError = /** @class */ (function (_super) {
    __extends(PoupancaInvalidaError, _super);
    function PoupancaInvalidaError() {
        return _super.call(this, "A operação de render juros só pode ser realizada em contas poupança") || this;
    }
    return PoupancaInvalidaError;
}(AplicacaoError));
exports.PoupancaInvalidaError = PoupancaInvalidaError;
var ContaJaExistenteError = /** @class */ (function (_super) {
    __extends(ContaJaExistenteError, _super);
    function ContaJaExistenteError(numero) {
        return _super.call(this, "Conta ".concat(numero, " j\u00E1 cadastrada")) || this;
    }
    return ContaJaExistenteError;
}(AplicacaoError));
exports.ContaJaExistenteError = ContaJaExistenteError;
