"use strict";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addTaskButton").addEventListener("click", addTask);
  renderTasks();
});

// Tilføjer en ny opgave
function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskDate = document.getElementById("taskDate");

  let taskText = taskInput.value.trim();
  let date = taskDate.value;

  if (!taskText || !date) return; // Hvis noget mangler, sker der ingenting

  let newTask = {
    id: crypto.randomUUID(),
    text: taskText,
    date: date,
    done: false,
    priority: false,
  };

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  taskDate.value = "";
  renderTasks();
}

// Sletter en opgave
function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Markerer en opgave som færdig eller ufærdig
function toggleTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let task = tasks.find((task) => task.id === id);

  if (task) {
    task.done = !task.done;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
}

// Prioriterer en opgave (flytter den op i listen)
function togglePriority(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let task = tasks.find((task) => task.id === id);

  if (task) {
    task.priority = !task.priority;
  }

  tasks.sort((a, b) => b.priority - a.priority); // Flyt vigtigste opgaver op
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Viser opgaver i listen
function renderTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let todoList = document.getElementById("todoList");
  let doneList = document.getElementById("doneList");

  todoList.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach((task) => {
    let listItem = document.createElement("li");

    let taskContent = document.createElement("div");
    taskContent.classList.add("task-content");

    let starButton = document.createElement("button");
    starButton.textContent = task.priority ? "\u2B50" : "\u2606"; // ★ eller ☆
    starButton.classList.add("star-button");
    starButton.addEventListener("click", () => togglePriority(task.id));

    let taskText = document.createElement("span");
    taskText.textContent = `${task.text} (Deadline: ${task.date})`;
    taskText.classList.add("task-text");

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("task-buttons");

    let toggleButton = document.createElement("button");
    toggleButton.textContent = task.done ? "Fortryd" : "Færdig";
    toggleButton.addEventListener("click", () => toggleTask(task.id));

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Slet";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    buttonContainer.append(toggleButton, deleteButton);
    taskContent.append(starButton, taskText);
    listItem.append(taskContent, buttonContainer);

    if (task.done) {
      doneList.appendChild(listItem);
    } else {
      todoList.appendChild(listItem);
    }
  });
}
