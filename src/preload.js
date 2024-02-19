const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendTestMessage: () => ipcRenderer.send('test-message'),
    onTestMessageReply: (callback) => ipcRenderer.on('test-message-reply', (event, response) => callback(response)),
    calculateRefund: (data) => {
        console.log('Preload: Sending calculate-refund with data:', data);
        ipcRenderer.send('calculate-refund', data);
    },
    onCalculateRefundReply: (callback) => {
        ipcRenderer.once('calculate-refund-reply', (event, ...args) => {
            console.log('Preload: Received calculate-refund-reply with args:', args);
            callback(...args); // Adjusted to spread args directly
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const refundForm = document.getElementById('refundForm');
    if (!refundForm) {
        console.error('refundForm not found in the DOM');
        return;
    }

    refundForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originalPrice = parseFloat(document.getElementById('originalPrice').value);
        const taxRate = parseFloat(document.getElementById('taxRate').value);
        const originalDiscountRate = parseFloat(document.getElementById('originalDiscountRate').value);
        const newDiscountRate = parseFloat(document.getElementById('newDiscountRate').value);
        // Log the collected form data
        console.log('Form data collected', { originalPrice, taxRate, originalDiscountRate, newDiscountRate });
        // Send the data to the main process for calculation
        window.electronAPI.calculateRefund({ originalPrice, taxRate, originalDiscountRate, newDiscountRate });
        // Show loading feedback
        document.getElementById('loadingBox').style.display = 'block';
    });

    // Revised Handler for receiving the calculation result
    window.electronAPI.onCalculateRefundReply(({ refundAmount }) => {
        console.log('Refund calculation received', { refundAmount }); // Log the received data
        if (refundAmount !== undefined) {
            const resultBox = document.getElementById('resultBox');
            if (!resultBox) {
                console.error('resultBox not found in the DOM');
                return;
            }
            resultBox.textContent = `Refund Amount: $${refundAmount.toFixed(2)}`;
        } else {
            console.error('Received undefined refund amount');
        }
        // Hide loading feedback
        document.getElementById('loadingBox').style.display = 'none';
    });

    // Reset button event listener
    document.getElementById('resetButton').addEventListener('click', () => {
        document.getElementById('originalPrice').value = '';
        document.getElementById('taxRate').value = '';
        document.getElementById('originalDiscountRate').value = '20';
        document.getElementById('newDiscountRate').value = '25';
        document.getElementById('resultBox').textContent = 'Refund Amount: $0.00';
    });
});