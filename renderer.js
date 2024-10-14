const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const clipboardList = document.getElementById('clipboard-list');
    const addedTexts = new Set(); // Track added texts to avoid duplicates
    const status = document.getElementById('status'); // Get the status element

    // Function to add new text item with images to the list
    function addTextItem(text) {
        if (addedTexts.has(text)) return; // Prevent adding duplicate items

        const li = document.createElement('li');
        li.classList.add('collapsed'); // Set initial state

        // Create a span for text to maintain separation
        const textSpan = document.createElement('span');
        textSpan.textContent = text;

        // Create a div to group the images
        const imageGroup = document.createElement('div');
        imageGroup.classList.add('image-group'); // Add a class for styling

        // Create the first image element (copy icon)
        const copyImg = document.createElement('img');
        copyImg.src = './assets/images/copy.svg';  // Set the source of the copy icon
        copyImg.alt = 'Copy icon';                   // Alternative text for accessibility
        copyImg.classList.add('right-image');        // Add a class for styling

        // Create the second image element (expand icon)
        const expandImg = document.createElement('img');
        expandImg.src = './assets/images/expand.svg'; // Set the source of the second image
        expandImg.alt = 'Expand icon';                  // Alternative text for accessibility
        expandImg.classList.add('right-image');          // Add a class for styling

        // Append images to the image group
        imageGroup.appendChild(copyImg);
        imageGroup.appendChild(expandImg);

        li.appendChild(textSpan);        // Add text to the list item
        li.appendChild(imageGroup);      // Add image group to the list item
        clipboardList.prepend(li);       // Add new item to the top of the list
        addedTexts.add(text);            // Track the added text to prevent duplicates

        // Add click event listener to copy the text to clipboard
        copyImg.addEventListener('click', () => {
            copyToClipboard(text);
            showStatusMessage("Copied!"); // Show the copied status message
        });

        // Add click event listener to toggle the expand/collapse
        expandImg.addEventListener('click', () => {
            toggleHeight(li);
        });

        animateItem(li);
    }

    // Function to toggle the height of the li
    function toggleHeight(li) {
        li.classList.toggle('expanded'); // Toggle the expanded class
    }

    // Function to show the copied status message
    function showStatusMessage(message) {
        status.textContent = message;
        status.classList.add('fade-in'); // Start fade-in effect
        setTimeout(() => {
            status.classList.remove('fade-in'); // Remove fade-in effect
            status.classList.add('fade-out'); // Start fade-out effect
            setTimeout(() => {
                status.classList.remove('fade-out'); // Reset status after fade-out
                status.textContent = ""; // Clear the status text
            }, 500); // Time to wait before clearing the text
        }, 2000); // Duration to show the "Copied!" message
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard:', text);
            })
            .catch(err => {
                console.error('Error copying text: ', err);
            });
    }

    // Function to animate the new item
    function animateItem(li) {
        setTimeout(() => {
            li.classList.add('show');
        }, 100);  // Add delay to allow the insertion animation
    }

    // Listen for clipboard-text event from the main process
    ipcRenderer.on('clipboard-text', (event, text) => {
        console.log("Received clipboard text:", text);
        addTextItem(text); // Only add the item when text is copied to clipboard
    });
});
