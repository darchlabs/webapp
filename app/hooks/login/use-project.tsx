import { useContext } from "react";
import {
  type ProjectState,
  StateContext,
  type ProjectDispatch,
  DispatchContext,
} from "../../providers";

export function useProjectState(): ProjectState {
  const ctx = useContext(StateContext);
  console.log("StateContext: ", StateContext);
  console.log("ctx: ", ctx);
  if (ctx === undefined) {
    throw new Error("state context is not defined");
  }

  return ctx;
}

export function useProjectDispatch(): ProjectDispatch {
  const ctx = useContext(DispatchContext);
  if (ctx === undefined) {
    throw new Error("actions context is not defined");
  }

  return ctx;
}
