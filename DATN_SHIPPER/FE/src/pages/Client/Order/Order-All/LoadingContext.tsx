import { createContext, useReducer, ReactNode, Dispatch } from 'react';

interface ToggleAction {
    type: 'TOGGLE';
    payload?: boolean;
}

type LoadingAction = ToggleAction;

interface LoadingContextProps {
    isActive: boolean;
    dispatch: Dispatch<LoadingAction>;
}

export const LoadingContext = createContext<LoadingContextProps>({
    isActive: false,
    dispatch: () => null,
});

const loadingReducer = (state: boolean, action: LoadingAction): boolean => {
    switch (action.type) {
        case 'TOGGLE':
            return action.payload !== undefined ? action.payload : !state;
        default:
            return state;
    }
};

const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isActive, dispatch] = useReducer(loadingReducer, false);

    return (
        <LoadingContext.Provider value={{ isActive, dispatch }}>
            {children}
        </LoadingContext.Provider>
    );
};

export default LoadingProvider;
