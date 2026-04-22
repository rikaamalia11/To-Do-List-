let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function setFilter(filter) {
    currentFilter = filter;
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "completed") return task.completed;
        if (currentFilter === "pending") return !task.completed;
        return true;
    });

    let today = new Date();
    today.setHours(0,0,0,0);

    filteredTasks.forEach((task, index) => {
        let li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        let deadlineClass = "";
        let deadlineText = task.deadline || "-";

        if (task.deadline) {
            let deadlineDate = new Date(task.deadline);
            deadlineDate.setHours(0,0,0,0);

            let diffTime = deadlineDate - today;
            let diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays < 0) {
                deadlineClass = "overdue"; // 🔴 lewat
                deadlineText += " (Terlambat)";
            } else if (diffDays === 1) {
                deadlineClass = "soon"; // 🟡 H-1
                deadlineText += " (Besok!)";
            }
        }

        li.innerHTML = `
            <div class="task-top">
                <span onclick="toggleTask(${index})">${task.text}</span>
                <button onclick="deleteTask(${index})">X</button>
            </div>
            <div class="deadline ${deadlineClass}">
                Deadline: ${deadlineText}
            </div>
        `;

        list.appendChild(li);
    });
}

function addTask() {
    const text = document.getElementById("taskInput").value.trim();
    const deadline = document.getElementById("deadlineInput").value;

    if (text === "") return;

    tasks.push({
        text: text,
        deadline: deadline,
        completed: false
    });

    document.getElementById("taskInput").value = "";
    document.getElementById("deadlineInput").value = "";

    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

renderTasks();