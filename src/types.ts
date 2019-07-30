export type IUseRovingProps = {
  domElementRef: React.RefObject<any>,
  disabled: boolean,
  isGrid?: boolean,
  id?: string,
  context: Context
}

export type INewProps = {
  handleKeyDown: (e: Event) => void;
  handleClick: (e: Event) => void;
  tabIndex: number | undefined;
}

export type TabStop = {
  id: string;
  domElementRef: React.RefObject<any>;
};

export type State = {
  selectedId: string | null;
  lastActionOrigin: "mouse" | "keyboard";
  tabStops: Array<TabStop>;
};

export type Context = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export type Props = {
  children: React.ReactNode | React.ReactNode[];
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

export type Action =
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