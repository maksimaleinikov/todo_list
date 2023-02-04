localStorage.setItem("positioncount", 1);
const dom = {
  new: document.getElementById("new"),
  add: document.getElementById("add"),
  tasks: document.getElementById("tasks"),
  count: document.getElementById("count"),
};
//массив задач
const tasks = [];
//отслеживаем клик по кнопке добавить задачу
dom.add.onclick = () => {
  const newTaskText = dom.new.value;
  if (newTaskText && isNotHaveTask(newTaskText, tasks)) {
    addTask(newTaskText, tasks);
    dom.new.value = "";
    tasksRender(tasks);
  }
};
//функция добавления задачек
function addTask(text, list) {
  const data = new Date();
  function addZero(num) {
    if (num >= 0 && num <= 9) {
      return "0" + num;
    } else {
      return num;
    }
  }
  const timestamp =
    addZero(data.getDate()) +
    "." +
    addZero(data.getMonth() + 1) +
    "." +
    addZero(data.getFullYear());
  let positionNum = Number(localStorage.getItem("positioncount"));
  const task = {
    timestamp: timestamp,
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
          <div class ='todo_data'>${task.timestamp}</div>
          <div class="todo_task-text">${task.text}</div>
          <div class="todo_task-del">-</div>
    </div>`;
    htmllist = htmllist + taskHtml;
  });
  dom.tasks.innerHTML = htmllist;

  renderTasksCount(list);
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
    tasksRender(tasks);
  }
  if (isDeleteEl) {
    const task = target.parentElement;
    const taskId = Number(task.getAttribute("id"));
    deleteTask(taskId, tasks);
    tasksRender(tasks);
  }
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
