document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
    updateProgress();
}

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    renderTask(task);
    saveTask(task);
    taskInput.value = '';
    updateProgress();
}

function renderTask(task) {
    const taskList = document.getElementById('task-list');

    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    if (task.completed) {
        li.classList.add('completed');
    }

    const taskText = document.createElement('span');
    taskText.classList.add('task-text');
    taskText.textContent = task.text;
    taskText.contentEditable = false;

    const completeBtn = document.createElement('span');
    completeBtn.classList.add('complete');
    completeBtn.textContent = 'Concluir'; // Alterar nome do botão para "Concluir"
    completeBtn.onclick = () => toggleComplete(task.id);

    const editBtn = document.createElement('span');
    editBtn.classList.add('edit');
    editBtn.textContent = 'Editar'; // Alterar nome do botão para "Editar"
    editBtn.onclick = () => editTask(task.id);

    const deleteBtn = document.createElement('span');
    deleteBtn.classList.add('delete');
    deleteBtn.textContent = 'Excluir'; // Alterar nome do botão para "Excluir"
    deleteBtn.onclick = () => deleteTask(task.id);

    li.appendChild(taskText);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const li = document.querySelector(`[data-id="${id}"]`);
    const taskText = li.querySelector('.task-text');

    if (taskText.isContentEditable) {
        taskText.contentEditable = false;
        task.text = taskText.textContent;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
        taskText.contentEditable = true;
        taskText.focus();
    }
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskList = document.getElementById('task-list');
    const taskToRemove = taskList.querySelector(`[data-id="${id}"]`);
    taskList.removeChild(taskToRemove);

    updateProgress();
}

function toggleComplete(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const li = document.querySelector(`[data-id="${id}"]`);
    li.classList.toggle('completed');

    updateProgress();
}

function updateProgress() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const percentageDiv = document.getElementById('task-percentage');
    percentageDiv.textContent = `Progresso: ${percentage}%`; // Alterar o texto aqui

    const progressBar = document.getElementById('task-progress-bar');
    progressBar.style.width = `${percentage}%`;
}