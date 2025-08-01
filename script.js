
function openTab(evt, tabId) {
  document.querySelectorAll('.tab-content').forEach(div => div.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  evt.currentTarget.classList.add('active');
}
const listaDeBolos = [
  "Red Velvet", "Black Cake", "Gargamel", "Olho de Sogra", "Bolo Chamego",
  "Frutas Vermelhas", "Dois Amores", "Floresta Negra", "Ninho, Morango e Chocolate",
  "Ninho com Nutella", "Bolo Brigadeirudo", "Castanha", "Pistache Cake", "Kinder Cake"
];

const informacoesTamanhos = {
  mini: { nome: "Mini", peso: "1 kg", fatias: 6 },
  pequeno: { nome: "Pequeno", peso: "1,5 kg", fatias: 15 },
  médio: { nome: "Médio", peso: "2,5 kg", fatias: 22 },
  grande: { nome: "Grande", peso: "3,5 kg", fatias: 30 }
};

const precosBolos = {
  "Red Velvet": { mini: 139, pequeno: 230, médio: 360, grande: 475 },
  "Black Cake": { mini: 160, pequeno: 280, médio: 415, grande: 560 },
  "Gargamel": { mini: 125, pequeno: 215, médio: 325, grande: 437 },
  "Olho de Sogra": { mini: 135, pequeno: 200, médio: 280, grande: 472 },
  "Bolo Chamego": { mini: 115, pequeno: 198, médio: 299, grande: 385 },
  "Frutas Vermelhas": { mini: 135, pequeno: 230, médio: 351, grande: 472 },
  "Dois Amores": { mini: 115, pequeno: 198, médio: 280, grande: 385 },
  "Floresta Negra": { mini: 135, pequeno: 230, médio: 351, grande: 472 },
  "Ninho, Morango e Chocolate": { mini: 125, pequeno: 225, médio: 325, grande: 437 },
  "Ninho com Nutella": { mini: 189, pequeno: 250, médio: 365, grande: 486 },
  "Bolo Brigadeirudo": { mini: 115, pequeno: 198, médio: 280, grande: 385 },
  "Castanha": { mini: 110, pequeno: 185, médio: 355, grande: 455 },
  "Pistache Cake": { mini: 160, pequeno: 280, médio: 416, grande: 560 },
  "Kinder Cake": { mini: 189, pequeno: 250, médio: 361, grande: 486 }
};

window.onload = () => {
  const selectBolo = document.getElementById("sabor");
  listaDeBolos.forEach(bolo => {
    const option = document.createElement("option");
    option.value = bolo;
    option.textContent = bolo;
    selectBolo.appendChild(option);
  });

  const tipoSelect = document.getElementById("tipo");
  const deliveryFields = document.getElementById("deliveryFields");

  tipoSelect.addEventListener("change", () => {
    deliveryFields.classList.toggle("oculto", tipoSelect.value !== "delivery");
  });

  document.getElementById("pedidoForm").addEventListener("submit", e => {
    e.preventDefault();
    try {
      const tipo = document.getElementById("tipo").value;
      const tamanho = document.getElementById("tamanho").value;
      const sabor = document.getElementById("sabor").value;
      const infoTamanho = informacoesTamanhos[tamanho];
      const precoBolo = precosBolos[sabor][tamanho];
      const valorEntrega = tipo === "delivery" ? parseFloat(document.getElementById("valorEntrega").value) : 0;
      const adiantamento = parseFloat(document.getElementById("adiantamento").value) || 0;
      const totalOriginal = precoBolo + valorEntrega;
      if (adiantamento > totalOriginal) {
        alert('O valor do adiantamento não pode ser maior que o total do pedido.');
        return;
      }
      const total = totalOriginal - adiantamento;

      const pedido = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        tipo,
        endereco: tipo === "delivery" ? document.getElementById("endereco").value : "",
        numero: tipo === "delivery" ? document.getElementById("numero").value : "",
        bairro: tipo === "delivery" ? document.getElementById("bairro").value : "",
        observacoes: tipo === "delivery" ? document.getElementById("observacoes").value : "",
        data: document.getElementById("dataPedido").value,
        hora: document.getElementById("horaPedido").value,
        tamanho: `${infoTamanho.nome} (${infoTamanho.peso} | ${infoTamanho.fatias} fatias)`,
        sabor,
        precoBolo,
        valorEntrega,
        adiantamento,
        total
      };

      gerarComprovante(pedido);
    } catch (err) {
      alert("Erro ao gerar comprovante: " + err.message);
    }
  });
};

function gerarComprovante(pedido) {
  const comprovanteDiv = document.getElementById("comprovante");

  const entregaOuRetirada = pedido.tipo === "delivery"
    ? `*Endereço de entrega:*
${pedido.endereco}, ${pedido.numero}
Bairro: ${pedido.bairro}${pedido.observacoes ? `
Obs: ${pedido.observacoes}` : ""}

*Entrega:*
> ${formatarData(pedido.data)} | ${pedido.hora}`
    : `*Retirada:*
> ${formatarData(pedido.data)} | ${pedido.hora}`;

  const comprovanteTexto = `
*CONFIRMAÇÃO DO PEDIDO*

Cliente: *${pedido.nome}*
Telefone: *${pedido.telefone}*

${entregaOuRetirada}

*Pedido:* 
1 - Bolo ${pedido.sabor} ${pedido.tamanho} - R$ ${pedido.precoBolo.toFixed(2).replace('.', ',')}
${pedido.valorEntrega > 0 ? `1 - Taxa de Entrega = R$ ${pedido.valorEntrega.toFixed(2).replace('.', ',')}` : ""}
==========================
Total: *R$ ${pedido.total.toFixed(2).replace('.', ',')}*
==========================

_Estamos preparando o seu pedido._

_Agradecemos a preferência._
  `;

  comprovanteDiv.innerHTML = `<pre>${comprovanteTexto.trim()}</pre>`;
  comprovanteDiv.style.display = "block";
}

function formatarData(dataISO) {
  const dias = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  const dataObj = new Date(dataISO + 'T00:00:00');
  const diaSemana = dias[dataObj.getDay()];
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes} ${diaSemana}`;
}
