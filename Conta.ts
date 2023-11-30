import * as fs from 'fs';
import { AplicacaoError, ContaInexistenteError, SaldoInsuficienteError, ValorInvalidoError } from './Error';

export class Conta {
 private _numero: string;
 private _saldo: number;

 constructor(numero: string, saldoInicial: number) {
   if (saldoInicial < 0) {
	 throw new Error("O saldo inicial não pode ser negativo");
   }

   this._numero = numero;
   this._saldo = saldoInicial;
 }

  private validarValor(valor: number): void {
   if (valor <= 0) {
	 throw new ValorInvalidoError();
   }
 }

 sacar(valor: number): void {
   this.validarValor(valor);

   if (this._saldo < valor) {
	 throw new SaldoInsuficienteError();
   }

   this._saldo -= valor;
 }
 depositar(valor: number): void {
   this.validarValor(valor);
   this._saldo += valor;
 }
 transferir(contaDestino: Conta, valor: number): void {
   this.sacar(valor);
   contaDestino.depositar(valor);
 }

 get numero(): string {
   return this._numero;
 }

 get saldo(): number {
   return this._saldo;
 }
}
