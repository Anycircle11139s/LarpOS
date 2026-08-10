function updateClock() {
    const now = new Date();

    const formattedDate = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });
    
    const timeString = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
    });
    
    const clockElement = document.getElementById('live-time');
    if (clockElement) {
        clockElement.textContent = `${formattedDate} ${timeString}`;
    }
}

updateClock();
setInterval(updateClock, 1000);

function dragElement(element) {
    if (!element) {
        return;
    }

    const handle = element;
    let offsetX = 0;
    let offsetY = 0;

    handle.style.cursor = "move";
    handle.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(event) {
        event.preventDefault();
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;

        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement, { once: true });
    }

    function elementDrag(event) {
        event.preventDefault();

        element.style.top = `${event.clientY - offsetY}px`;
        element.style.left = `${event.clientX - offsetX}px`;
        element.style.transform = 'none';
    }

    function closeDragElement() {
        document.removeEventListener('mousemove', elementDrag);
    }
}

function setupWindow(windowId, openButtonId, closeButtonId, defaultTop, defaultLeft) {
    const element = document.getElementById(windowId);
    if (!element) {
        return;
    }

    dragElement(element);

    function openWindow() {
        element.style.display = "block";
        element.style.top = defaultTop;
        element.style.left = defaultLeft;
        element.style.transform = "translate(-50%, -50%)";
    }

    function closeWindow() {
        element.style.display = "none";
    }

    const closeButton = document.getElementById(closeButtonId);
    if (closeButton) {
        closeButton.addEventListener("click", closeWindow);
    }

    const openButton = document.getElementById(openButtonId);
    if (openButton) {
        openButton.addEventListener("click", openWindow);
    }
}

setupWindow("Welcome", "welcomeopen", "welcomeclose", "20%", "20%");
setupWindow("Hello", "helloopen", "helloclose", "32%", "62%");
setupWindow("Terminal", "terminalopen", "terminalclose", "32%", "62%");

function initTerminal() {
    const input = document.getElementById('command-input');
    const output = document.getElementById('output');
    const terminalWindow = document.getElementById('Terminal');

    if (!input || !output || !terminalWindow) return;

    terminalWindow.addEventListener('click', () => {
        input.focus();
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const command = input.value.trim().toLowerCase();

            output.innerHTML += `<br>&gt; ${input.value.trim()}`;
            if (command === 'help') {
                output.innerHTML += '<br>Available commands:<br>  help    - Show this screen<br>  clear   - Clear terminal logs<br>  about   - OS Information<br>  date    - Show system time';
            } else if (command === 'clear') {
                output.innerHTML = '';
            } else if (command === 'about') {
                output.innerHTML += '<br>LarpOS™ v1.0.0<br>Created by Darsh (@NotALarp).<br>"The Larp never ends"';
            } else if (command === 'date') {
                output.innerHTML += `<br>${new Date().toString()}`;
            } else if (command !== '') {
                output.innerHTML += `<br>LarpOS: command not found: ${input.value.trim()}`;
            }
            input.value = '';
            terminalWindow.scrollTop = terminalWindow.scrollHeight;
        }
    });
}  

initTerminal();
