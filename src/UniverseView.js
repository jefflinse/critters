import React, { Component } from 'react';
import Simulator from './simulator/Simulator';
import Universe from './Universe';
import Simulation from './simulator/Simulation';

class UniverseView extends Component {

    componentWillMount() {
        this.setState({
            simulator: null,
        });
    }

    componentDidMount() {
        let canvas = this.refs.canvas;
        let universe = new Universe(canvas);
        let simulation = new Simulation(universe);
        let simulator = new Simulator(simulation);
        this.setState({ simulator: simulator }, () => {
            this.state.simulator.start();
        });
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
