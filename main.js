const { app, BrowserWindow } = require('electron');
const path = require('path');
const clipboardWatcher = require('electron-clipboard-watcher');

let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 300,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Start clipboard watcher
clipboardWatcher({
    watchDelay: 1000,

    // When an image is copied
    // onImageChange: function (nativeImage) {
    //     const imageDataUrl = nativeImage.toDataURL();  // Convert to data URL

    //     // Add image to the list in the renderer process
    //     win.webContents.executeJavaScript(`window.addImageItem("${imageDataUrl.replace(/"/g, '\\"')}")`);
    // },

    // When text is copied
    onTextChange: function (text) {

        // Add text to the list in the renderer process
        win.webContents.send('clipboard-text', text);
    }
});

