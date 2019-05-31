Critters is a natural selection simulator using neural networks and simple 2D physics.

Latest build: https://jefflinse.github.io/critters

## Overview
The "critters" in the simulation are 2D physical objects whose neural networks take in information from the environment and control the movement and behaviors of their parts. Critters evolve their fitness for the environment over time; the most fit individuals in a generation are cloned (with mutations) to produce the subsequent generation.

## Run

To run locally:

    git clone https://github.com/jefflinse/critters
    cd critters
    npm install
    npm start

## Components

The project is composed of three main components:

### Simulator

The simulator handles the control and general workflow of the simulation. A simulation can be started, paused, stopped, and reset. Each simulation consists of a Universe, Individuals that exist in the Universe, and Generations, which provide the ability for Individuals to evolve over time.

### Neural Network

The neural network component is a lightweight neural network implementation with a focus on the ability to dynamically modify a network.

### Creatures

The creatures component provides Individuals with physical traits, such as Parts and Muscles, that exist in the Universe as simple 2D "physical" objects.

## Roadmap
There is no defined roadmap or schedule for this project. Generally speaking, the project is currently guided by the following:

- Improvements and optimizations to the neural network and simulation code;
- Adding new sensory and motor capabilities to creatures and parts;
- Better looking graphics and interations;
- Adding user controls to configure, customize, and control simulations;
- Adding badly-needed unit tests.

## Contibuting
Critters is largely just a pet project I work on for fun in my free time, but if there's something you're itching to add or fix, please feel free to submit pull requests!
