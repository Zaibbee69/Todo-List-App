// Adding the default key for my todo
const LOCAL_STORAGE_KEY = "todo_tasks";
const API_URL = "http://127.0.0.1:8000/api/tasks/";



let searchText = "";
let filterStatus = "all";
let filterPriority = "all";


async function fetchTasksFromBackend() {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error("Failed to fetch tasks from backend");

        const data = await res.json();
        saveTasksToLocalStorage(data);
        // Force re-read from fresh localStorage
        setTimeout(renderTasks, 0);

    } catch (error) {
        console.error("Error fetching tasks from backend:", error);
    }
}


async function createTaskInBackend(task) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });
    return await response.json();
}

async function updateTaskInBackend(id, task) {
    await fetch(`${API_URL}${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });
}

async function deleteTaskInBackend(id) {
    await fetch(`${API_URL}${id}/`, {
        method: "DELETE"
    });
}


function getTasksFromLocalStorage()
{
    // Getting items from storage
    const tasks = localStorage.getItem(LOCAL_STORAGE_KEY);

    // If tasks found parse them else return empty list
    return tasks ? JSON.parse(tasks) : [];
}


function saveTasksToLocalStorage(tasks)
{
    // Saving item to storage but also converting them to strings
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
}


function openEditForm(task)
{
    document.querySelector("#title").value = task.title;
    document.querySelector("#description").value = task.description;
    document.querySelector("#priority").value = task.priority;
    document.querySelector("#due-date").value = task.due_date;

    // Storing also the id of this task in our form
    document.querySelector("#task-form").dataset.editingId = task.id;
}


function getUrgencyClass(task)
{
    if (!task.due_date) return "no-due-date";

    const today = new Date();
    const due = new Date(task.due_date);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "urgent-overdue";
    if (diffDays === 0) return "urgent-today";
    if (diffDays <= 3) return "urgent-soon";
    return "urgent-later";
}


function renderTasks()
{
    // Clearing the list
    const taskList = document.querySelector("#task-list");
    taskList.innerHTML = "";

    // Getting the tasks from memory
    const tasks = getTasksFromLocalStorage();

    // Now filtering the tasks based upon our filters
    const filteredTasks = tasks.filter(task => {

        // Checking that the current task matches our search input
        const matchesSearch = task.title.toLowerCase().includes(searchText);

        // Checking that current task matches completed input
        const matchesStatus = 
        filterStatus === "all" ||
        (filterStatus === "completed" && task.is_completed) ||
        (filterStatus === "incomplete" && !task.is_completed);

        // Checking the priority of task
        const matchesPriority = 
        filterPriority === "all" || task.priority === filterPriority;

        // Return findings
        return matchesSearch && matchesStatus && matchesPriority
    });

    // Now looping through each task and putting it into element
    filteredTasks.forEach(async task => {

        const taskItem = document.createElement("li");
        const urgencyClass = getUrgencyClass(task);

        // Setting dynamic css styling based on task status
        taskItem.className = `task priority-${task.priority} ${urgencyClass} ${task.is_completed ? 'completed' : ''}`;

        // Making a checkbox for each element
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.is_completed;
        checkbox.className = "checker";

        // If checkbox is selected at anytime
        checkbox.addEventListener("change", async () => {
            task.is_completed = checkbox.checked;
            task.updated_at = new Date().toISOString();
            saveTasksToLocalStorage(tasks);
            await updateTaskInBackend(task.id, task); 
            renderTasks();
        });


        // Making the body of element
        const text = document.createElement("span");
        text.innerHTML = `<span class="task-title ${urgencyClass}">${task.title}</span> 
        <span class="task-priority"><i>(${task.priority})</i></span>
        <span class="task-date"><em>- ${task.due_date || "No due date"}</em></span> 
        <div class="task-description">
            <i class="fa-solid fa-arrow-right"></i>
            ${task.description}
        </div>`;

        // Making a delete button for each task
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", async () => {
            try {
                await deleteTaskInBackend(task.id);
                const updatedTasks = getTasksFromLocalStorage().filter(t => t.id !== task.id);
                saveTasksToLocalStorage(updatedTasks);
                renderTasks();
            } catch (err) {
                console.error("Failed to delete task from backend:", err);
                alert("Failed to delete task from server. Try again.");
            }
        });

        // Making a edit button for editing tasks
        const editBtn = document.createElement("button");
        editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
        editBtn.className = "edit-btn";
        editBtn.className = `edit-btn ${urgencyClass}`;
        editBtn.addEventListener("click", () => {
            openEditForm(task);
        });

        // Connect to our parent 
        taskItem.appendChild(editBtn);
        taskItem.appendChild(checkbox);   
        taskItem.appendChild(text);
        taskItem.appendChild(deleteBtn);   
        taskList.appendChild(taskItem);    
    });
}


// Making an event listener to add the task to memory
document.querySelector("#task-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const editingId = form.dataset.editingId;
    const tasks = getTasksFromLocalStorage();
    const now = new Date().toISOString();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const priority = document.getElementById("priority").value;
    const due_date = document.getElementById("due-date").value || null;

    if (editingId) {
        const task = tasks.find(t => t.id === Number(editingId));

        task.title = title;
        task.description = description;
        task.priority = priority;
        task.due_date = due_date;
        task.updated_at = now;

        await updateTaskInBackend(task.id, task); // 🛰 sync

        form.removeAttribute("data-editing-id");
    } else {
        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            is_completed: false,
            created_at: now,
            updated_at: now,
            priority,
            due_date
        };

        const savedTask = await createTaskInBackend(newTask); // 🛰 sync
        newTask.id = savedTask.id; // overwrite ID with backend ID

        tasks.push(newTask);
    }

    saveTasksToLocalStorage(tasks);
    form.reset();
    renderTasks();
});


// Render tasks on page load
document.addEventListener("DOMContentLoaded", () => {
    const localTasks = getTasksFromLocalStorage();
    if (!localTasks || localTasks.length === 0) {
        fetchTasksFromBackend();
    } else {
        renderTasks();
    }
});


document.getElementById("search").addEventListener("input", e => {
  searchText = e.target.value.toLowerCase();
  renderTasks();
});

document.getElementById("filter-status").addEventListener("change", e => {
  filterStatus = e.target.value;
  renderTasks();
});

document.getElementById("filter-priority").addEventListener("change", e => {
  filterPriority = e.target.value;
  renderTasks();
});
