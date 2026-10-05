const campo = document.getElementById("campo-tarefa");
const campoAgendamento = document.getElementById("campo-agendamento");
const botao = document.getElementById("botao-adicionar");
const lista = document.getElementById("lista-tarefas");
const contador = document.getElementById("contador-tarefas");

let tarefas = [];

botao.addEventListener("click", function () {

    if (campo.value.trim() === "") {
        alert("Digite uma tarefa!");
        return;
    }

    const agora = new Date();
    
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const horaCriacao = `${horas}:${minutos}`;

    let agendamentoFormatado = "";
    let dataObjetoAgendada = null;

    if (campoAgendamento.value) {
        dataObjetoAgendada = new Date(campoAgendamento.value);
        
        const dia = String(dataObjetoAgendada.getDate()).padStart(2, '0');
        const mes = String(dataObjetoAgendada.getMonth() + 1).padStart(2, '0');
        const ano = dataObjetoAgendada.getFullYear();
        const horaAg = String(dataObjetoAgendada.getHours()).padStart(2, '0');
        const minAg = String(dataObjetoAgendada.getMinutes()).padStart(2, '0');

        agendamentoFormatado = `${dia}/${mes}/${ano} às ${horaAg}:${minAg}`;
    }

    const novaTarefa = {
        texto: campo.value,
        horaCriacao: horaCriacao,
        agendamentoTexto: agendamentoFormatado,
        dataAgendada: dataObjetoAgendada ? dataObjetoAgendada.getTime() : null,
        concluida: false,
        notificada: false
    };

    tarefas.push(novaTarefa);

    campo.value = "";
    campoAgendamento.value = "";

    mostrarTarefas();
});

function mostrarTarefas() {

    lista.innerHTML = "";

    tarefas.forEach(function (tarefa, index) {

        let item = document.createElement("li");
        if (tarefa.concluida) {
            item.classList.add("concluida");
        }

        let agendamentoHTML = tarefa.agendamentoTexto 
            ? `<div class="agendamento-tarefa"><i class="fa-regular fa-clock"></i> Agendado: ${tarefa.agendamentoTexto}</div>` 
            : '';

        item.innerHTML = `
            <div class="conteudo-tarefa">
                <span class="texto-tarefa">${tarefa.texto}</span>
                ${agendamentoHTML}
            </div>

            <div class="acoes-tarefa">
                <span class="hora-criacao">${tarefa.horaCriacao}</span>

                <button onclick="concluir(${index})" title="Concluir">
                    <i class="fa-solid fa-circle-check"></i>
                </button>

                <button onclick="excluir(${index})" class="botao-acao excluir" title="Excluir">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        lista.appendChild(item);
    });

    contador.textContent = tarefas.length + 
        (tarefas.length == 1 ? " tarefa na lista" : " tarefas na lista");
}

function concluir(index) {
    tarefas[index].concluida = !tarefas[index].concluida;
    mostrarTarefas();
}

function excluir(index) {
    tarefas.splice(index, 1);
    mostrarTarefas();
}

setInterval(function() {
    const agoraTempo = new Date().getTime();

    tarefas.forEach(function(tarefa) {
        if (tarefa.dataAgendada && !tarefa.notificada && agoraTempo >= tarefa.dataAgendada) {
            tarefa.notificada = true;
            alert(`⏰ Lembrete de Tarefa Programada: "${tarefa.texto}"`);
        }
    });
}, 10000); 

const botaoTema = document.getElementById("botao-alternar-tema");

botaoTema.addEventListener("click", function() {

    document.body.classList.toggle("tema-escuro");

    if (document.body.classList.contains("tema-escuro")) {
        botaoTema.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        botaoTema.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

});