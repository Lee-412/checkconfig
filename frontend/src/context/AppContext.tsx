// context/AppContext.tsx
import { createContext, useReducer, ReactNode } from 'react';
import AppReducer from '../state/AppReducer';
import { AppState } from '../state/AppState';

interface AppContextProps {
    state: AppState;
    dispatch: React.Dispatch<any>;
}

const initialState: AppState = {
    count: 0,
    user: { name: '', email: '' },
    isAuthenticated: false,
};

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};
