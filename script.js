document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-button");
    const menu = document.getElementById("menu");
    const noteButton = document.querySelector(".menu-item:nth-child(2)"); 
    const todoButton = document.querySelector(".menu-item:nth-child(1)"); 
    
    menuButton.addEventListener("click", toggleMenu);
    noteButton.addEventListener("click", createNote);
    todoButton.addEventListener("click", createTodo);

    createNormalCard();

    function toggleMenu() {
        menu.classList.toggle("active");
    }

    function createNote() {
        removeNormalCard(); 
        createFloatingElement("Notiz", "Neue Notiz", true);
        hideMenu();  
    }

    function createTodo() {
        removeNormalCard();
        createFloatingElement("To-Do", "<ul class='todo-list'><li contenteditable='true'>Neue Aufgabe</li></ul>", false);
        hideMenu();
    }

    function createNormalCard() {
        const element = document.createElement("div");
        element.classList.add("floating-card", "normal-card");
        element.innerHTML = `<div class="card-header">Willkommen bei NotiFlow 👋</div>
                            <div class="card-content">
                                <p>Über das "+" kannst du, Notizen und To-Do-Listen erstellen. 😀</p>
                                <p>Klicke einfach auf "Note" oder "To-Do", um loszulegen. 👈</p>
                                <p>‎ </p>
                                <p>‎ </p>
                                <p>NotiFlow befindet sich derzeit in der Beta-Phase. Weitere Features werden in Kürze hinzugefügt. 😊</p>
                            </div>
                            <div class="card-resize"></div>`;

        element.style.width = "500px";   
        element.style.height = "300px"; 
        element.style.position = "absolute";
        element.style.top = "50%";
        element.style.left = "55%";
        element.style.transform = "translate(-50%, -50%)"; 

        document.body.appendChild(element);

        makeDraggable(element, element.querySelector(".card-header"));
        makeResizable(element, element.querySelector(".card-resize"));
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
        element.innerHTML = `<div class="card-header">${title}</div><div class="card-content" contenteditable="${isEditable}">${content}</div><div class="card-resize"></div>`;
        document.body.appendChild(element);

        makeDraggable(element, element.querySelector(".card-header"));
        makeResizable(element, element.querySelector(".card-resize"));
    }

    function hideMenu() {
        menu.classList.remove("active"); 
    }

    function makeDraggable(element, handle) {
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
});
