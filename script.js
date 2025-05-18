function novaTarefa() {
    overlay.classList.add("active");
    criarTarefa.classList.add("active")
}

function fecharModal() {
    overlay.classList.remove("active");
    criarTarefa.classList.remove("active")
}

function buscarTarefas() {
    fetch("http://localhost:3000/tarefas").then(res => res.json()).then(res => {
        inserirTarefas(res)
    })
} buscarTarefas()

function inserirTarefas(listaDeTarefas) {
    if(listaDeTarefas.length > 0) {
        listaDeTarefas.map(tarefa => {
            lista.innerHTML += `
            <li>
                <h5>${tarefa.titulo}</h5>
                <p>${tarefa.descricao}</p>
                <div class="actions"><i class='bx bx-trash'></i></div>
            </li>
            `
        })
    }
}

function addTarefa() {
    event.preventDefault()
    let tarefa = {
        titulo: titulo.value,
        descricao: descricao.value
    }
    fetch("http://localhost:3000/tarefas", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(tarefa)
    })
    .then(res => res.json())
    .then (res => {
        console.log(res)
    })
    fecharModal()
}