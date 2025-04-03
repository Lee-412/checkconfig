// state/AppReducer.ts

import { AppState } from "./AppState";

type Action =
    | { type: 'INCREMENT' }
    | { type: 'DECREMENT' }
    | { type: 'SET_USER'; payload: { name: string; email: string } }
    | { type: 'SET_AUTH'; payload: boolean };

export default (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'INCREMENT':
            return { ...state, count: state.count + 1 };
        case 'DECREMENT':
            return { ...state, count: state.count - 1 };
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_AUTH':
            return { ...state, isAuthenticated: action.payload };
        default:
            return state;
    }
};
