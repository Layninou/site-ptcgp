import React, { useState } from 'react';
import './CardManager.css';


export const CardManager = ({ cardList }) => {

  /* UseState permettant d'avoir des états variables */
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [selectedFilters, setSelectedFilters] = useState({
    Generations: new Set(),
    Categories: new Set(),
    Boosters: new Set(),
  });

  /* 
  L'objectif de cette constant est de definir si une carte est selectionné ou non
      - Elle prend en input un objet card
  */
  const toggleSelectCard = (card) => {
    //Definition d'une carte - son id + son set + son booster
    const cardIdentifier = `${card.id}-${card.set}-${card.Booster}`;
    //Change/MàJ la selection
    setSelectedCards((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(cardIdentifier)) {
        newSelected.delete(cardIdentifier);
      } else {
        newSelected.add(cardIdentifier);
      }
      return newSelected;
    });
  };

  /**
   * Cette fonction permet de changer les filtres
   * @param {String} type  : Permet de définir le type de filtre appliqué (sera un string)
   * @param {*} value : donne la valeur de ce filtre (ex:card.gen)
   */
  const toggleFilter = (type, value) => {
      //Change la selection via le filtre
      setSelectedFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        const updatedSet = new Set(newFilters[type]);
        if (updatedSet.has(value)) {
          updatedSet.delete(value);
        } else {
          updatedSet.add(value);
        }
        newFilters[type] = updatedSet;
        return newFilters;
      });
  };

  /**
   * permet de definir si une carte doit être visible ou non dans la liste des cartes
   * @param {Object} card
   * @returns un indicateur permettant de définir si oui ou non est visible
   */
  const isCardVisible = (card) => {
    const { Generations, Categories, Boosters } = selectedFilters;

    const generationMatch =
      Generations.size === 0 || Generations.has(card.generation);
    const categoryMatch =
      Categories.size === 0 || Categories.has(card.category);
    const boosterMatch =
      Boosters.size === 0 || Boosters.has(card.Booster);

    return generationMatch && categoryMatch && boosterMatch;
  };

  /**
   * permet de faire un tas de carte avec toutes les cartes lié au même groupe/set
   */
  const groupedBySet = cardList.reduce((groups, card) => {
    if (!groups[card.set]) {
      groups[card.set] = [];
    }
    groups[card.set].push(card);
    return groups;
  }, {});

  /**
   * Analyse les cartes selectionné
   * @returns le nombre de carte selectionné en tris section Set/Generation/Booster
   */
  const analyzeSelection = () => {
    // Comptage des cartes uniques par génération
    const uniqueCardsByGeneration = {};
    const uniqueCardsBySet = {};
    const uniqueCardsByBooster = {};

    selectedCards.forEach((cardId) => {
      const card = cardList.find(
        (c) => `${c.id}-${c.set}-${c.Booster}` === cardId
      );
      if (
        card 
        //&&
        /* card.generation !== null &&
        card.generation !== "-"  &&
        card.generation !== undefined  &&
        card.set !== null &&
        card.set !== undefined &&
        card.set !== "-" */
      ) {
        const { generation, set, Booster, type, pokedex } = card;

        // Comptage par génération
        if (generation !== undefined){
          if (!uniqueCardsByGeneration[generation]) {
            uniqueCardsByGeneration[generation] = new Set();
          }
          uniqueCardsByGeneration[generation].add(pokedex);  
        }
        
        // Comptage par set
        if (!uniqueCardsBySet[set]) {
          uniqueCardsBySet[set] = new Set();
        }
        uniqueCardsBySet[set].add(card.id);

        // Comptage par booster
        if (!uniqueCardsByBooster[Booster]) {
          uniqueCardsByBooster[Booster] = new Set();
        }
        uniqueCardsByBooster[Booster].add(card.id);
      }
    });

    // Calcul des totaux pour chaque catégorie
    // Calcul des totaux pour toutes les cartes disponibles
    const totalByGeneration = {};
    const totalBySet = {};
    const totalByBooster = {};

    cardList.forEach((card) => {
      const { generation, set, Booster } = card;

      // Total par génération
      if (generation !== undefined){
        if (!totalByGeneration[generation]) {
          totalByGeneration[generation] = new Set();
        }
        totalByGeneration[generation].add(card.pokedex);
      }

      // Total par set
      if (!totalBySet[set]) {
        totalBySet[set] = new Set();
      }
      totalBySet[set].add(card.id);

      // Total par booster
      if (!totalByBooster[Booster]) {
        totalByBooster[Booster] = new Set();
      }
      totalByBooster[Booster].add(card.id);
    });

    return {
      byGeneration: Object.entries(uniqueCardsByGeneration).map(
        ([gen, cardList]) => ({ 
          generation: gen, 
          count: cardList.size, 
          total: totalByGeneration[gen]?.size || 0
        })
      ),
      bySet: Object.entries(uniqueCardsBySet).map(([setName, cardList]) => ({
        set: setName,
        count: cardList.size,
        total: totalBySet[setName]?.size || 0
      })),
      byBooster: Object.entries(uniqueCardsByBooster).map(
        ([booster, cardList]) => ({ 
          booster,
          count: cardList.size, 
          total: totalByBooster[booster]?.size || 0
        })
      ),
    };
  };

  const analysis = analyzeSelection();

  return (
    <div>
      <div className="filters">
        {/* <h3>Filtres</h3> */}
        <div className='Generation-filters'>
          <h4>Générations</h4>
          <div className='Generation-filters-container'>
            {[...new Set(cardList.map((card) => card.generation))].map((gen) => (
              <div 
                key={gen}
                onClick={() => toggleFilter('Generations', gen)}
                className={
                  selectedFilters.Generations.has(gen) ? 'selected' : ''
                } 
              >
                Génération {gen}
              </div>
            ))}
          </div>
        </div>
        <div className='Categories-filters'>
          <h4>Catégories</h4>
          <div className='Categories-filters-container'>
            {[...new Set(cardList.map((card) => card.category))].map((cat) => (
              <div
                key={cat}
                onClick={() => toggleFilter('Categories', cat)}
                className={
                  selectedFilters.Categories.has(cat) ? 'selected' : ''
                }
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
        <div className='Boosters-filters'>
          <h4>Boosters</h4>
          <div className='Boosters-filters-container'>
            {[...new Set(cardList.map((card) => card.Booster))].map((booster) => (
              <div
                key={booster}
                onClick={() => toggleFilter('Boosters', booster)}
                className={
                  selectedFilters.Boosters.has(booster) ? 'selected' : ''
                }
              >
                {booster}
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className='main-title'>Analyse des cartes sélectionnées :</h3>
      <div className="analysis">
        <div className='analysis-inside'>
          <h4>Par génération :</h4>
          {analysis.byGeneration.map(({ generation, count, total }) => (
            <p key={generation}>
              Génération {generation} : {count} / {total}
            </p>
          ))}
        </div>
        <div>
          <h4>Par set :</h4>
          {analysis.bySet.map(({ set, count, total }) => (
            <p key={set}>
              Set {set} : {count} / {total}
            </p>
          ))}
        </div>
      </div>
      <div className="analysis-boosters">
        <div>
          <h4>Par Booster :</h4>
          {analysis.byBooster.map(({ booster, count, total }) => (
            <p key={booster}>
              Booster {booster} : {count} / {total}
            </p>
          ))}
        </div>
      </div>

      <div className="card-list">
        {Object.entries(groupedBySet).map(([setName, setCards]) => (
          <div key={setName} className="set-section">
            <h2>{setName}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {setCards
                .filter(isCardVisible)
                .map((card) => {
                  const cardIdentifier = `${card.id}-${card.set}-${card.Booster}`;
                  const isSelected = selectedCards.has(cardIdentifier);

                  return (
                    <div
                      key={cardIdentifier}
                      className={`card-container ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() => toggleSelectCard(card)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={card.src} alt={card.name} />
                      <div className="card-overlay"></div>
                      <p style={{ textAlign: 'center', marginTop: '5px' }}>
                        {card.name}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};


export default CardManager;
