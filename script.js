document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-button");
    const menu = document.getElementById("menu");
    const noteButton = document.querySelector(".menu-item:nth-child(2)");
    const todoButton = document.querySelector(".menu-item:nth-child(1)");

    menuButton.addEventListener("click", toggleMenu);
    noteButton.addEventListener("click", createNote);
    todoButton.addEventListener("click", createTodo);

    checkAndCreateNormalCard();

    function toggleMenu() {
        menu.classList.toggle("active");
    }

    function createNote() {
        removeNormalCard();
        const noteElement = createFloatingElement("Notiz", "Neue Notiz", true);
        hideMenu();

        const noteContent = noteElement.querySelector(".card-content");
        loadNotes(noteContent);
        noteContent.addEventListener("input", () => {
            saveNotes(noteContent.innerHTML);
        });

        makeDraggable(noteElement, noteElement.querySelector(".card-header"), "note");
        makeResizable(noteElement, noteElement.querySelector(".card-resize"));
        addDeleteButton(noteElement, "note");
        loadPosition(noteElement, "note"); 
    }

    function createTodo() {
        removeNormalCard();
        const todoElement = createFloatingElement("To-Do", "<ul class='todo-list'></ul>", false);
        hideMenu();

        const todoList = todoElement.querySelector(".todo-list");
        loadTodos(todoList);
        todoList.addEventListener("input", () => {
            saveTodos(todoList);
        });

        todoList.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const newTask = document.createElement("li");
                newTask.contentEditable = "true";
                newTask.textContent = "Neue Aufgabe";
                newTask.addEventListener("input", () => saveTodos(todoList));
                todoList.appendChild(newTask);
                saveTodos(todoList);
            }
        });

        makeDraggable(todoElement, todoElement.querySelector(".card-header"), "todo");
        makeResizable(todoElement, todoElement.querySelector(".card-resize"));
        addDeleteButton(todoElement, "todo");
        loadPosition(todoElement, "todo");
    }

    function checkAndCreateNormalCard() {
        const hasNotes = localStorage.getItem("notes");
        const hasTodos = JSON.parse(localStorage.getItem("todos") || "[]").length > 0;

        if (!hasNotes && !hasTodos) {
            createNormalCard();
        } else {
            loadExistingNotesAndTodos();
        }
    }

    function createNormalCard() {
        const element = document.createElement("div");
        element.classList.add("floating-card", "normal-card");
        element.innerHTML = `<div class="card-header">Willkommen bei NotiFlow 👋</div>
                            <div class="card-content">
                                <p>Über das "+" kannst du Notizen und To-Do-Listen erstellen. 😀</p>
                                <p>Klicke einfach auf "Note" oder "To-Do", um loszulegen. 👈</p>
                                <p>‎ </p>
                                <p>‎ </p>
                                <p>NotiFlow befindet sich derzeit in der Beta-Phase. Weitere Features werden in Kürze hinzugefügt. 😊</p>
                            </div>
                            <div class="card-resize"></div>`;

        document.body.appendChild(element);
    }

    function removeNormalCard() {
        const normalCard = document.querySelector(".normal-card");
        if (normalCard) {
            normalCard.remove();
        }
    }

    function createFloatingElement(title, content, isEditable) {
        const element = document.createElement("div");
        element.classList.add("floating-card");
        element.innerHTML = `<div class="card-header">${title}<span class="delete-btn">❌</span></div>
                             <div class="card-content" contenteditable="${isEditable}">${content}</div>
                             <div class="card-resize"></div>`;

        document.body.appendChild(element);

        return element;
    }

    function hideMenu() {
        menu.classList.remove("active");
    }

    function saveNotes(content) {
        localStorage.setItem("notes", content);
    }

    function loadNotes(noteContent) {
        const savedNotes = localStorage.getItem("notes") || "Neue Notiz";
        noteContent.innerHTML = savedNotes;
    }

    function saveTodos(todoList) {
        const todos = [];
        todoList.querySelectorAll("li").forEach(li => {
            todos.push(li.textContent.trim());
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    function loadTodos(todoList) {
        const todos = JSON.parse(localStorage.getItem("todos") || "[]");
        todoList.innerHTML = "";

        todos.forEach(todo => {
            const li = document.createElement("li");
            li.contentEditable = "true";
            li.textContent = todo;
            li.addEventListener("input", () => saveTodos(todoList));
            todoList.appendChild(li);
        });

        if (todos.length === 0) {
            const newTask = document.createElement("li");
            newTask.contentEditable = "true";
            newTask.textContent = "Neue Aufgabe";
            newTask.addEventListener("input", () => saveTodos(todoList));
            todoList.appendChild(newTask);
        }
    }

    function loadExistingNotesAndTodos() {
        const hasNotes = localStorage.getItem("notes");
        const hasTodos = JSON.parse(localStorage.getItem("todos") || "[]").length > 0;

        if (hasNotes) {
            createNote();
        }

        if (hasTodos) {
            createTodo();
        }
    }

    function addDeleteButton(element, type) {
        const deleteButton = element.querySelector(".delete-btn");
        deleteButton.addEventListener("click", () => {
            element.remove();
            if (type === "note") {
                localStorage.removeItem("notes");
            } else if (type === "todo") {
                localStorage.removeItem("todos");
            }
        });
    }

    function makeDraggable(element, handle, type) {
        let offsetX, offsetY, isDragging = false;

        handle.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.zIndex = "1000";
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
                element.style.transform = "none";
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            savePosition(element, type);
        });
    }

    function makeResizable(element, handle) {
        let isResizing = false;

        handle.addEventListener("mousedown", (e) => {
            isResizing = true;
            e.preventDefault();
        });

        document.addEventListener("mousemove", (e) => {
            if (isResizing) {
                element.style.width = `${e.clientX - element.getBoundingClientRect().left}px`;
                element.style.height = `${e.clientY - element.getBoundingClientRect().top}px`;
            }
        });

        document.addEventListener("mouseup", () => {
            isResizing = false;
        });
    }

    function savePosition(element, type) {
        const id = type === "note" ? "note-position" : "todo-position";
        const position = {
            top: element.style.top,
            left: element.style.left
        };
        localStorage.setItem(id, JSON.stringify(position));
    }

    function loadPosition(element, type) {
        const id = type === "note" ? "note-position" : "todo-position";
        const savedPosition = JSON.parse(localStorage.getItem(id)) || { top: "50%", left: "50%" };
        element.style.top = savedPosition.top;
        element.style.left = savedPosition.left;
    }
});
