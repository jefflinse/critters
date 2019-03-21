class Creature {

    tick() {
        // PhysicalObject tick should always be last
        // as it depends on modifications to acceleration, etc.
        super.tick();
    }
}

export default Creature;
