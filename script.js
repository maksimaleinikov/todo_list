const dom = {
  new: document.getElementById("new"),
  add: document.getElementById("add"),
  tasks: document.getElementById("tasks"),
};

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
  const timestamp = Date.now();
  const task = {
    id: timestamp,
    text: text, //можно просто text когда совпадают названия поле/значение
    isComplete: false,
  };
  list.push(task);
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
    const taskHtml = `
    <div id = "${task.id}'class="${cls}">
          <label class="todo_checkbox">
            <input type="checkbox" checked = "${task.isComplete}"/>
            <div></div>
          </label>
          <div class="todo_task-text">${task.text}</div>
          <div class="todo_task-del">-</div>
    </div>`;
    htmllist = htmllist + taskHtml;
  });
  dom.tasks.innerHTML = htmllist;
}
