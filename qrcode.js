function generateHistoryContentQrcode(entries, patientName) {
    let fileContent = "Date\tHumeur\tNom du patient\n";
  
    entries.forEach((entry) => {
      fileContent += `${entry.date}\t${entry.mood}\t${patientName}\n`;
    });
  
    return fileContent;
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    const qrcodeCanvas = document.getElementById("qrcodeCanvas");
    const qrcodeElement = document.getElementById("qrcode");
  
    const entries = JSON.parse(localStorage.getItem("entries")) || [];
    const patientName = localStorage.getItem("patientFullName");
    const fileContent = generateHistoryContentQrcode(entries, patientName);
  
    // Échapper les balises HTML dans le contenu du QR code
    const escapedFileContent = escapeHtml(fileContent);
  
    const qr = new QRious({
      element: qrcodeCanvas,
      value: escapedFileContent,
      size: 128,
      foreground: "#299272",
    });
  
    qr.toDataURL(function (dataURL) {
      const image = new Image();
      image.src = dataURL;
      qrcodeCanvas.parentNode.replaceChild(image, qrcodeCanvas);
    });
  
    const qrCode = new QRCode(qrcodeElement, {
      text: escapedFileContent,
      width: 128,
      height: 128,
    });
  });
  
  // Fonction pour échapper les balises HTML
  function escapeHtml(text) {
    const element = document.createElement("div");
    element.textContent = text;
    return element.innerHTML;
  }
  