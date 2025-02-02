import React from "react";
import { RovingTabIndexContext } from "./Provider";
import uniqueId from "lodash.uniqueid";
import { onKeyDown, onClick, register, unregister, calcTabIndex } from './common';

type ReturnType = [
  number,
  boolean,
  (event: React.KeyboardEvent<any>) => void,
  () => void
];

// domElementRef:
//   - a React DOM element ref of the DOM element that is the focus target
//   - this must be the same DOM element for the lifecycle of the component
// disabled:
//   - can be updated as appropriate to reflect the current enabled or disabled
//     state of the component
// id:
//   - an optional ID that is the unique ID for the component
//   - if provided then it must be a non-empty string
//   - if not provided then one will be autogenerated
// The returned callbacks handleKeyDown and handleClick are stable.
export default function useRovingTabIndex(
  domElementRef: React.RefObject<any>,
  disabled: boolean,
  isGrid?: boolean,
  id?: string
): ReturnType {
  // This id is stable for the life of the component:
  const tabIndexId = React.useRef(id || uniqueId("roving-tabindex_"));
  const context = React.useContext(RovingTabIndexContext);

  // Registering and unregistering are tied to whether the input is disabled or not.
  // Context is not in the inputs because context.dispatch is stable.
  React.useLayoutEffect(() => {
    register(context, tabIndexId.current, domElementRef, disabled, isGrid);

    return () => {
      unregister(context, tabIndexId.current);
    };
  }, [disabled]);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent<any>) => {
    onKeyDown(event, context, tabIndexId.current, isGrid);
  }, [isGrid]);

  const handleClick = React.useCallback(() => {
    onClick(context, tabIndexId.current);
  }, []);

  const { tabIndex, focused } = calcTabIndex(context, tabIndexId.current, disabled);

  return [tabIndex, focused, handleKeyDown, handleClick];
}
