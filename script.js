document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var selectedDate = '';  // Global variable to store selected date
    let tasks = {};  // Store tasks by date

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        dateClick: function(info) {
            selectedDate = info.dateStr; // Save selected date
            document.getElementById('selected-date').innerText = selectedDate;
            document.getElementById('task-list').innerHTML = '';  // Clear previous tasks
            document.getElementById('task-detail').classList.add('d-none'); // Hide task details
            loadTasks(selectedDate);  // Load existing tasks
        }
    });
    calendar.render();

    document.getElementById('add-task').addEventListener('click', function() {
        let title = document.getElementById('task-title').value.trim();
        let desc = document.getElementById('task-desc').value.trim();
        let status = document.getElementById('task-status').value;

        if (!title) {
            alert('Please enter a task title.');
            return;
        }
        if (!selectedDate) {
            alert('Please select a date from the calendar.');
            return;
        }

        let task = { title, desc, status, id: Date.now() };

        if (!tasks[selectedDate]) {
            tasks[selectedDate] = [];
        }
        tasks[selectedDate].push(task);

        addTaskToList(task);
        addTaskToCalendar(selectedDate, title);

        // Clear input fields
        document.getElementById('task-title').value = '';
        document.getElementById('task-desc').value = '';
    });

    function addTaskToList(task) {
        let taskItem = document.createElement('li');
        taskItem.className = 'list-group-item task-item';
        taskItem.dataset.id = task.id;

        taskItem.innerHTML = `
            <div>
                <strong>${task.title}</strong> - ${task.status}
            </div>
            <div class="task-buttons">
                <button class="btn btn-sm btn-info view-task">View</button>
                <button class="btn btn-sm btn-warning edit-task">Edit</button>
                <button class="btn btn-sm btn-danger delete-task">Delete</button>
            </div>
        `;

        document.getElementById('task-list').appendChild(taskItem);

        taskItem.querySelector('.view-task').addEventListener('click', function() {
            viewTask(task.id);
        });

        taskItem.querySelector('.edit-task').addEventListener('click', function() {
            editTask(task.id);
        });

        taskItem.querySelector('.delete-task').addEventListener('click', function() {
            deleteTask(task.id);
        });
    }

    function addTaskToCalendar(date, title) {
        calendar.addEvent({
            title: title,
            start: date
        });
    }

    function viewTask(taskId) {
        let taskList = tasks[selectedDate];
        if (!taskList) return;

        let task = taskList.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('detail-title').innerText = task.title;
        document.getElementById('detail-desc').innerText = task.desc;
        document.getElementById('detail-status').innerText = task.status;
        document.getElementById('task-detail').classList.remove('d-none'); // Show task details
    }

    function editTask(taskId) {
        let taskList = tasks[selectedDate];
        if (!taskList) return;

        let task = taskList.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.desc;
        document.getElementById('task-status').value = task.status;

        deleteTask(taskId);
    }

    function deleteTask(taskId) {
        let taskList = tasks[selectedDate];
        if (!taskList) return;

        tasks[selectedDate] = taskList.filter(t => t.id !== taskId);
        loadTasks(selectedDate);
    }

    function loadTasks(date) {
        document.getElementById('task-list').innerHTML = '';  // Clear task list
        if (tasks[date]) {
            tasks[date].forEach(task => addTaskToList(task));
        }
    }
});
