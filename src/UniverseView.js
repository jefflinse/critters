import Config from './Config';
// 'React' needs to be in scope to use JSX
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import Runner from './simulator/Runner';
import Simulation from './simulator/Simulation';
import Universe from './Universe';

class UniverseView extends Component {

    componentWillMount() {
        this.setState({
            config: null,
            runner: null,
        });
    }

    componentDidMount() {
        let canvas = this.refs.canvas;
        let universe = new Universe(canvas);
        let simulation = new Simulation(universe);
        let runner = new Runner(simulation);
        this.setState({ config: Config, runner: runner }, () => {
            this.state.runner.start();
        });
    }

    onCanvasMouseDown() {
        // this.state.runner.pause();
    }

    onCanvasMouseUp() {
        // this.state.runner.pause();
        // this.state.runner.start();
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
