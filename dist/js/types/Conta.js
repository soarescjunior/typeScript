import { TipoTransacao } from "./TipoTransacao.js";
let saldo = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes = JSON.parse(localStorage.getItem("transacoes"), (key, value) => {
    if (key === "data") {
        return new Date(value);
    }
    return value;
}) || [];
function debitar(valor) {
    if (valor <= 0) {
        throw new Error("O valor a ser debitado dever ser maior que zero");
    }
    else if (valor > saldo) {
        throw new Error("O valor do saldo é menor que o valor do operação");
    }
    else {
        saldo -= valor;
        localStorage.setItem("saldo", saldo.toString());
    }
}
function depositar(valor) {
    if (valor <= 0) {
        throw new Error("O valor a ser depositado dever ser maior que zero");
    }
    else {
        saldo += valor;
        localStorage.setItem("saldo", saldo.toString());
    }
}
const Conta = {
    getSaldo() {
        return saldo;
    },
    getDataAcesso() {
        return new Date();
    },
    getGruposTransacoes() {
        const grupoTransacoes = [];
        const listaTransacoes = structuredClone(transacoes);
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacoes = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacoes = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });
            if (labelAtualGrupoTransacoes !== labelGrupoTransacoes) {
                labelAtualGrupoTransacoes = labelGrupoTransacoes;
                grupoTransacoes.push({
                    label: labelGrupoTransacoes,
                    transacoes: []
                });
            }
            grupoTransacoes.at(-1).transacoes.push(transacao);
        }
        return grupoTransacoes;
    },
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA ||
            novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error("Transação invalida");
        }
        transacoes.push(novaTransacao);
        console.log(this.getGruposTransacoes());
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    }
};
export default Conta;
