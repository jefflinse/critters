import React, { Component } from 'react';
import './App.css';
import './UniverseView.css';
import UniverseView from './UniverseView';

class App extends Component {
    componentDidMount() {
        const universe = this.refs.universe;
    }
    render() {
        return (
            <div className="App">
                <UniverseView ref="universe" className="Universe"></UniverseView>
            </div>
        );
    }
}

export default App;
