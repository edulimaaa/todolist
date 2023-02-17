// Seleção dos elementos HTML

const toDoForm = document.querySelector("#todo-form");
// o form que envolve todos os elementos do "adicionar uma tarefa".

const toDoInput = document.querySelector("#todo-input");
// o input com placeholder "O que você vai fazer?".

const searchInput = document.querySelector("#search-input");
// o input com placeholder "Buscar".

const eraseButton = document.querySelector("#erase-button");
// o button do input com placeholder "Buscar".

const toDoList = document.querySelector("#todo-list");
// a div que envolve todas as tarefas (ToDo).

const editForm = document.querySelector("#edit-form");
// o form que envolve todos os elementos do "edite sua tarefa".

const editInput = document.querySelector("#edit-input");
// o input do "edite sua tarefa"

const cancelEditBtn = document.querySelector("#cancel-edit-btn");
// button "cancelar" do "edite sua tarefa"

let valueIndex; // variavél p/ armazenar os valores dos indices de cada elemento clicado.

let dataBase = [];

const getDataBase = () => JSON.parse(localStorage.getItem("toDoList")) ?? [];

const setDataBase = (dataBase) =>
  localStorage.setItem("toDoList", JSON.stringify(dataBase));

// Funções
const createTask = (text, status, index) => {
  const task = document.createElement("div"); //criando a "div"
  task.classList.add("todo", `${status}`); // adicionando a class "todo"

  task.innerHTML = `
  <h3 data-index=${index}>${text}</h3>
  <button data-index=${index} class="finish-todo">
    <i class="fa-solid fa-check"></i>
  </button>
  <button data-index=${index} class="edit-todo">
    <i class="fa-solid fa-pen"></i>
  </button>
  <button data-index=${index} class="remove-todo">
    <i class="fa-solid fa-xmark"></i>
  </button>`;

  toDoList.appendChild(task); // adicionando todos os elementos criandos na "div" das tarefas
};

const clearTasks = () => {
  while (toDoList.firstChild) {
    toDoList.removeChild(toDoList.lastChild);
  }
};

const refreshScreen = () => {
  clearTasks();
  const dataBase = getDataBase();
  dataBase.forEach((item, index) => createTask(item.text, item.status, index));
};

refreshScreen();

// esconder ou mostra forms
const toggleForms = () => {
  editForm.classList.toggle("hide"); // Mostra
  toDoForm.classList.toggle("hide"); // Oculta
  toDoList.classList.toggle("hide"); // Oculta
};

// Função - Adicionar as tarefas ao clicar no button (+)
toDoForm.addEventListener("submit", (event) => {
  event.preventDefault(); // não enviar ao back-end
  const valueInput = toDoInput.value; // pegando o valor digitado

  if (valueInput) {
    const dataBase = getDataBase();
    dataBase.push({ text: valueInput, status: "todo" });
    setDataBase(dataBase);

    refreshScreen();
    toDoInput.value = ""; // apois adiciona uma tarefa "limpa" o input
    toDoInput.focus(); // apois adiciona uma tarefa continuar com o input selecionado para escrever
  }
});
// -----------------------------------------------------

// Remove o item pelo index indicado
removeItem = (index) => {
  const dataBase = getDataBase();
  dataBase.splice(index, 1);
  setDataBase(dataBase);
};
//-----------------------------------

// Atualizar item com base no index indicado
const updateTodo = (text) => {
  const dataBase = getDataBase();
  if (valueIndex) {
    dataBase[valueIndex].text = text;
    setDataBase(dataBase);

    refreshScreen();
    editInput.value = "";
  }
};
//-------------------------------------------

eraseButton.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.focus();
  Array.from(toDoList.children).forEach((todo) => {
    todo.classList.remove("hide");
    todo.classList.add("todo");
  });
});

/* Funções - FIM */

// Eventos
//pegando o todos elementos de click
document.addEventListener("click", (e) => {
  const targetEl = e.target; // seleciona o elemento HTML que foi clicado
  //const parentEl = targetEl.closest("div"); // seleciona o elemento pai mas proximo que é a "div" com class "todo" que envolve as tarefas e os botões de acão.
  const index = targetEl.dataset.index; // valor do index dos elementos

  // se o targetEl (elemento HTML clicado) contem uma class "finish-todo"
  if (targetEl.classList.contains("finish-todo")) {
    const dataBase = getDataBase();
    if (dataBase[index].status === "todo") {
      const song = document.getElementById("done-song");
      dataBase[index].status = "done";
      setDataBase(dataBase);
      song.play();
    } else if (dataBase[index].status === "done") {
      dataBase[index].status = "todo";
      setDataBase(dataBase);
    }
    refreshScreen();
  }

  // se o targetEl (elemento HTML clicado) contem uma class de "remove-todo"
  if (targetEl.classList.contains("remove-todo")) {
    removeItem(index);
    refreshScreen();
  }

  // se o targetEl (elemento clicado) contem uma class de "edit-todo"
  if (targetEl.classList.contains("edit-todo")) {
    toggleForms(); // mostra form "Edite a sua tarefa"
    valueIndex = index;
  }

  if (targetEl.classList.contains("select-option")) {
    const select = document.getElementById("filter-select");
    const selectOption = select.options[select.selectedIndex];
    let optionValue = selectOption.value;
    if (optionValue === "all") {
      Array.from(toDoList.children).forEach((todo) => {
        todo.classList.remove("hide");
        todo.classList.add("todo");
      });
    }
    if (optionValue === "done") {
      Array.from(toDoList.children).forEach((todo) => {
        todo.classList.remove("hide");
        todo.classList.add("todo");
        if (!todo.classList.contains("done")) {
          todo.classList.remove("todo");
          todo.classList.add("hide");
        }
      });
    }
    if (optionValue === "todo") {
      Array.from(toDoList.children).forEach((todo) => {
        todo.classList.remove("hide");
        todo.classList.add("todo");
        if (todo.classList.contains("done")) {
          todo.classList.remove("todo");
          todo.classList.add("hide");
        }
      });
    }
  }
});

//Evento - Ao clicar no botão "Cancelar" volta a mostra as tarefas e adiciona uma nova tarefa
cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

// ao clicar no botão form "edita" enviar a tarefa editada
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value; // recebe o valor novo escrito no input edit

  if (editInputValue) {
    updateTodo(editInputValue); // se tiver valor atualizar
  }

  toggleForms(); // volta ao menu inicio
});

// Pesquisador pelo input ao digitar a palavra
searchInput.addEventListener("input", (event) => {
  const inputValue = event.target.value.trim().toLowerCase();
  Array.from(toDoList.children)
    .filter((todo) => !todo.textContent.toLowerCase().includes(inputValue))
    .forEach((todo) => {
      todo.classList.remove("todo");
      todo.classList.add("hide");
    });
  Array.from(toDoList.children)
    .filter((todo) => todo.textContent.toLowerCase().includes(inputValue))
    .forEach((todo) => {
      todo.classList.remove("hide");
      todo.classList.add("todo");
    });
});
