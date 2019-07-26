import findIndex from "array-find-index";
import React from "react";
import warning from "warning";

//const DOCUMENT_POSITION_PRECEDING = 2;

type TabStop = {
  id: string;
  domElementRef: React.RefObject<any>;
};

type State = {
  selectedId: string | null;
  lastActionOrigin: "mouse" | "keyboard";
  tabStops: Array<TabStop>;
};

export enum ActionTypes {
  REGISTER = "REGISTER",
  UNREGISTER = "UNREGISTER",
  TAB_TO_PREVIOUS = "TAB_TO_PREVIOUS",
  TAB_TO_NEXT = "TAB_TO_NEXT",
  TAB_TO_PREVIOUS_ROW = "TAB_TO_PREVIOUS_ROW",
  TAB_TO_NEXT_ROW = "TAB_TO_NEXT_ROW",
  TAB_TO_FIRST = "TAB_TO_FIRST",
  TAB_TO_LAST = "TAB_TO_LAST",
  CLICKED = "CLICKED"
}

type Action =
  | {
      type: ActionTypes.REGISTER;
      payload: TabStop;
    }
  | {
      type: ActionTypes.UNREGISTER;
      payload: { id: TabStop["id"] };
    }
  | {
      type: ActionTypes.TAB_TO_PREVIOUS;
      payload: { id: TabStop["id"] };
    }
  | {
      type: ActionTypes.TAB_TO_NEXT;
      payload: { id: TabStop["id"] };
    }
    | {
      type: ActionTypes.TAB_TO_PREVIOUS_ROW;
      payload: { id: TabStop["id"] };
    }
  | {
      type: ActionTypes.TAB_TO_NEXT_ROW;
      payload: { id: TabStop["id"] };
    }
  | {
    type: ActionTypes.TAB_TO_FIRST;
    payload: { id: TabStop["id"] };
  }
  | {
      type: ActionTypes.TAB_TO_LAST;
      payload: { id: TabStop["id"] };
    }
  | {
      type: ActionTypes.CLICKED;
      payload: { id: TabStop["id"] };
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.REGISTER: {
      const newTabStop = action.payload;
      if (state.tabStops.length === 0) {
        return {
          ...state,
          selectedId: newTabStop.id,
          tabStops: [newTabStop]
        };
      }
      const index = findIndex(
        state.tabStops,
        tabStop => tabStop.id === newTabStop.id
      );
      if (index >= 0) {
        warning(false, `${newTabStop.id} tab stop already registered`);
        return state;
      }
      
      return {
        ...state,
        tabStops: [
          ...state.tabStops,
          newTabStop
        ]
      };
    }
    case ActionTypes.UNREGISTER: {
      const id = action.payload.id;
      const tabStops = state.tabStops.filter(tabStop => tabStop.id !== id);
      if (tabStops.length === state.tabStops.length) {
        warning(false, `${id} tab stop already unregistered`);
        return state;
      }
      return {
        ...state,
        selectedId:
          state.selectedId === id
            ? tabStops.length === 0
              ? null
              : tabStops[0].id
            : state.selectedId,
        tabStops
      };
    }
    case ActionTypes.TAB_TO_PREVIOUS:
    case ActionTypes.TAB_TO_NEXT: {
      const id = action.payload.id;
      const index = findIndex(state.tabStops, tabStop => tabStop.id === id);
      if (index === -1) {
        warning(false, `${id} tab stop not registered`);
        return state;
      }
      const newIndex =
        action.type === ActionTypes.TAB_TO_PREVIOUS
          ? index <= 0
            ? state.tabStops.length - 1
            : index - 1
          : index >= state.tabStops.length - 1
          ? 0
          : index + 1;
      return {
        ...state,
        lastActionOrigin: "keyboard",
        selectedId: state.tabStops[newIndex].id
      };
    }
    case ActionTypes.TAB_TO_PREVIOUS_ROW:
    case ActionTypes.TAB_TO_NEXT_ROW: {
      const id = action.payload.id;
      const indexOverall = findIndex(state.tabStops, tabStop => tabStop.id === id);
      const indexInRow = Array.prototype.indexOf.call(state.tabStops[indexOverall].domElementRef.current.parentNode.childNodes,state.tabStops[indexOverall].domElementRef.current);
      const stepToMove = state.tabStops[indexOverall].domElementRef.current.parentNode.childNodes.length;
      
      if (indexOverall === -1) {
        warning(false, `${id} tab stop not registered`);
        return state;
      }
      const newIndex =
        action.type === ActionTypes.TAB_TO_PREVIOUS_ROW ?
          // if first row
          indexOverall - stepToMove < 0 ? 
            (state.tabStops.length) - (stepToMove - indexInRow)
          :  indexOverall - stepToMove
          // if last row  
        : indexOverall + stepToMove > state.tabStops.length -1 ?
            indexInRow
          : indexOverall + stepToMove;

      return {
        ...state,
        lastActionOrigin: "keyboard",
        selectedId: state.tabStops[newIndex].id
      };
    }
    case ActionTypes.TAB_TO_FIRST:
    case ActionTypes.TAB_TO_LAST: {
      const id = action.payload.id;
      const index = findIndex(state.tabStops, tabStop => tabStop.id === id);
      if (index === -1) {
        warning(false, `${id} tab stop not registered`);
        return state;
      }
      const newIndex =
        action.type === ActionTypes.TAB_TO_FIRST
          ? 0 
          : state.tabStops.length - 1;
      return {
        ...state,
        lastActionOrigin: "keyboard",
        selectedId: state.tabStops[newIndex].id
      };
    }
    case ActionTypes.CLICKED: {
      return {
        ...state,
        lastActionOrigin: "mouse",
        selectedId: action.payload.id
      };
    }
    default:
      return state;
  }
}

type Context = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export const RovingTabIndexContext = React.createContext<Context>({
  state: {
    selectedId: null,
    lastActionOrigin: "mouse",
    tabStops: []
  },
  dispatch: () => {}
});

type Props = {
  children: React.ReactNode;
};

const Provider = ({ children }: Props) => {
  const [state, dispatch] = React.useReducer(reducer, {
    selectedId: null,
    lastActionOrigin: "mouse",
    tabStops: []
  });

  const context = React.useMemo<Context>(
    () => ({
      state,
      dispatch
    }),
    [state]
  );

  return (
    <RovingTabIndexContext.Provider value={context}>
      {children}
    </RovingTabIndexContext.Provider>
  );
};

export default Provider;
