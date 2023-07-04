// Fonction pour gérer le remplacement de l'icône lors du défilement
function handleIconScroll() {
  const barsIcon = document.getElementById("bars");
  const chevronIcon = document.getElementById("chevron");
  const scrollThreshold = 400;

  if (document.documentElement.scrollTop > scrollThreshold) {
    barsIcon.style.display = "none";
    chevronIcon.style.display = "flex";
  } else {
    barsIcon.style.display = "flex";
    chevronIcon.style.display = "none";
  }
}

// Fonction pour gérer l'affichage de la barre de navigation
function handleNavBarDisplay() {
  const navFooter = document.getElementById("nav_footer");
  const scrollThreshold = 400;

  if (document.documentElement.scrollTop < scrollThreshold) {
    navFooter.style.display = "none";
  } else {
    navFooter.style.display = "flex";
  }
}

// Événement de défilement pour exécuter les fonctions appropriées
window.onscroll = function () {
  handleIconScroll();
  handleNavBarDisplay();
};

// Gestion globale des humeurs

// Fonction pour créer le code HTML d'une entrée d'humeur
function createEntryHTML(date, mood) {
  const name = localStorage.getItem("patientName");
  return `
    <div class="entry">
      <div class="date">${date}</div>
      <div class="name">${name}</div>
      <div class="mood">${mood}</div>
    </div>
  `;
}

// Fonction pour générer le contenu du fichier d'historique
function generateHistoryContent(entries, patientName, currentDate) {
  let fileContent = "Date\t\t\tNom\t\t\tHumeur\n";
  entries.forEach((entry) => {
    fileContent += `${entry.date}\t${patientName}\t${entry.mood}\n`;
  });
  return fileContent;
}

// Fonction pour télécharger l'historique d'humeur
function downloadHistory() {
  // Désactiver le bouton de téléchargement
  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.disabled = true;

  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const patientName = localStorage.getItem("patientName");
  const currentDate = new Date().toISOString().split("T")[0];
  const fileName = `historique_humeur_${patientName}_${currentDate}.txt`;

  // Création du contenu du fichier
  const fileContent = generateHistoryContent(entries, patientName, currentDate);

  // Création du fichier à télécharger
  const fileBlob = new Blob([fileContent], { type: "text/plain" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(fileBlob);
  downloadLink.download = fileName;
  downloadLink.click();

  // Réactiver le bouton de téléchargement après un court délai
  setTimeout(() => {
    downloadBtn.disabled = false;
  }, 1000);
}

// Fonction pour afficher les entrées d'humeur
function displayEntries() {
  const entriesContainer = document.getElementById("entries");
  const entries = JSON.parse(localStorage.getItem("entries")) || [];

  // Vérifier s'il y a des entrées enregistrées
  if (entries.length > 0) {
    // Créer le contenu HTML de toutes les entrées
    const entriesHTML = entries
      .map((entry) => {
        return createEntryHTML(entry.date, entry.mood);
      })
      .join(""); // Fusionner les entrées en une seule chaîne

    entriesContainer.innerHTML = entriesHTML;
  } else {
    entriesContainer.innerHTML = "<p>Aucune entrée disponible.</p>";
  }
}

// Fonction pour initialiser l'application
function initializeApp() {
  // Vérifier si le patient a déjà renseigné son nom complet
  let patientFullName = localStorage.getItem("patientFullName");

  if (!patientFullName) {
    let name = "";
    while (name.trim().length === 0) {
      const confirmed = confirm(
        "Veuillez saisir votre nom et prénom complet :"
      );
      if (confirmed) {
        name = prompt("Nom et prénom complet :");
      } else {
        // L'utilisateur a refusé la saisie du nom et prénom, vous pouvez ajouter une logique de gestion de cette situation.
        return;
      }
    }
    localStorage.setItem("patientFullName", name);
    patientFullName = name;
  }

  // Afficher le nom complet du patient
  const patientNameElement = document.querySelector(".name");
  patientNameElement.textContent = patientFullName;

  // Afficher les entrées d'humeur
  displayEntries();
}

// Gestionnaire d'événement au chargement du document
document.addEventListener("DOMContentLoaded", function () {
  // Vérifier si le patient a déjà renseigné son nom complet
  const patientFullName = localStorage.getItem("patientFullName");

  if (!patientFullName) {
    let name = "";
    while (name.trim().length === 0) {
      const confirmed = confirm(
        "Veuillez saisir votre nom et prénom complet :"
      );
      if (confirmed) {
        name = prompt("Nom et prénom complet :");
      } else {
        // L'utilisateur a refusé la saisie du nom et prénom, vous pouvez ajouter une logique de gestion de cette situation.
        return;
      }
    }
    localStorage.setItem("patientFullName", name);
  }

  initializeApp();

  // Ajouter un gestionnaire d'événement aux emojis
  const emojis = document.getElementsByClassName("circle_mood");
  for (let i = 0; i < emojis.length; i++) {
    emojis[i].addEventListener("click", function (event) {
      const emojiId = event.target.id;
      const mood = emojiId.replace("emoji-", "");
      saveMood(mood);
    });
  }

  // Gestionnaire d'événement pour le téléchargement de l'historique
  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.addEventListener("click", function () {
    downloadHistory();
  });
});

// notification cloche
const cloche = document.getElementById("cloche");
const notificationOverlay = document.getElementById("notificationOverlay");

// Vérifie si la notification a déjà été affichée aujourd'hui
const isNotificationDisplayed = localStorage.getItem("notificationDisplayed");

// Affiche la notification si elle n'a pas été affichée aujourd'hui
if (!isNotificationDisplayed) {
  displayNotification();
}

// Fonction pour afficher la notification
function displayNotification() {
  notificationOverlay.style.display = "block";
  cloche.classList.add("clignote");

  // Enregistre que la notification a été affichée aujourd'hui
  localStorage.setItem("notificationDisplayed", true);
}

// Ferme la notification
function closeNotification() {
  notificationOverlay.style.display = "none";
  cloche.classList.remove("clignote");
}

// Gère le clic sur la cloche
cloche.addEventListener("click", (event) => {
  event.stopPropagation();

  if (notificationOverlay.style.display === "none") {
    displayNotification();
  } else {
    closeNotification();
  }
});

// Fermeture notification avec la crois
document.addEventListener("DOMContentLoaded", function () {
  var closeButton = document.querySelector(".close-button");
  var notificationOverlay = document.querySelector(".notification-overlay");

  closeButton.addEventListener("click", function () {
    notificationOverlay.style.display = "none";
  });
});

// Fonction pour afficher toutes les entrées d'humeur enregistrées
function displayEntries() {
  const entriesContainer = document.getElementById("entries");
  const entries = JSON.parse(localStorage.getItem("entries")) || [];

  // Vérifier s'il y a des entrées enregistrées
  if (entries.length > 0) {
    const entryHTML = entries
      .map((entry) => createEntryHTML(entry.date, entry.mood))
      .join("");
    entriesContainer.innerHTML = entryHTML;
  } else {
    entriesContainer.innerHTML =
      "<p class='no-entries'>Aucune entrée d'humeur enregistrée.</p>";
  }

  // Ajouter du style au paragraphe généré
  const noEntriesElement = entriesContainer.querySelector(".no-entries");
  noEntriesElement.style.color = "#f5f5f5";
  noEntriesElement.style.textAlign = "center";
  noEntriesElement.style.fontWeight = "bold";
  // Ajoutez d'autres styles selon vos préférences

  // ...
}

/**
 * Crée le code HTML pour une entrée d'humeur
 * @param {string} date - La date de l'entrée
 * @param {string} mood - L'humeur enregistrée
 * @returns {string} Le code HTML de l'entrée
 */
function createEntryHTML(date, mood) {
  const today = new Date().toLocaleDateString();
  const entryDate = date === today ? "Aujourd'hui<br>" : date;
  const entryHTML = `
    <div class="entry">
      <div class="date">${entryDate}</div>
      <div class="mood">
        ${
          date === today
            ? "<span class='highlighted'>Votre état d'humeur actuel est :</span>"
            : "État d'humeur :"
        }
        <span class="name">${mood}</span>
      </div>
    </div>
  `;
  return entryHTML;
}

// Fonction pour enregistrer l'humeur
function saveMood(mood) {
  const entryDate = new Date().toLocaleDateString();

  // Enregistrer l'entrée dans le stockage local
  localStorage.setItem("lastEntryDate", entryDate);

  // Rechercher une entrée existante avec la même date
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const existingEntryIndex = entries.findIndex(
    (entry) => entry.date === entryDate
  );

  if (existingEntryIndex !== -1) {
    // Remplacer l'entrée existante avec la nouvelle humeur
    entries[existingEntryIndex].mood = mood;
  } else {
    // Ajouter une nouvelle entrée
    entries.push({
      date: entryDate,
      mood: mood,
    });
  }

  localStorage.setItem("entries", JSON.stringify(entries));

  // Afficher les entrées mises à jour
  displayEntries();

  // Mettre à jour le titre de la page avec l'humeur sélectionnée
  updateTitle(mood);
}

function updateTitle(mood) {
  document.getElementById("moodTitle").innerText =
    "Votre humeur aujourd'hui est " + mood;
}

// Ajouter les écouteurs d'événements pour les clics sur les emojis
document
  .querySelector(
    '.container_mood a[href="#entries"][onclick="saveMood(\'Furieux\')"]'
  )
  .addEventListener("click", function () {
    updateTitle("Furieux");
  });

document
  .querySelector(
    '.container_mood a[href="#entries"][onclick="saveMood(\'Déprimé\')"]'
  )
  .addEventListener("click", function () {
    updateTitle("Déprimé");
  });

document
  .querySelector(
    '.container_mood a[href="#entries"][onclick="saveMood(\'Indifférent\')"]'
  )
  .addEventListener("click", function () {
    updateTitle("Indifférent");
  });

document
  .querySelector(
    '.container_mood a[href="#entries"][onclick="saveMood(\'Heureux\')"]'
  )
  .addEventListener("click", function () {
    updateTitle("Heureux");
  });

// Événement de clic sur les emojis
const emojis = document.getElementsByClassName("circle_mood");

for (let i = 0; i < emojis.length; i++) {
  emojis[i].addEventListener("click", function (event) {
    const emojiName = event.target.alt;
    saveMood(emojiName);
  });
}

// Gestion du téléchargement de l'historique
const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", function () {
  downloadHistory();
});

// Fonction pour télécharger l'historique d'humeur
function downloadHistory() {
  // Désactiver le bouton de téléchargement
  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.disabled = true;

  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const patientName = localStorage.getItem("patientFullName");
  const currentDate = new Date().toISOString().split("T")[0];
  const fileName = `historique_humeur_${patientName}_${currentDate}.txt`;

  // Création du contenu du fichier
  const fileContent = generateHistoryContent(entries);

  // Création du fichier à télécharger
  const fileBlob = new Blob([fileContent], { type: "text/plain" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(fileBlob);
  downloadLink.download = fileName;
  downloadLink.click();

  // Réactiver le bouton de téléchargement après un court délai
  setTimeout(() => {
    downloadBtn.disabled = false;
  }, 1000);
}

// Variable pour contrôler le téléchargement en cours
let isDownloading = false;

// Fonction pour télécharger l'historique d'humeur
function downloadHistory() {
  // Vérifier si un téléchargement est déjà en cours
  if (isDownloading) {
    return;
  }

  // Définir la variable de contrôle sur true
  isDownloading = true;

  // Désactiver le bouton de téléchargement
  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.disabled = true;

  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const patientName = localStorage.getItem("patientFullName");
  const currentDate = new Date().toISOString().split("T")[0];
  const fileName = `historique_humeur_${patientName}_${currentDate}.txt`;

  // Création du contenu du fichier
  const fileContent = generateHistoryContent(entries);

  // Création du fichier à télécharger
  const fileBlob = new Blob([fileContent], { type: "text/plain" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(fileBlob);
  downloadLink.download = fileName;
  downloadLink.click();

  // Réactiver le bouton de téléchargement après un court délai
  setTimeout(() => {
    downloadBtn.disabled = false;
    isDownloading = false; // Réinitialiser la variable de contrôle
  }, 1000);
}

// Fonction pour générer le contenu du fichier d'historique
function generateHistoryContent(entries) {
  let fileContent = "Date\t\t\tHumeur\n";
  entries.forEach((entry) => {
    fileContent += `${entry.date}\t${entry.mood}\n`;
  });
  return fileContent;
}

// Afficher les entrées d'humeur lors du chargement de la page
displayEntries();

/////////////////////////////////////////////////////////

// Fonction pour mettre à jour le camembert avec les données des émotions
function updateEmotionChart() {
  const emotionsData = {
    labels: ['Furieux', 'Déprimé', 'Indifférent', 'Heureux'],
    datasets: [{
      data: [
        parseInt(localStorage.getItem('Furieux')) || 0,
        parseInt(localStorage.getItem('Déprimé')) || 0,
        parseInt(localStorage.getItem('Indifférent')) || 0,
        parseInt(localStorage.getItem('Heureux')) || 0
      ],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0'
      ]
    }]
  };

  const ctx = document.getElementById('emotionChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: emotionsData
  });

  // Calculer le pourcentage des émotions
  const today = new Date();
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const totalEmotions = emotionsData.datasets[0].data.reduce((a, b) => a + b, 0);
  let percentages = emotionsData.datasets[0].data.map(emotionCount => {
    const percentage = ((emotionCount / totalEmotions) * 100).toFixed(2) + '%';
    return {
      percentage,
      timestamp: today.getTime()
    };
  });

  // Récupérer les entrées d'humeur enregistrées
  const moodEntries = document.getElementById('entries');
  const savedEntries = moodEntries.innerHTML.trim();

  // Vérifier si une entrée a été ajoutée aujourd'hui
  const todayEntry = savedEntries.includes(today.toDateString());

  if (!todayEntry) {
    // Ajouter une nouvelle entrée d'humeur pour aujourd'hui
    const todayEntryHTML = `<div data-timestamp="${today.getTime()}">${today.toDateString()} - ${percentages.map(p => p.percentage).join(' | ')}</div>`;
    moodEntries.innerHTML = todayEntryHTML + savedEntries;
  } else {
    // Mettre à jour l'entrée d'humeur existante pour aujourd'hui
    const updatedEntries = savedEntries.replace(new RegExp(today.toDateString() + '.*'), `${today.toDateString()} - ${percentages.map(p => p.percentage).join(' | ')}`);
    moodEntries.innerHTML = updatedEntries;
  }

  // Supprimer les entrées d'humeur antérieures à aujourd'hui
  const entries = moodEntries.children;
  for (let i = entries.length - 1; i >= 0; i--) {
    const entryTimestamp = parseInt(entries[i].dataset.timestamp);
    if (entryTimestamp < midnight.getTime()) {
      moodEntries.removeChild(entries[i]);
    }
  }
}

