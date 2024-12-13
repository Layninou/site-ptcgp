import React from "react";
import './App.css';
import CardManager from "./CardManager";
import { cardList } from './CardData.js';


function App() {
  return (
    <div className="App">
      <h1 className="main-title">Collectionnez-les tous</h1>
      <CardManager cardList={cardList} />
    </div>
  );
}

export default App;