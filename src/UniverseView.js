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
        let canvas = this.refs.canvas;
        this.state.simulator.universe.setup(canvas, 1);
        this.state.simulator.start();
    }

    onCanvasMouseDown() {
        // this.state.simulator.pause();
    }

    onCanvasMouseUp() {
        // this.state.simulator.pause();
        // this.state.simulator.start();
    }

    render() {
        return (
            <canvas ref="canvas"
                className="Universe-canvas"
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={this.onCanvasMouseDown.bind(this)}
                onMouseUp={this.onCanvasMouseUp.bind(this)}>
            </canvas>
        );
    }
}

export default UniverseView;
