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
  const now = new Date();
  const entryDate = now.toLocaleDateString("fr-FR");
  const entryTime = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
      time: entryTime,
      mood: mood,
    });
  }

  localStorage.setItem("entries", JSON.stringify(entries));

  localStorage.setItem("currentMood", mood);
  localStorage.setItem("currentMoodTime", entryTime);

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

// Fonction pour calculer les données du graphique d'émotions
const emotions = ["Furieux", "Déprimé", "Indifférent", "Heureux", "Fatigué"];
function calculateEmotionData(entries) {
  const emotionCounts = [0, 0, 0, 0, 0];

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
        backgroundColor: [
          "#ff0000",
          "#1a1a1a",
          "#f5f5dc",
          "#ffff00",
          "#ef58ef",
        ],
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

// Fonction pour obtenir l'heure actuelle au format HH:mm
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
// Fonction pour générer le code HTML d'une entrée d'humeur
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



// Variable pour contrôler le téléchargement en cours
let isDownloading = false;

// Gestion du téléchargement de l'historique
const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", function () {
  downloadHistory();
});

// Fonction pour télécharger l'historique d'humeur
function downloadHistory() {
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const patientName = localStorage.getItem("patientFullName");
  const currentDate = new Date().toISOString().split("T")[0];
  const fileName = `historique_humeur_${patientName}_${currentDate}.html`;

  // Ajouter le nom du patient à chaque entrée
  entries.forEach((entry) => {
    entry.name = patientName;
  });

  // Création du contenu du fichier
  const fileContent = generateHistoryContent(entries);

  // Création du fichier à télécharger
  const fileBlob = new Blob([fileContent], {
    type: "text/plain;charset=utf-8",
  }); // Ajout de l'encodage UTF-8
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(fileBlob);
  downloadLink.download = fileName;
  downloadLink.click();
}

function generateHistoryContent(entries) {
  const patientName = localStorage.getItem("patientFullName"); // Récupérer le nom complet du patient
  let fileContent = `<table style="border: solid 2px black;  max-width: 768px; display: flex; align-items: center;     justify-content: space-around; flex-direction: colum;   overflow-y: hidden;   margin: 0;
  padding: 0;
  box-sizing: border-box;"><tr><th>Date</th><th>Humeur</th><th>Nom du patient</th></tr>`;

  entries.forEach((entry) => {
    fileContent += `<tr><td>${entry.date}</td><td>${entry.mood}</td><td>${patientName}</td></tr>`;
  });

  fileContent += "</table>";
  return fileContent;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fonction pour initialiser l'application
function initializeApp() {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value; // Récupérer le nom complet du patient
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("patientFullName", fullName); // Enregistrer le nom complet dans le stockage local

    window.location.href = "portail.html";
  });
}

// Fonction pour initialiser l'application du portail patient
function initializePatientApp() {
  // Appel de la fonction pour afficher le nom d'utilisateur
  displayUsername();
}

// Fonction pour afficher le nom d'utilisateur dans le portail du patient
function displayUsername() {
  const fullName = localStorage.getItem("patientFullName");
  if (fullName) {
    const nameElement = document.querySelector(".name");
    nameElement.textContent = fullName;
  }
}

// Appel des fonctions d'initialisation
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  initializePatientApp();
});

//////////////////////////////////////////////////////////////////////////////////////

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
// Photo de profil
// Récupérer les éléments du DOM
const profilePicture = document.getElementById("profilePicture");
const profilePictureInput = document.getElementById("profilePictureInput");

// Ajouter un gestionnaire d'événement au champ de saisie de fichier
profilePictureInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      profilePicture.src = imageUrl;
      // Vous pouvez enregistrer l'URL de l'image dans le stockage local ou l'envoyer au serveur pour le traitement ultérieur.
      localStorage.setItem("profilePictureUrl", imageUrl);
    };
    reader.readAsDataURL(file);
  }
});

// Chargement de l'image de profil depuis le stockage local lors du chargement de la page
window.addEventListener("DOMContentLoaded", function () {
  const profilePictureUrl = localStorage.getItem("profilePictureUrl");

  if (profilePictureUrl) {
    // Affichage de l'image dans l'élément img
    profilePicture.src = profilePictureUrl;
  }
});

// Gestionnaire d'événement avant la fermeture de la fenêtre
window.addEventListener("beforeunload", function () {
  // Récupération de l'URL de la photo de profil
  const profilePictureUrl = localStorage.getItem("profilePictureUrl");

  if (profilePictureUrl) {
    // Révocation de l'URL pour libérer les ressources du navigateur
    URL.revokeObjectURL(profilePictureUrl);
  }
});
// end Photo de profil

// Fonction pour réinitialiser les données après un mois
function resetDataAfterMonth() {
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  const currentDate = new Date();

  // Récupérer la date d'il y a un mois
  const oneMonthAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    currentDate.getDate()
  );

  // Filtrer les entrées antérieures à un mois
  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= oneMonthAgo;
  });

  // Enregistrer les entrées filtrées dans le stockage local
  localStorage.setItem("entries", JSON.stringify(filteredEntries));
}

// Appel de la fonction pour réinitialiser les données après un mois
resetDataAfterMonth();


