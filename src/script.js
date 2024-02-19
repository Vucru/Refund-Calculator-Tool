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
        
        console.log('Form data collected', { originalPrice, taxRate, originalDiscountRate, newDiscountRate });
        
        // Register the ipcRenderer.once inside the submit event to ensure it's set up each time
        window.electronAPI.onCalculateRefundReply(({ refundAmount }) => {
            console.log('Refund calculation received', { refundAmount });
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

            document.getElementById('loadingBox').style.display = 'none';
        });

        window.electronAPI.calculateRefund({ originalPrice, taxRate, originalDiscountRate, newDiscountRate });
        
        document.getElementById('loadingBox').style.display = 'block';
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        document.getElementById('originalPrice').value = '';
        document.getElementById('taxRate').value = '';
        document.getElementById('originalDiscountRate').value = '20';
        document.getElementById('newDiscountRate').value = '25';
        document.getElementById('resultBox').textContent = 'Refund Amount: $0.00';
    });
});
