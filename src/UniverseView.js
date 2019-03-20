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
        this.state.simulator.universe.setup(canvas, 30);
    }

    onCanvasClick() {
        this.state.simulator.toggle();
    }

    render() {
        return (
            <canvas ref="canvas"
                className="Universe-canvas"
                width={window.innerWidth}
                height={window.innerHeight}
                onClick={this.onCanvasClick.bind(this)}>
            </canvas>
        );
    }
}

export default UniverseView;
