import React, { Component } from 'react';
import Simulator from './Simulator';
import Universe from './Universe';

class UniverseView extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const universe = new Universe();
        const simulator = new Simulator(universe);

        this.setState({
            simulator: simulator,
        });
    }

    componentDidMount() {
        this.state.simulator.universe.assignCanvas(this.refs.canvas);
    }

    onCanvasClicked() {
        const ctx = this.refs.canvas.getContext('2d');
        this.state.simulator.toggle();
    }

    render() {
        return (
            <canvas ref="canvas" className="Universe-canvas" onClick={this.onCanvasClicked.bind(this)}></canvas>
        );
    }
}

export default UniverseView;
