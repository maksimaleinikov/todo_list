const SORT_STATE = {
  UP: "up",
  DOWN: "down",
};
let sortState = SORT_STATE.UP;
localStorage.setItem("positioncount", 1);
const dom = {
  new: document.getElementById("new"),
  add: document.getElementById("add"),
  tasks: document.getElementById("tasks"),
  count: document.getElementById("count"),
  pos: document.querySelector(".pos"),
  status: document.querySelector(".status"),
  data: document.querySelector(".data"),
  description: document.querySelector(".descripton"),
};
//массив задач
const tasks = [];
//отслеживаем клик по кнопке добавить задачу
dom.add.onclick = () => {
  const newTaskText = dom.new.value;
  if (newTaskText && isNotHaveTask(newTaskText, tasks)) {
    addTask(newTaskText, tasks);
    dom.new.value = "";
    render(tasks);
  }
};
//функция добавления задачек
function addTask(text, list) {
  let positionNum = Number(localStorage.getItem("positioncount"));
  const task = {
    date: Date.now(),
    //timestamp: timestamp,
    position: positionNum,
    text: text,
    isComplete: false,
  };

  list.push(task);
  localStorage.setItem("positioncount", positionNum + 1);
}
//проверка существования задачи в задачах
function isNotHaveTask(text, list) {
  let isNotHave = true;
  list.forEach((task) => {
    if (task.text === text) {
      alert("уже существует");
      isNotHave = false;
    }
  });
  return isNotHave;
}
//функция-отрисовки общая
function render(list) {
  tasksRender(list);
  renderTasksCount(list);
}
//функция вывода списка задач
function tasksRender(list) {
  let htmllist = "";
  list.forEach((task) => {
    const cls = task.isComplete ? "todo_task todo_task_completed" : "todo_task";
    const checked = task.isComplete ? "checked" : "";
    const taskHtml = `
    <div id ="${task.position}" class="${cls}">
    <div class='todo_position'>${task.position}</div>
          <label class="todo_checkbox">
            <input type="checkbox" ${checked}/>
            <div class ='todo_checkbox-div'></div>
          </label>
          <div class ='todo_data'>${
            new Date(task.date).getDate() +
            "." +
            (new Date(task.date).getMonth() + 1) +
            "." +
            new Date(task.date).getFullYear()
          }</div>
          <div class="todo_task-text">${task.text}</div>
          <div class="todo_task-del">-</div>
    </div>`;
    htmllist = htmllist + taskHtml;
  });
  dom.tasks.innerHTML = htmllist;
}

//отслеживаем клик по чекбоксу задачи
dom.tasks.onclick = (event) => {
  const target = event.target;
  const isCheckboxEl = target.classList.contains("todo_checkbox-div");
  const isDeleteEl = target.classList.contains("todo_task-del");
  if (isCheckboxEl) {
    const task = target.parentElement.parentElement;
    const taskId = Number(task.getAttribute("id"));
    changeTaskStatus(taskId, tasks);
    render(tasks);
  }
  if (isDeleteEl) {
    const task = target.parentElement;
    const taskId = Number(task.getAttribute("id"));
    deleteTask(taskId, tasks);
    render(tasks);
  }
};
dom.pos.onclick = () => {
  sortByPosition(tasks);
};
dom.data.onclick = () => {
  sortByData(tasks);
};
//функция изменения статуса задачи

function changeTaskStatus(id, list) {
  list.forEach((task) => {
    if (task.position === id) {
      task.isComplete = !task.isComplete;
    }
  });
}

//функция удаления задачи
function deleteTask(id, list) {
  list.forEach((task, idx) => {
    if (task.position === id) {
      list.splice(idx, 1);
    }
  });
}

//вывод кол-ва задач
function renderTasksCount(list) {
  dom.count.innerHTML = list.length;
}

//сортировка задач по порядковому номеру
function sortByPosition(tasks) {
  if (tasks.length <= 1) return; //защита от бесполезного вызова
  const newTasks = [...tasks];
  newTasks.sort(function (a, b) {
    return sortState === SORT_STATE.UP
      ? a.position - b.position
      : b.position - a.position;
  });
  tasksRender(newTasks);
  sortState === SORT_STATE.UP
    ? (sortState = SORT_STATE.DOWN)
    : (sortState = SORT_STATE.UP);
}
//сортировка задач по дате
function sortByData(tasks) {
  //if (tasks.length <= 1) return;
  const newTasks = [...tasks];
  newTasks.sort(function (a, b) {
    return sortState === SORT_STATE.UP ? a.date - b.date : b.date - a.date;
  });
  tasksRender(newTasks);
  sortState === SORT_STATE.UP
    ? (sortState = SORT_STATE.DOWN)
    : (sortState = SORT_STATE.UP);
}
