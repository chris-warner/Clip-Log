const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const clipboardList = document.getElementById('clipboard-list');
    const addedTexts = new Set(); // Track added texts to avoid duplicates
    const status = document.getElementById('status');

    function addTextItem(text) {
        if (addedTexts.has(text)) return;

        const li = document.createElement('li');
        li.classList.add('collapsed');
        const textSpan = document.createElement('span');
        textSpan.textContent = text;

        // Div to group the icons
        const imageGroup = document.createElement('div');
        imageGroup.classList.add('image-group');

        // Copy icon
        const copyImg = document.createElement('img');
        copyImg.src = './assets/images/copy.svg';
        copyImg.alt = 'Copy icon';

        // Expand icon
        const expandImg = document.createElement('img');
        expandImg.src = './assets/images/expand.svg';
        expandImg.alt = 'Expand icon';

        // Append images to the image group
        imageGroup.appendChild(copyImg);
        imageGroup.appendChild(expandImg);

        li.appendChild(textSpan);
        li.appendChild(imageGroup);
        clipboardList.prepend(li);
        addedTexts.add(text);

        copyImg.addEventListener('click', () => {
            copyToClipboard(text);
            showStatusMessage("Copied!");
        });

        expandImg.addEventListener('click', () => {
            toggleHeight(li);
        });

        animateItem(li);
    }

    function toggleHeight(li) {
        li.classList.toggle('expanded');
    }

    function showStatusMessage(message) {
        status.textContent = message;
        status.classList.add('fade-in');
        setTimeout(() => {
            status.classList.remove('fade-in');
            status.classList.add('fade-out');
            setTimeout(() => {
                status.classList.remove('fade-out');
                status.textContent = "";
            }, 500);
        }, 2000); // Duration to show the "Copied!" message
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard:', text);
            })
            .catch(err => {
                console.error('Error copying text: ', err);
            });
    }

    function animateItem(li) {
        setTimeout(() => {
            li.classList.add('show');
        }, 100);
    }

    ipcRenderer.on('clipboard-text', (event, text) => {
        console.log("Received clipboard text:", text);
        addTextItem(text);
    });
});
