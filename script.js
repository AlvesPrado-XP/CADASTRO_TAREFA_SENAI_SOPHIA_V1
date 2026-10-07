const campo = document.getElementById("campo-tarefa");
const campoAgendamento = document.getElementById("campo-agendamento");
const botao = document.getElementById("botao-adicionar");
const lista = document.getElementById("lista-tarefas");
const contador = document.getElementById("contador-tarefas");
const botaoTema = document.getElementById("botao-alternar-tema");
const botoesFiltro = document.querySelectorAll(".botao-filtro");

let tarefas = JSON.parse(localStorage.getItem("tarefas_app")) || [];
let filtroAtual = "todas";

if (localStorage.getItem("tema") === "escuro") {
    document.body.classList.add("tema-escuro");
    botaoTema.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

function salvarNoStorage() {
    localStorage.setItem("tarefas_app", JSON.stringify(tarefas));
}

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
        texto: campo.value.trim(),
        horaCriacao: horaCriacao,
        agendamentoTexto: agendamentoFormatado,
        dataAgendada: dataObjetoAgendada ? dataObjetoAgendada.getTime() : null,
        concluida: false,
        notificada: false
    };

    tarefas.push(novaTarefa);
    salvarNoStorage();

    campo.value = "";
    campoAgendamento.value = "";

    mostrarTarefas();
});

function mostrarTarefas() {
    lista.innerHTML = "";

    const tarefasFiltradas = tarefas.filter((tarefa) => {
        if (filtroAtual === "pendentes") return !tarefa.concluida;
        if (filtroAtual === "concluidas") return tarefa.concluida;
        return true; // 'todas'
    });

    tarefasFiltradas.forEach(function (tarefa) {
        const indexReal = tarefas.indexOf(tarefa);

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

                <button onclick="concluir(${indexReal})" title="${tarefa.concluida ? 'Marcar como Pendente' : 'Concluir'}">
                    <i class="fa-solid ${tarefa.concluida ? 'fa-rotate-left' : 'fa-circle-check'}"></i>
                </button>

                <button onclick="editar(${indexReal})" class="botao-acao editar" title="Editar">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button onclick="excluir(${indexReal})" class="botao-acao excluir" title="Excluir">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        lista.appendChild(item);
    });

    atualizarContador();
}

function concluir(index) {
    tarefas[index].concluida = !tarefas[index].concluida;
    salvarNoStorage();
    mostrarTarefas();
}

function editar(index) {
    const novoTexto = prompt("Edite o nome da tarefa:", tarefas[index].texto);
    if (novoTexto !== null && novoTexto.trim() !== "") {
        tarefas[index].texto = novoTexto.trim();
        salvarNoStorage();
        mostrarTarefas();
    }
}

function excluir(index) {
    tarefas.splice(index, 1);
    salvarNoStorage();
    mostrarTarefas();
}

function atualizarContador() {
    const pendentes = tarefas.filter(t => !t.concluida).length;
    const total = tarefas.length;

    contador.textContent = `${pendentes} pendente(s) de ${total} tarefa(s)`;
}

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
        botoesFiltro.forEach(b => b.classList.remove("ativo"));
        botao.classList.add("ativo");
        filtroAtual = botao.dataset.filtro;
        mostrarTarefas();
    });
});

setInterval(function() {
    const agoraTempo = new Date().getTime();

    tarefas.forEach(function(tarefa) {
        if (tarefa.dataAgendada && !tarefa.notificada && agoraTempo >= tarefa.dataAgendada) {
            tarefa.notificada = true;
            salvarNoStorage();
            alert(`⏰ Lembrete de Tarefa Programada: "${tarefa.texto}"`);
        }
    });
}, 10000); 

botaoTema.addEventListener("click", function() {
    document.body.classList.toggle("tema-escuro");

    if (document.body.classList.contains("tema-escuro")) {
        botaoTema.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem("tema", "escuro");
    } else {
        botaoTema.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem("tema", "claro");
    }
});

mostrarTarefas();