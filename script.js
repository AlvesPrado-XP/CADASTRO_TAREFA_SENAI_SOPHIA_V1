const campo = document.getElementById("campo-tarefa");
const botao = document.getElementById("botao-adicionar");
const lista = document.getElementById("lista-tarefas");
const contador = document.getElementById("contador-tarefas");

let tarefas = [];

botao.addEventListener("click", function () {

    if (campo.value == "") {
        alert("Digite uma tarefa!");
        return;
    }

    tarefas.push(campo.value);

    campo.value = "";

    mostrarTarefas();
});

function mostrarTarefas() {

    lista.innerHTML = "";

    tarefas.forEach(function (tarefa, index) {

        let item = document.createElement("li");

        item.innerHTML = `
            <span>${tarefa}</span>

            <div>
                <button onclick="concluir(${index})">
                    <i class="fa-solid fa-circle-check"></i>
                </button>

                <button onclick="excluir(${index})">
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

    lista.children[index].classList.toggle("concluida");
}

function excluir(index) {

    tarefas.splice(index, 1);

    mostrarTarefas();
}

const botaoTema = document.getElementById("botao-alternar-tema");

botaoTema.addEventListener("click", function() {

    document.body.classList.toggle("tema-escuro");

    if (document.body.classList.contains("tema-escuro")) {
        botaoTema.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        botaoTema.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

});