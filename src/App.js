import React, { Component } from 'react';
import './App.css';
import './UniverseView.css';
import UniverseView from './UniverseView';

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
}

class App extends Component {

    render() {
        return (
            <div className="App">
                <UniverseView ref="universe" className="Universe"></UniverseView>
            </div>
        );
    }
}

export default App;
