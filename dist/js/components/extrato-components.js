import Conta from "../types/Conta.js";
import { FormatoData } from "../types/FormatoData.js";
import { formatarData, formatarMoeda } from './../utils/formatters.js';
const elementoRegistroTransacoesExtrato = document.querySelector(".extrato .registro-transacoes");
renderizarExtrato();
function renderizarExtrato() {
    const gruposTransacoes = Conta.getGruposTransacoes();
    elementoRegistroTransacoesExtrato.innerHTML = "";
    let htmlRegistroTransacoes = "";
    for (let grupoTransacao of gruposTransacoes) {
        let htmlTransacoesItem = "";
        for (let transacao of grupoTransacao.transacoes) {
            htmlTransacoesItem += `
            <div class="transacao-item">
              <div class="transacao-info">
                <span class="tipo">${transacao.tipoTransacao}</span>
                <strong class="valor">${formatarMoeda(transacao.valor)}</strong>
              </div>
              <time class="data">${formatarData(transacao.data, FormatoData.DIA_MES)}</time>
            </div>
            `;
        }
        htmlRegistroTransacoes += `
            <div class="transacoes-group">
              <strong class="mes-group">${grupoTransacao.label}</strong>
              ${htmlTransacoesItem}
            </div>
       `;
    }
    if (htmlRegistroTransacoes === "") {
        htmlRegistroTransacoes = "<div> Não há transações registrada</div>";
    }
    elementoRegistroTransacoesExtrato.innerHTML = htmlRegistroTransacoes;
}
const ExtratoComponent = {
    atualizar() {
        renderizarExtrato();
    }
};
export default ExtratoComponent;
