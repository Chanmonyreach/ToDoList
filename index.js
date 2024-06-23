window.addEventListener('load', () => {
    const form = document.querySelector('#new-task-form');
    const input = document.querySelector('#new-task-input');
    const list_el = document.querySelector('#tasks');

    // Function to retrieve tasks from local storage
    const getTasksFromStorage = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        return tasks;
    };

    // Function to save tasks to local storage
    const saveTasksToStorage = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to render tasks from local storage
    const renderTasks = () => {
        list_el.innerHTML = ''; // Clear existing list

        const tasks = getTasksFromStorage();
        tasks.forEach(task => {
            const task_el = createTaskElement(task);
            list_el.appendChild(task_el);
        });
    };

    // Function to create a task element
    const createTaskElement = (taskText) => {
        const task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = taskText;
        task_input_el.setAttribute("readonly", "readonly");

        task_content_el.appendChild(task_input_el);

        const task_action_el = document.createElement("div");
        task_action_el.classList.add("actions");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Edit";

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerHTML = "Delete";

        task_action_el.appendChild(task_edit_el);
        task_action_el.appendChild(task_delete_el);

        task_el.appendChild(task_content_el);
        task_el.appendChild(task_action_el);

        // Add event listeners for edit and delete
        task_edit_el.addEventListener('click', () => {
            editTask(task_el, task_input_el, task_edit_el);
        });

        task_delete_el.addEventListener('click', () => {
            deleteTask(task_el);
        });

        return task_el;
    };

    // Function to handle task editing
    const editTask = (task_el, task_input_el, task_edit_el) => {
        if (task_edit_el.innerText.toLowerCase() === "edit") {
            task_input_el.removeAttribute("readonly");
            task_input_el.focus();
            task_edit_el.innerText = "Save";
        } else {
            task_input_el.setAttribute("readonly", "readonly");
            task_edit_el.innerText = "Edit";
            updateTaskInStorage(task_el, task_input_el.value);
        }
    };

    // Function to update task in local storage
    const updateTaskInStorage = (task_el, updatedTaskText) => {
        const tasks = getTasksFromStorage();
        const index = Array.from(list_el.children).indexOf(task_el);
        tasks[index] = updatedTaskText;
        saveTasksToStorage(tasks);
    };

    // Function to handle task deletion
    const deleteTask = (task_el) => {
        list_el.removeChild(task_el);
        updateTasksInStorageAfterDelete(task_el);
    };

    // Function to update tasks in local storage after deletion
    const updateTasksInStorageAfterDelete = (task_el) => {
        const tasks = getTasksFromStorage();
        const index = Array.from(list_el.children).indexOf(task_el);
        tasks.splice(index, 1);
        saveTasksToStorage(tasks);
    };

    // Event listener for form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = input.value.trim();

        if (task === '') {
            alert("Please fill out the task");
            return;
        }

        const task_el = createTaskElement(task);
        list_el.appendChild(task_el);

        // Save task to local storage
        const tasks = getTasksFromStorage();
        tasks.push(task);
        saveTasksToStorage(tasks);

        input.value = ''; // Clear input after adding task
    });

    // Initial render of tasks from local storage on page load
    renderTasks();
});
