const container = document.getElementById("notepad");
let scale = 1;
let originX = 0, originY = 0;
let isPanning = false;
let startX, startY;

// Smooth Zoom-Funktion mit Begrenzung
container.addEventListener("wheel", (event) => {
    event.preventDefault();
    const zoomFactor = 0.1;
    const oldScale = scale;
    
    let newScale = scale + event.deltaY * -zoomFactor * scale;
    newScale = Math.max(0.75, Math.min(newScale, 3)); // Begrenzung des Zooms

    if (newScale !== scale) {
        // Berechnung des Zoom-Zentrums
        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        originX -= (mouseX / oldScale - mouseX / newScale) * 10;
        originY -= (mouseY / oldScale - mouseY / newScale) * 10;

        scale = newScale;
        updateBackgroundSmoothly();
    }
});

// Panning-Funktion
container.addEventListener("mousedown", (event) => {
    if (event.button === 0) { // Linksklick
        isPanning = true;
        startX = event.clientX - originX;
        startY = event.clientY - originY;
        container.style.cursor = "grabbing";
    }
});

container.addEventListener("mousemove", (event) => {
    if (isPanning) {
        originX = event.clientX - startX;
        originY = event.clientY - startY;
        updateBackground();
    }
});

container.addEventListener("mouseup", () => {
    isPanning = false;
    container.style.cursor = "grab";
});

container.addEventListener("mouseleave", () => {
    isPanning = false;
    container.style.cursor = "grab";
});

function updateBackgroundSmoothly() {
    container.style.transition = "background-size 0.15s ease-out, background-position 0.15s ease-out";
    updateBackground();
    setTimeout(() => {
        container.style.transition = "";
    }, 150);
}

function updateBackground() {
    container.style.backgroundImage = `radial-gradient(rgb(48, 48, 48) 1px, transparent 1px)`;
    container.style.backgroundSize = `${30 * scale}px ${30 * scale}px`;
    container.style.backgroundPosition = `${originX}px ${originY}px`;
}

updateBackground();