// script.js - versão PWA com IndexedDB

let db;
const request = indexedDB.open("tarefasDB", 1);

request.onerror = (event) => {
    console.error("Erro ao abrir o IndexedDB", event);
};

request.onsuccess = (event) => {
    db = event.target.result;
    buscarTarefas();
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore("tarefas", { keyPath: "id", autoIncrement: true });
};

function novaTarefa() {
    overlay.classList.add("active");
    criarTarefa.classList.add("active");
}

function fecharModal() {
    overlay.classList.remove("active");
    criarTarefa.classList.remove("active");
}

function addTarefa(event) {
    event.preventDefault();
    const tituloValor = titulo.value.trim();
    const descricaoValor = descricao.value.trim();

    if (!tituloValor) return;

    const tarefa = { titulo: tituloValor, descricao: descricaoValor };
    const tx = db.transaction("tarefas", "readwrite");
    const store = tx.objectStore("tarefas");
    store.add(tarefa);

    tx.oncomplete = () => {
        fecharModal();
        buscarTarefas();
        document.querySelector("#criarTarefa form").reset();
    };
}

function buscarTarefas() {
    const tx = db.transaction("tarefas", "readonly");
    const store = tx.objectStore("tarefas");
    const req = store.getAll();

    req.onsuccess = () => {
        inserirTarefas(req.result);
    };
}

function inserirTarefas(listaDeTarefas) {
    lista.innerHTML = "";
    listaDeTarefas.forEach(tarefa => {
        lista.innerHTML += `
            <li>
                <h5>${tarefa.titulo}</h5>
                <p>${tarefa.descricao}</p>
                <div class="actions"><i class='bx bx-trash' onclick="deletarTarefa(${tarefa.id})"></i></div>
            </li>
        `;
    });
}

function deletarTarefa(id) {
    const tx = db.transaction("tarefas", "readwrite");
    const store = tx.objectStore("tarefas");
    store.delete(id);

    tx.oncomplete = () => {
        buscarTarefas();
    };
}

function pesquisarTarefa() {
    const termo = busca.value.toLowerCase();
    const lis = document.querySelectorAll("ul li");

    lis.forEach(li => {
        const titulo = li.querySelector("h5").innerText.toLowerCase();
        const descricao = li.querySelector("p").innerText.toLowerCase();
        const visivel = titulo.includes(termo) || descricao.includes(termo);

        li.classList.toggle("oculto", !visivel);
    });
}