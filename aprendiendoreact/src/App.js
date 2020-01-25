import React from 'react';
import './assets/css/App.css';

// Component
import Peliculas from './components/Peliculas';
import Header from './components/Header';
import Footer from './components/Footer';
import Slider from './components/Slider';
import Sidebar from './components//Sidebar';
import SeccionPrueba from './components/SeccionPruebas';

function App() {
  return (
    <div className="App">
      <Header/>

      <Slider/>

      <SeccionPrueba/>

      <Sidebar/>

      <div class="clearfix"></div>
      
      <Footer/>
    </div>
  );
}

export default App;
