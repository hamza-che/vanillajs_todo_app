class UI {
  constructor() {
    this.form = document.querySelector("form");
    this.input = document.querySelector(".input");
    this.addButton = document.querySelector(".add");
    this.tasksContainer = document.querySelector(".tasks");
    this.tasks = [];
  }
  // Submit task form
  submitTaskForm() {
    const inputValue = this.input.value;
    if (inputValue !== "") {
      const tasksItem = {
        task: inputValue,
        id: Date.now(),
        completed: false,
      };
      this.tasks.push(tasksItem);
      this.input.value = "";
      this.addTask();
    }
    this.addDataToLocalStorage();
  }
  // Add task to tasks div
  addTask() {
    this.tasksContainer.innerHTML = "";
    this.tasks.forEach(task => {
      const div = document.createElement("div");
      div.classList.add("task");
      if (task.completed) {
        div.classList.add("done");
      }
      div.innerHTML = `
        <p>${task.task}</p>
        <div>
          <i class="fas fa-check"></i>
          <button class="delete" data-id=${task.id}>Delete</button>
        </div>
      `;
      this.tasksContainer.appendChild(div);
    });
  }
  // Completed Task functionality
  taskCompleted(element) {
    let parent = element.parentElement.parentElement;
    let id = parent.querySelector(".delete").dataset.id;

    this.updateCompletedTasks(id);
  }
  // Update Completed Tasks
  updateCompletedTasks(id) {
    let task = this.tasks.find(task => task.id === +id);
    task.completed = true;
    this.addDataToLocalStorage();
  }
  // Add Data to local storage
  addDataToLocalStorage() {
    localStorage.setItem("tasksList", JSON.stringify(this.tasks));
  }
  // Get data from local storage
  getDataFromLocalStorage() {
    let data = localStorage.getItem("tasksList");
    if (data) {
      this.tasks = JSON.parse(data);
    }
  }
  removeFromLocalStorage(id) {
    this.tasks = this.tasks.filter(task => task.id + "" !== id);
    this.addTask();
    this.addDataToLocalStorage();
  }
}

function eventListeners() {
  const form = document.querySelector("form");
  const tasksContainer = document.querySelector(".tasks");

  const ui = new UI();

  ui.getDataFromLocalStorage();
  ui.addTask();

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    ui.submitTaskForm();
  });

  tasksContainer.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete")) {
      ui.removeFromLocalStorage(e.target.dataset.id);
      e.target.parentElement.remove();
    } else if (e.target.classList.contains("fa-check")) {
      ui.taskCompleted(e.target);
    }
  });
}

document.addEventListener("DOMContentLoaded", eventListeners);
