// Déclare selectedCards
let selectedCards = [];

// Sauvegarder les sélections dans localStorage
export const saveSelectionsToLocalStorage = (selectedCards) => {
  const selectedCardsArray = Array.from(selectedCards); // Convertir le Set en tableau
  try {
      localStorage.setItem("selectedCards", JSON.stringify(selectedCardsArray)); // Stocker dans localStorage
  } catch (error) {
      console.error("Erreur lors de la sauvegarde des données dans localStorage :", error);
  }
};

// Charger les sélections depuis localStorage
export const loadSelectionsFromLocalStorage = () => {
  try {
      const data = localStorage.getItem("selectedCards"); // Récupérer les données
      if (data) {
          const selectedCardsArray = JSON.parse(data); // Désérialiser les données
          if (Array.isArray(selectedCardsArray)) {
              return new Set(selectedCardsArray); // Convertir en Set
          } else {
              console.warn("Les données de localStorage ne sont pas un tableau valide.");
              return new Set(); // Retourner un Set vide en cas de format invalide
          }
      }
  } catch (error) {
      console.error("Erreur lors du chargement des données depuis localStorage :", error);
  }
  return new Set(); // Retourner un Set vide si aucune donnée n'est trouvée ou en cas d'erreur
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
