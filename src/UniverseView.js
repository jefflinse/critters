import React, { Component } from 'react';
import Simulator from './Simulator';
import Universe from './Universe';

class UniverseView extends Component {

    componentWillMount() {
        const universe = new Universe();
        const simulator = new Simulator(universe);

        this.setState({
            simulator: simulator,
        });
    }

    componentDidMount() {
        this.refs.canvas.width = window.innerWidth;
        this.refs.canvas.height = window.innerHeight;
        this.state.simulator.universe.assignCanvas(this.refs.canvas);
    }

    onCanvasClicked() {
        this.state.simulator.toggle();
    }

    render() {
        return (
            <canvas ref="canvas"
                className="Universe-canvas"
                onClick={this.onCanvasClicked.bind(this)}>
            </canvas>
        );
    }
}

export default UniverseView;
