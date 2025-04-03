// state/AppState.ts
export interface AppState {
    count: number;
    user: {
        name: string;
        email: string;
    };
    isAuthenticated: boolean;
}
