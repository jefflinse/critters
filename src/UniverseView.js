import React, { Component } from 'react';

class UniverseView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <canvas ref="canvas" className="Universe-canvas"></canvas>
        );
    }
}

export default UniverseView;
