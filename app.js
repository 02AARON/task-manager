document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('task-title');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const fetchQuoteButton = document.getElementById('fetch-quote');
    const quoteElement = document.getElementById('quote');

    const API_URL = 'http://localhost:3000/tasks';
    const QUOTE_API_URL = 'https://api.quotable.io/random';

    async function fetchTasks() {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        tasks.forEach(task => addTaskToDOM(task));
    }

    async function fetchQuote() {
        const response = await fetch(QUOTE_API_URL);
        const data = await response.json();
        quoteElement.textContent = data.content;
    }

    async function addTask(title) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        const task = await response.json();
        addTaskToDOM(task);
    }

    async function deleteTask(id) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        document.getElementById(`task-${id}`).remove();
    }

    function addTaskToDOM(task) {
        const taskItem = document.createElement('li');
        taskItem.id = `task-${task.id}`;
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <span>${task.title}</span>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(taskItem);
    }

    addTaskButton.addEventListener('click', () => {
        const title = taskTitleInput.value.trim();
        if (title) {
            addTask(title);
            taskTitleInput.value = '';
        }
    });

    fetchQuoteButton.addEventListener('click', fetchQuote);

    fetchTasks();
});

function deleteTask(id) {
    fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' })
        .then(() => document.getElementById(`task-${id}`).remove());
}
