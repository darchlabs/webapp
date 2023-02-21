import { createContext, useReducer, useEffect } from "react";
import { initialState } from "./constant";
import { onboardingReducer } from "./reducer";
import type {
  ProjectDispatch,
  ProjectProviderProps,
  ProjectState,
} from "./type";

// read from local storage or return default initial storage
function getInitialState() {
  const state = localStorage.getItem("state");
  return state ? JSON.parse(state) : initialState;
}

// define contexts
export const StateContext = createContext<ProjectState>({} as ProjectState);
export const DispatchContext = createContext<ProjectDispatch>(
  {} as ProjectDispatch
);

// define provider
export function ProjectProvider({ children }: ProjectProviderProps) {
  // get values from reducer
  const [state, dispatch] = useReducer(onboardingReducer, getInitialState());

  // listen to changes in state and save in local storage
  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
  }, [state]);

  // providers with dispatchers and states
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
}
