// Déclare selectedCards
let selectedCards = [];

// Charger les cartes sélectionnées depuis LocalStorage au démarrage
export const loadSelections = () => {
    // Simulez un chargement depuis un stockage local ou une API
    const data = JSON.parse(localStorage.getItem("selectedCards")) || [];
    
    // Assurez-vous que data est un tableau
    if (!Array.isArray(data)) {
      console.error("loadSelections n'a pas renvoyé un tableau : ", data);
      return [];
    }
    return data;
};

selectedCards = loadSelections(); // Réassigne les cartes chargées

// Sauvegarde les sélections dans LocalStorage
export const saveSelections = (selections) => {
  localStorage.setItem("selectedCards", JSON.stringify(selections));
};

// Exemple : Ajouter une carte à la sélection
export const addCardToSelection = (cardId) => {
  if (!selectedCards.includes(cardId)) {
    selectedCards.push(cardId);
    saveSelections(selectedCards); // Sauvegarde immédiatement
  }
};

// Exemple : Supprimer une carte de la sélection
export const removeCardFromSelection = (cardId) => {
  const index = selectedCards.indexOf(cardId);
  if (index > -1) {
    selectedCards.splice(index, 1);
    saveSelections(selectedCards); // Sauvegarde immédiatement
  }
};


// Sauvegarder les sélections dans un cookie
export const saveSelectionsToCookie = (selectedCards) => {
    const selectedCardsArray = Array.from(selectedCards);
    document.cookie = `selectedCards=${JSON.stringify(selectedCardsArray)}; path=/; max-age=31536000`; // 1 an
};

// Charger les sélections depuis un cookie
export const loadSelectionsFromCookie = () => {
    const cookies = document.cookie.split("; ");
    const selectedCardsCookie = cookies.find((cookie) =>
        cookie.startsWith("selectedCards=")
    );
    
    if (selectedCardsCookie) {
        try {
            // On essaie de récupérer et de parser les données
            const selectedCardsArray = JSON.parse(selectedCardsCookie.split("=")[1]);

            // Vérifier si selectedCardsArray est un tableau
            if (Array.isArray(selectedCardsArray)) {
                return new Set(selectedCardsArray); // Convertir en Set
            } else {
                console.warn('Les données du cookie ne sont pas un tableau valide.');
                return new Set(); // Retourner un Set vide si le format est invalide
            }
        } catch (error) {
            console.error('Erreur lors de la désérialisation des données du cookie:', error);
            return new Set(); // Retourner un Set vide en cas d'erreur
        }
    } 
    return new Set(); // Retourner un Set vide si aucun cookie trouvé
    
};
