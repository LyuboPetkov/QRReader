let scannedData = '';

function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code scanned = ${decodedText}`, decodedResult);
    scannedData = decodedText;
    html5QrCode.stop().then(ignore => {
      console.log("QR Scanning stopped.");
    }).catch(err => {
      console.error("Stopping QR Scanning failed.", err);
    });
}

function onScanError(errorMessage) {
    console.error(errorMessage);
}

// Modified to prefer the rear camera
Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
        let cameraId = devices[0].id; // Default to the first camera (usually front camera on smartphones)
        // Look for a rear-facing camera
        const rearCamera = devices.find(device => device.label.toLowerCase().includes('back'));
        if (rearCamera) {
            cameraId = rearCamera.id; // Use the rear camera if found
        }

        const html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
          cameraId, 
          {
            fps: 10,
            qrbox: 150
          },
          onScanSuccess,
          onScanError)
        .catch(err => {
          console.error("Unable to start QR scanning", err);
        });
    }
}).catch(err => {
    console.error("Failed to get camera devices", err);
});

function decryptData() {
    const key = document.getElementById('decryption-key').value;
    if (scannedData && key) {
        try {
            const decryptedData = CryptoJS.AES.decrypt(scannedData, key).toString(CryptoJS.enc.Utf8);
            document.getElementById('data').innerText = decryptedData ? decryptedData : 'Invalid key or data.';
        } catch(e) {
            document.getElementById('data').innerText = 'Decryption failed.';
            console.error('Decryption error:', e);
        }
    }
}
