let scannedData = '';

function onScanSuccess(decodedText, decodedResult) {
    // Handle on success condition with the decoded text or result.
    console.log(`Code scanned = ${decodedText}`, decodedResult);
    scannedData = decodedText;
    // Optionally, stop scanning.
    html5QrCode.stop().then(ignore => {
      // QR Code scanning is stopped.
      console.log("QR Scanning stopped.");
    }).catch(err => {
      // Stop failed, handle it.
    });
}

function onScanError(errorMessage) {
    // handle on error condition, with error message
    console.error(errorMessage);
}

// This method will trigger user permissions
Html5Qrcode.getCameras().then(devices => {
    /**
     * devices would be an array of objects of type:
     * { id: "id", label: "label" }
     */
    if (devices && devices.length) {
        var cameraId = devices[0].id;
        // .. use this to start scanning.
        const html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
          cameraId, 
          {
            fps: 10,    // Optional frame per seconds for qr code scanning
            qrbox: 250  // Optional if you want bounded box UI
          },
          onScanSuccess,
          onScanError)
        .catch(err => {
          // Start failed, handle it.
        });
    }
}).catch(err => {
    // handle err
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
