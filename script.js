function updateClock() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('live-time').textContent = dateStr + ' ' + timeStr;
}
updateClock();
setInterval(updateClock, 1000);

function dragElement(el) {
    const titleBar = el.querySelector('.title-bar');
    if (!titleBar) return;

    let initialX = 0;
    let initialY = 0;

    titleBar.onmousedown = function(e) {
        if (e.target.classList.contains('dot')) return;
        startDragging(e);
    };

    function startDragging(e) {
        e.preventDefault();

        const rect = el.getBoundingClientRect();
        el.style.top = rect.top + "px";
        el.style.left = rect.left + "px";
        el.style.transform = "none";

        initialX = e.clientX;
        initialY = e.clientY;
        document.onmousemove = drag;
        document.onmouseup = stopDragging;
    }

    function drag(e) {
        e.preventDefault();
        const deltaX = initialX - e.clientX;
        const deltaY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;

        el.style.top = (el.offsetTop - deltaY) + "px";
        el.style.left = (el.offsetLeft - deltaX) + "px";
    }

    function stopDragging() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}

function resizeElement(el) {
    const handle = el.querySelector('.resize-handle');
    if (!handle) return;

    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    handle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        startX = e.clientX;
        startY = e.clientY;
        startWidth = el.offsetWidth;
        startHeight = el.offsetHeight;
        document.onmousemove = doResize;
        document.onmouseup = stopResize;
    });

    function doResize(e) {
        e.preventDefault();
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        el.style.width = newWidth + "px";
        el.style.height = newHeight + "px";
    }

    function stopResize() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}

const windowIds = ['Welcome', 'Hello', 'Terminal', 'Settings'];
const openList = document.getElementById('open-windows');

function openWindow(id) {
    const el = document.getElementById(id);
    el.style.display = 'flex';
    updateTaskbar();
}

function closeWindow(id) {
    document.getElementById(id).style.display = 'none';
    updateTaskbar();
}

function updateTaskbar() {
    openList.innerHTML = '';
    for (const id of windowIds) {
        const el = document.getElementById(id);
        if (el.style.display === 'flex') {
            const tag = document.createElement('span');
            tag.textContent = id;
            openList.appendChild(tag);
        }
    }
}

windowIds.forEach(id => dragElement(document.getElementById(id)));
windowIds.forEach(id => resizeElement(document.getElementById(id)));

document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', function() {
        openWindow(icon.dataset.app);
    });
});

document.querySelectorAll('.dot.red').forEach(btn => {
    btn.addEventListener('click', function() {
        closeWindow(btn.dataset.close);
    });
});

const contextMenu = document.getElementById('context-menu');
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    contextMenu.style.display = 'block';
    contextMenu.style.left = e.pageX + 'px';
    contextMenu.style.top = e.pageY + 'px';
});
document.addEventListener('click', function() {
    contextMenu.style.display = 'none';
});

document.getElementById('ctx-settings').addEventListener('click', function() {
    openWindow('Settings');
});
document.getElementById('ctx-refresh').addEventListener('click', function() {
    location.reload();
});
document.getElementById('ctx-wallpaper').addEventListener('click', function() {
    openWindow('Settings');
});

document.querySelectorAll('[data-theme-btn]').forEach(btn => {
    btn.addEventListener('click', function() {
        document.body.dataset.theme = btn.dataset.themeBtn;
        localStorage.setItem('larpos-theme', btn.dataset.themeBtn);
    });
});

const savedTheme = localStorage.getItem('larpos-theme');
if (savedTheme) {
    document.body.dataset.theme = savedTheme;
}

function initTerminal() {
    const input = document.getElementById('command-input');
    const output = document.getElementById('output');
    const terminalWindow = document.getElementById('Terminal');
    if (!input || !output || !terminalWindow) return;

    terminalWindow.addEventListener('click', function() {
        input.focus();
    });

    input.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter') return;
        const command = input.value.trim().toLowerCase();
        output.innerHTML += '<br>&gt; ' + input.value.trim();

        if (command === 'help') {
            output.innerHTML += '<br>Available commands:<br>  help    - Show this screen<br>  clear   - Clear terminal logs<br>  about   - OS Information<br>  date    - Show system time<br>  larp    - ???<br>  theme   - List themes';
        } else if (command === 'clear') {
            output.innerHTML = '';
        } else if (command === 'about') {
            output.innerHTML += '<br>LarpOS™ v2.0.0<br>Created by Darsh (@NotALarp).<br>"The Larp never ends"';
        } else if (command === 'date') {
            output.innerHTML += '<br>' + new Date().toString();
        } else if (command === 'larp') {
            output.innerHTML += '<br>LARP LARP LARP SAHUR';
        } else if (command === 'theme') {
            output.innerHTML += '<br>Available themes: classic, night<br>Use Settings app to change.';
        } else if (command != '') {
            output.innerHTML += '<br>LarpOS: command not found: ' + input.value.trim();
        }
        input.value = '';
        terminalWindow.scrollTop = terminalWindow.scrollHeight;
    });
}
initTerminal();
