# Mon site web pour compter les cartes nécessaire et où les trouver sur Pokemon TCG Pocket

Vous pouvez visiter mon [site](https://layninou.github.io/site-ptcgp/) ici.

## Evolution en cours

- Nouveau Set : le set "Mysthical Island" sera bientôt ajouté aux set possible pour le décompte 
- Ajout d'un décompte pour carte rare et non rare
- Ajout d'un 'localStorage' :
    L'idée serait d'ajouter un storage du type, voir code qui suit.


### Code envisagé pour le local storage
// Fonction pour sauvegarder les sélections dans LocalStorage
const saveSelections = () => {
  localStorage.setItem("selectedCards", JSON.stringify(selectedCards));
};

// Fonction pour charger les sélections depuis LocalStorage
const loadSelections = () => {
  const storedSelections = localStorage.getItem("selectedCards");
  if (storedSelections) {
    selectedCards = JSON.parse(storedSelections); // Met à jour la liste des cartes sélectionnées
  }
};

// Exemple d'intégration dans votre système
document.addEventListener("DOMContentLoaded", () => {
  // Charger les sélections au démarrage
  loadSelections();

  // Mettre à jour l'affichage en fonction des sélections chargées
  updateUI();

  // Événement pour sauvegarder lors d'une sélection ou désélection
  document.querySelectorAll(".card").forEach((cardElement) => {
    cardElement.addEventListener("click", (e) => {
      const cardId = e.target.dataset.cardId;

      // Ajouter ou supprimer la carte des sélections
      if (selectedCards.includes(cardId)) {
        selectedCards = selectedCards.filter((id) => id !== cardId); // Supprimer
      } else {
        selectedCards.push(cardId); // Ajouter
      }

      // Sauvegarder les sélections
      saveSelections();

      // Mettre à jour l'affichage
      updateUI();
    });
  });
});

// Fonction pour mettre à jour l'interface utilisateur (affichage des sélections)
const updateUI = () => {
  document.querySelectorAll(".card").forEach((cardElement) => {
    const cardId = cardElement.dataset.cardId;

    if (selectedCards.includes(cardId)) {
      cardElement.classList.add("selected"); // Ajout d'une classe "selected"
    } else {
      cardElement.classList.remove("selected");
    }
  });
};

## Autre proposition de code pour store les données:
### cookie
// Sauvegarder les sélections dans un cookie
const saveSelectionsToCookie = () => {
  document.cookie = `selectedCards=${JSON.stringify(selectedCards)}; path=/; max-age=31536000`; // 1 an
};

// Charger les sélections depuis un cookie
const loadSelectionsFromCookie = () => {
  const cookies = document.cookie.split("; ");
  const selectedCardsCookie = cookies.find((cookie) =>
    cookie.startsWith("selectedCards=")
  );
  if (selectedCardsCookie) {
    selectedCards = JSON.parse(selectedCardsCookie.split("=")[1]);
  }
};

### API
const saveSelectionsToServer = async () => {
  await fetch("/api/saveSelections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: currentUserId, selectedCards }),
  });
};

const loadSelectionsFromServer = async () => {
  const response = await fetch(`/api/getSelections?userId=${currentUserId}`);
  const data = await response.json();
  selectedCards = data.selectedCards || [];
};
