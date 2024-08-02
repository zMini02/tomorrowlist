let responsibles = [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let taskBlocks = JSON.parse(localStorage.getItem('taskBlocks')) || [];
let currentTaskBlock = taskBlocks.length > 0 ? taskBlocks[taskBlocks.length - 1].id : 0;

function showAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'flex';
    populateResponsiblesDropdown();
}

function closeAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'none';
}

function showAddResponsibleModal() {
    document.getElementById('addResponsibleModal').style.display = 'flex';
}

function closeAddResponsibleModal() {
    document.getElementById('addResponsibleModal').style.display = 'none';
}

function showUpdateStatusModal(taskId) {
    document.getElementById('updateStatusModal').style.display = 'flex';
    document.getElementById('updateStatus').setAttribute('data-task-id', taskId);
}

function closeUpdateStatusModal() {
    document.getElementById('updateStatusModal').style.display = 'none';
}

document.getElementById('addTaskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const responsible = document.getElementById('taskResponsible').value;
    const status = document.getElementById('taskStatus').value;
    addTask(title, description, responsible, status);
    closeAddTaskModal();
});

document.getElementById('addResponsibleForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('responsibleName').value;
    addResponsible(name);
    closeAddResponsibleModal();
});

function addTask(title, description, responsible, status) {
    const task = {
        id: tasks.length,
        title,
        description,
        responsible,
        status,
        block: currentTaskBlock
    };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function addResponsible(name) {
    responsibles.push(name);
    localStorage.setItem('responsibles', JSON.stringify(responsibles));
}

function populateResponsiblesDropdown() {
    const dropdown = document.getElementById('taskResponsible');
    dropdown.innerHTML = '';
    responsibles.forEach(responsible => {
        const option = document.createElement('option');
        option.value = responsible;
        option.textContent = responsible;
        dropdown.appendChild(option);
    });
}

function updateTaskStatus() {
    const taskId = document.getElementById('updateStatus').getAttribute('data-task-id');
    const newStatus = document.getElementById('updateStatus').value;
    tasks[taskId].status = newStatus;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    closeUpdateStatusModal();
}

function createNewTaskBlock() {
    const date = prompt("Digite a data para o novo bloco (ex: 2024-08-02)");
    if (date) {
        currentTaskBlock++;
        taskBlocks.push({ id: currentTaskBlock, date });
        localStorage.setItem('taskBlocks', JSON.stringify(taskBlocks));
        renderTaskBlocks();
    }
}

function renderTaskBlocks() {
    const taskBlocksContainer = document.getElementById('task-blocks');
    taskBlocksContainer.innerHTML = '';
    taskBlocks.forEach(block => {
        if (block.date) {
            const dateElement = document.createElement('div');
            dateElement.className = 'date-divider';
            dateElement.innerHTML = `<h3>Data: ${block.date}</h3>`;
            taskBlocksContainer.appendChild(dateElement);
        }

        const taskBoard = document.createElement('div');
        taskBoard.className = 'task-board';
        taskBoard.id = `task-board-${block.id}`;

        const notStartedColumn = document.createElement('div');
        notStartedColumn.className = 'task-column';
        notStartedColumn.id = `not-started-${block.id}`;
        notStartedColumn.innerHTML = '<h2>Não Iniciadas</h2><div class="task-list"></div>';

        const inProgressColumn = document.createElement('div');
        inProgressColumn.className = 'task-column';
        inProgressColumn.id = `in-progress-${block.id}`;
        inProgressColumn.innerHTML = '<h2>Em Andamento</h2><div class="task-list"></div>';

        const doneColumn = document.createElement('div');
        doneColumn.className = 'task-column';
        doneColumn.id = `done-${block.id}`;
        doneColumn.innerHTML = '<h2>Concluídas</h2><div class="task-list"></div>';

        taskBoard.appendChild(notStartedColumn);
        taskBoard.appendChild(inProgressColumn);
        taskBoard.appendChild(doneColumn);

        taskBlocksContainer.appendChild(taskBoard);
    });
    renderTasks();
}

function renderTasks() {
    document.querySelectorAll('.task-list').forEach(taskList => {
        taskList.innerHTML = '';
    });

    tasks.forEach(task => {
        const taskList = document.querySelector(`#${task.status}-${task.block} .task-list`);
        if (taskList) {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerHTML = `
                <h3>${task.title}</h3>
                <p><strong>Descrição:</strong> ${task.description}</p>
                <p><strong>Responsável:</strong> ${task.responsible}</p>
                <button onclick="showUpdateStatusModal(${task.id})">Atualizar Status</button>
            `;
            taskList.appendChild(taskElement);
        }
    });
}

function filterTasks(status) {
    document.querySelectorAll('.task-list').forEach(taskList => {
        const tasks = taskList.querySelectorAll('.task');
        tasks.forEach(task => {
            const taskStatus = task.querySelector('p').textContent.split(':')[1].trim();
            if (status === 'all' || taskStatus === status) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
    });
}

function resetAllData() {
    localStorage.removeItem('tasks');
    localStorage.removeItem('responsibles');
    localStorage.removeItem('taskBlocks');
    tasks = [];
    responsibles = [];
    taskBlocks = [];
    currentTaskBlock = 0;
    renderTaskBlocks();
    renderTasks();
}

window.onload = function() {
    responsibles = JSON.parse(localStorage.getItem('responsibles')) || [];
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskBlocks = JSON.parse(localStorage.getItem('taskBlocks')) || [];
    currentTaskBlock = taskBlocks.length > 0 ? taskBlocks[taskBlocks.length - 1].id : 0;
    renderTaskBlocks();
    renderTasks();
};
