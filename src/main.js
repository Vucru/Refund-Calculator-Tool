'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Function to calculate the refund amount
function calculateRefundAmount(originalPrice, taxRate, originalDiscountRate, newDiscountRate) {
    console.log('Main: Calculating refund amount', { originalPrice, taxRate, originalDiscountRate, newDiscountRate });

    const taxMultiplier = 1 + (taxRate / 100);
    console.log('Main: Tax multiplier calculated', taxMultiplier);

    const priceAfterOriginalDiscount = originalPrice * ((100 - originalDiscountRate) / 100);
    console.log('Main: Price after original discount calculated', priceAfterOriginalDiscount);

    const priceAfterNewDiscount = originalPrice * ((100 - newDiscountRate) / 100);
    console.log('Main: Price after new discount calculated', priceAfterNewDiscount);

    const refundAmount = Math.abs((priceAfterNewDiscount - priceAfterOriginalDiscount) * taxMultiplier);
    console.log('Main: Refund amount calculated', refundAmount);

    console.log('Main: Returning refund amount', refundAmount);
    return refundAmount;
}

// Function to create the main window of the Electron app
function createWindow() {
    console.log('Main: Creating main window');
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, // Enable context isolation
            enableRemoteModule: false,
            worldSafeExecuteJavaScript: true, // Ensure worldSafeExecuteJavaScript is set to true
        },
    });

    mainWindow.loadFile('index.html');
    console.log('Main: Main window loaded');

    // Open DevTools - consider for development only
    // mainWindow.webContents.openDevTools();
    // console.log('Main: DevTools opened');

    mainWindow.on('ready-to-show', () => {
        console.log('Main: Main window is ready to show');
    });

    mainWindow.on('closed', () => {
        console.log('Main: Main window is closed');
    });
}

// App lifecycle events
app.whenReady().then(() => {
    console.log('Main: App is ready, creating window');
    createWindow();

    ipcMain.on('test-message', (event) => {
        console.log('Test message received');
        event.reply('test-message-reply', 'Test reply from main process');
      });

    ipcMain.on('calculate-refund', (event, { originalPrice, taxRate, originalDiscountRate, newDiscountRate }) => {
        console.log('Main: IPC event calculate-refund received', { originalPrice, taxRate, originalDiscountRate, newDiscountRate });
        // Perform the calculation
        const refundAmount = calculateRefundAmount(parseFloat(originalPrice), parseFloat(taxRate), parseFloat(originalDiscountRate), parseFloat(newDiscountRate));
        console.log('Main: Refund amount calculated, sending back to renderer', { refundAmount });
        // Check if refundAmount is not undefined before sending it back
        if (refundAmount !== undefined) {
            // Send the calculation result back to the renderer process
            event.reply('calculate-refund-reply', { refundAmount });
            console.log('Main: Sent calculate-refund-reply with data:', { refundAmount });
        } else {
            console.error('Main: Calculated refund amount is undefined');
        }
    });

    app.on('activate', () => {
        console.log('Main: App activated');
        if (BrowserWindow.getAllWindows().length === 0) {
            console.log('Main: No window available, creating a new one');
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    console.log('Main: All windows are closed. Quitting application.');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    console.log('Main: App is about to quit');
});

app.on('will-quit', () => {
    console.log('Main: App will quit');
});

app.on('quit', () => {
    console.log('Main: App quit');
});