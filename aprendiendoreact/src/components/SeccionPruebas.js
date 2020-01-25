import React, { Component } from 'react';

//Components
import Peliculas from './Peliculas';

class SeccionPrueba extends Component {
    render(){
        return(
            <section id="content">
                <h2 className="subheader">Ultimos Articulos</h2>
                <Peliculas/>

            </section>
        )
    }
}

export default SeccionPrueba;