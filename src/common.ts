import { ActionTypes, Context } from './types';

export const onKeyDown = (event: React.KeyboardEvent<any>, context: Context, tabIndexId: string, isGrid?: boolean): void => {
  // when it is not a grid, both arrows should move focus backwards
  if (event.key === "ArrowLeft" || (!isGrid && event.key === "ArrowUp")) {
    context.dispatch({
      type: ActionTypes.TAB_TO_PREVIOUS,
      payload: { id: tabIndexId }
    });
    event.preventDefault();
    // when it is not a grid, both arrows should move focus forward
  } else if (event.key === "ArrowRight" || (!isGrid && event.key === "ArrowDown")) {
    context.dispatch({
      type: ActionTypes.TAB_TO_NEXT,
      payload: { id: tabIndexId }
    });
    event.preventDefault();
    // in a grid, should move focus to previous row
  } else if (event.key === "ArrowUp") {
    context.dispatch({
      type: ActionTypes.TAB_TO_PREVIOUS_ROW,
      payload: { id: tabIndexId }
    });
    event.preventDefault();
    // in a grid, should move focus to next row
  } else if (event.key === "ArrowDown") {
    context.dispatch({
      type: ActionTypes.TAB_TO_NEXT_ROW,
      payload: { id: tabIndexId }
    });
    event.preventDefault();
    // should move focus to initial element 
  } else if (event.key === "Home") {
    context.dispatch({
      type: ActionTypes.TAB_TO_FIRST,
      payload: { id: tabIndexId }
    });
    event.preventDefault();
    // should move focus to last element
  } else if (event.key === "End") {
    context.dispatch({
      type: ActionTypes.TAB_TO_LAST,
      payload: { id: tabIndexId }
    });
    event.preventDefault();
  }
}

export const onClick = (context: Context, tabIndexId: string): void => {
  context.dispatch({
    type: ActionTypes.CLICKED,
    payload: { id: tabIndexId }
  });
}

export const register = (context: Context, tabIndexId: string, domElementRef: React.RefObject<any>, disabled: boolean): void => {
  if (disabled) {
    return;
  }
  context.dispatch({
    type: ActionTypes.REGISTER,
    payload: { id: tabIndexId, domElementRef }
  });
}

export const unregister = (context: Context, tabIndexId: string): void => {
  context.dispatch({
    type: ActionTypes.UNREGISTER,
    payload: { id: tabIndexId }
  });
}

export const calcTabIndex = (context: Context, tabIndexId: string, disabled?: boolean): { tabIndex: number, focused: boolean } => {
  const selected = !disabled && tabIndexId === context.state.selectedId;
  const tabIndex = selected ? 0 : -1;
  const focused = selected && context.state.lastActionOrigin === "keyboard";

  return {
    tabIndex: tabIndex,
    focused: focused
  };
}