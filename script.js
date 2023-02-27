const SORT_STATE = {
  UP: "up",
  DOWN: "down",
};

const DAY_IN_MS = 86400000;
const LOCAL_STORAGE_KEYS = {
  SAVED_TASKS: "savedTasks",
  FILTERED_TEXT: "filteredText",
  TOTAL_TASKS_CREATED: "totalTasksCreated",
  START_DATE: "startDate",
  END_DATE: "endDate",
};

let TASKS_IN_LS = 1;
let sortState = SORT_STATE.UP;
const dom = {
  new: document.getElementById("new"),
  add: document.getElementById("add"),
  tasks: document.getElementById("tasks"),
  count: document.getElementById("count"),
  pos: document.querySelector(".pos"),
  status: document.querySelector(".status"),
  data: document.querySelector(".data"),
  description: document.querySelector(".description"),
  start_date: document.querySelector("#start_date"),
  end_date: document.querySelector("#end_date"),
  filter_text: document.querySelector("#filter_text"),
  filter_button: document.querySelector("#filter_button"),
  refresh_button: document.querySelector("#refresh_button"),
};
//массив задач
const tasks = [];

(function startTasks() {
  //localStorage.clear();
  if (localStorage.length !== 0) {
    let temp = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SAVED_TASKS));
    TASKS_IN_LS =
      Number(localStorage.getItem(LOCAL_STORAGE_KEYS.TOTAL_TASKS_CREATED)) + 1;
    if (localStorage.getItem("startDate") !== null) {
      let startTimestamp = new Date(Number(localStorage.getItem("startDate")));
      let endTimestamp = new Date(Number(localStorage.getItem("endDate")));
      dom.start_date.value = formatDate(startTimestamp);
      dom.end_date.value = formatDate(endTimestamp);
    }
    tasks.push(...temp);
    tasksRender(tasks);
  }
})();

//функция для форматирования даты
function formatDate(date) {
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();

  let dateInFormat =
    year +
    "-" +
    (Number(month + 1) > 10 ? Number(month + 1) : "0" + Number(month + 1)) +
    "-" +
    (Number(day) < 10 ? "0" + Number(day) : Number(day));

  return dateInFormat;
}

//отслеживаем клик по кнопке добавить задачу
dom.add.onclick = () => {
  const newTaskText = dom.new.value;
  if (newTaskText && isNotHaveTask(newTaskText, tasks)) {
    addTask(newTaskText, tasks, TASKS_IN_LS);
    dom.new.value = "";
    saveInStorage(tasks, TASKS_IN_LS);
    render(tasks);
    TASKS_IN_LS++;
  }
};
//функция добавления задачек
function addTask(text, list, listID) {
  const task = {
    date: Date.now(),
    id: listID,
    text: text,
    isComplete: false,
  };
  list.push(task);
}
//функция удаления задачи
function deleteTask(id, list) {
  list.forEach((task, idx) => {
    if (task.id === id) {
      list.splice(idx, 1);
    }
  });
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
    <div id ="${task.id}" class="${cls}">
    <div class='todo_position'>${task.id}</div>
          <label class="todo_checkbox">
            <input type="checkbox" ${checked}/>
            <div class ='todo_checkbox-div'></div>
          </label>
          <div class ='todo_data'>${
            new Date(task.date).getDate() +
            "." +
            (new Date(task.date).getMonth() + 1 > 10
              ? new Date(task.date).getMonth() + 1
              : "0" + (new Date(task.date).getMonth() + 1)) +
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
//сортировка по клику на #
dom.pos.onclick = () => {
  sortByPosition(tasks);
};
//сортировка по клику на дату
dom.data.onclick = () => {
  sortByData(tasks);
};

//функция изменения статуса задачи

function changeTaskStatus(id, list) {
  list.forEach((task) => {
    if (task.id === id) {
      task.isComplete = !task.isComplete;
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
    return sortState === SORT_STATE.UP ? a.id - b.id : b.id - a.id;
  });
  tasksRender(newTasks);
  sortState === SORT_STATE.UP
    ? (sortState = SORT_STATE.DOWN)
    : (sortState = SORT_STATE.UP);
}
//сортировка задач по дате
function sortByData(tasks) {
  if (tasks.length <= 1) return;
  const newTasks = [...tasks];
  newTasks.sort(function (a, b) {
    return sortState === SORT_STATE.UP ? a.date - b.date : b.date - a.date;
  });
  tasksRender(newTasks);
  sortState === SORT_STATE.UP
    ? (sortState = SORT_STATE.DOWN)
    : (sortState = SORT_STATE.UP);
}
//функция фильтрации
dom.filter_button.onclick = () => {
  const filterText = dom.filter_text.value;
  let newTasks = [...tasks];
  let startDate = Date.parse(dom.start_date.value);
  let endDate = Date.parse(dom.end_date.value) + DAY_IN_MS;

  if (tasks.length <= 1) {
    return tasksRender(newTasks);
  }
  if (filterText !== "") {
    newTasks = checkText(newTasks, filterText);
  }

  if (!isNaN(startDate) || !isNaN(endDate)) {
    newTasks = dateFilter(newTasks, { startDate, endDate });
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.START_DATE, startDate);
  localStorage.setItem(LOCAL_STORAGE_KEYS.END_DATE, endDate);

  tasksRender(newTasks);
};
//фильтрация по тексту задач
function checkText(tasks, text) {
  return tasks.filter((task) => task.text.includes(text));
}
//фильтрация по датам
function dateFilter(tasks, { startDate, endDate }) {
  if (!isNaN(startDate) && isNaN(endDate))
    return tasks.filter((task) => task.date > startDate);

  if (!isNaN(endDate) && isNaN(startDate))
    return tasks.filter((task) => task.date < endDate);

  return tasks.filter((task) => task.date > startDate && task.date < endDate);
}
//сохранение в LocalStorage
function saveInStorage(tasks, taskID, startDate) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.SAVED_TASKS, JSON.stringify(tasks));
  localStorage.setItem(LOCAL_STORAGE_KEYS.TOTAL_TASKS_CREATED, taskID);
}
function saveFilteredText() {
  localStorage.setItem(LOCAL_STORAGE_KEYS.FILTERED_TEXT, dom.filter_text.value);
}
dom.filter_text.addEventListener("change", saveFilteredText);
dom.refresh_button.addEventListener("click", refreshFilters);

function refreshFilters() {
  //localStorage.clear();
  dom.start_date.value = "";
  dom.end_date.value = "";
  dom.filter_text.value = "";
  tasksRender(tasks);
}
