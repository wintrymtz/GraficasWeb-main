
export class StateMachine {
    constructor() {
        this.states = {};
        this.currentState = null;
    }

    addState(name, type) {
        this.states[name] = type;
    }

    setState(name) {
        const prevState = this.currentState;
        if (prevState.Name == name) {
            return;
        }
        prevState.Exit();

        const state = new this.states[name](this);
        this.currentState = state;
        state.Enter(prevState);
    }

    Update(timeElapsed, input) {
        if (this.currentState) {
            this.currentState.Update(timeElapsed, input);
        }
    }
}