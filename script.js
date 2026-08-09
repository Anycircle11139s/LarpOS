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

    const handle = document.getElementById('welcomeheader') || element;
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

dragElement(document.getElementById("Welcome"));
