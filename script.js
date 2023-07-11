// Afficher les entrées d'humeur lors du chargement de la page
displayEntries();

// Fonction pour mettre à jour le graphique d'émotions
function updateEmotionChart() {
  // Récupérer les données des émotions enregistrées dans le stockage local
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const emotionsData = calculateEmotionData(entries);

  // Créer le graphique en camembert avec les données des émotions
  const ctx = document.getElementById("emotionChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: emotionsData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// Fonction pour enregistrer l'humeur sélectionnée par l'utilisateur
function saveMood(mood) {
  const entryDate = new Date().toLocaleDateString();

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

  // Mettre à jour le graphique des émotions
  updateEmotionChart();

  // Mettre à jour l'élément HTML des entrées d'humeur
  displayEntries();
}

// Fonction pour enregistrer l'humeur et actualiser la page
function saveMoodAndUpdatePage(mood) {
  // Enregistrer l'humeur dans le stockage local
  saveMood(mood);

  // Actualiser la page
  location.reload();
}

// Fonction pour calculer les données du graphique d'émotions // Définir le tableau des émotions en tant que constante globale
const emotions = ["Furieux", "Déprimé", "Indifférent", "Heureux"];
function calculateEmotionData(entries) {
  const emotionCounts = [0, 0, 0, 0];

  for (const entry of entries) {
    const index = emotions.indexOf(entry.mood);
    if (index !== -1) {
      emotionCounts[index]++;
    }
  }

  return {
    labels: emotions,
    datasets: [
      {
        data: emotionCounts,
        backgroundColor: [" #ff6666", "	#9a9a9a", "#b3ffb3", " #ffff00"],
      },
    ],
  };
}
// Fonction pour afficher les entrées d'humeur
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
  if (noEntriesElement) {
    noEntriesElement.style.color = "#f5f5f5";
    noEntriesElement.style.textAlign = "center";
    noEntriesElement.style.fontWeight = "bold";
  }
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
window.addEventListener("scroll", function () {
  handleIconScroll();
  handleNavBarDisplay();
});



// Variable pour contrôler le téléchargement en cours
let isDownloading = false;

// Gestion du téléchargement de l'historique
const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", function () {
  downloadHistory();
});

// Fonction pour télécharger l'historique d'humeur
function downloadHistory() {
  // Vérifier si un téléchargement est déjà en cours
  if (isDownloading) {
    return;
  }

  // Définir la variable de contrôle sur true
  isDownloading = true;

  // Désactiver le bouton de téléchargement
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
  let fileContent = "Date\t\t\tHeure\t\tHumeur\n";
  entries.forEach((entry) => {
    fileContent += `${entry.date} ${entry.time}\t${entry.mood}\n`;
  });
  return fileContent;
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
  initializeApp();
});

// Gestion de la notification cloche
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
cloche.addEventListener("click", function (event) {
  event.stopPropagation();

  if (notificationOverlay.style.display === "none") {
    displayNotification();
  } else {
    closeNotification();
  }
});

// Fermeture notification avec la crois
const closeButton = document.querySelector(".close-button");
closeButton.addEventListener("click", function () {
  notificationOverlay.style.display = "none";
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
}

// Mettre à jour le graphique des émotions lors du chargement de la page
updateEmotionChart();

// Ajouter des écouteurs d'événements aux boutons d'humeur
const moodButtons = document.querySelectorAll(".mood-button");
moodButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const selectedMood = event.target.dataset.mood;
    saveMood(selectedMood);
  });
});

// Fonction pour enregistrer l'humeur finale de la journée dans le graphique
function saveDailyMood() {
  const entryDate = new Date().toLocaleDateString();

  // Récupérer l'humeur actuelle du patient
  const currentMood = localStorage.getItem("currentMood");

  // Rechercher une entrée existante avec la même date
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const existingEntryIndex = entries.findIndex(
    (entry) => entry.date === entryDate
  );

  if (existingEntryIndex !== -1) {
    // Remplacer l'entrée existante avec l'humeur actuelle
    entries[existingEntryIndex].mood = currentMood;
  } else {
    // Ajouter une nouvelle entrée
    entries.push({
      date: entryDate,
      mood: currentMood,
    });
  }

  localStorage.setItem("entries", JSON.stringify(entries));

  // Mettre à jour le graphique des émotions
  updateEmotionChart();
}

// Planifier l'enregistrement de l'humeur finale de la journée à minuit
const now = new Date();
const midnight = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() + 1,
  0,
  0,
  0
);
const timeUntilMidnight = midnight.getTime() - now.getTime();
setTimeout(saveDailyMood, timeUntilMidnight);
