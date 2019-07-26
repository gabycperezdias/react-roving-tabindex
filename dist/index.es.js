import findIndex from 'array-find-index';
import React from 'react';
import warning from 'warning';
import uniqueId from 'lodash.uniqueid';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var ActionTypes;
(function (ActionTypes) {
    ActionTypes["REGISTER"] = "REGISTER";
    ActionTypes["UNREGISTER"] = "UNREGISTER";
    ActionTypes["TAB_TO_PREVIOUS"] = "TAB_TO_PREVIOUS";
    ActionTypes["TAB_TO_NEXT"] = "TAB_TO_NEXT";
    ActionTypes["TAB_TO_PREVIOUS_ROW"] = "TAB_TO_PREVIOUS_ROW";
    ActionTypes["TAB_TO_NEXT_ROW"] = "TAB_TO_NEXT_ROW";
    ActionTypes["TAB_TO_FIRST"] = "TAB_TO_FIRST";
    ActionTypes["TAB_TO_LAST"] = "TAB_TO_LAST";
    ActionTypes["CLICKED"] = "CLICKED";
})(ActionTypes || (ActionTypes = {}));
function reducer(state, action) {
    switch (action.type) {
        case ActionTypes.REGISTER: {
            var newTabStop_1 = action.payload;
            if (state.tabStops.length === 0) {
                return __assign({}, state, { selectedId: newTabStop_1.id, tabStops: [newTabStop_1] });
            }
            var index = findIndex(state.tabStops, function (tabStop) { return tabStop.id === newTabStop_1.id; });
            if (index >= 0) {
                warning(false, newTabStop_1.id + " tab stop already registered");
                return state;
            }
            return __assign({}, state, { tabStops: state.tabStops.concat([
                    newTabStop_1
                ]) });
        }
        case ActionTypes.UNREGISTER: {
            var id_1 = action.payload.id;
            var tabStops = state.tabStops.filter(function (tabStop) { return tabStop.id !== id_1; });
            if (tabStops.length === state.tabStops.length) {
                warning(false, id_1 + " tab stop already unregistered");
                return state;
            }
            return __assign({}, state, { selectedId: state.selectedId === id_1
                    ? tabStops.length === 0
                        ? null
                        : tabStops[0].id
                    : state.selectedId, tabStops: tabStops });
        }
        case ActionTypes.TAB_TO_PREVIOUS:
        case ActionTypes.TAB_TO_NEXT: {
            var id_2 = action.payload.id;
            var index = findIndex(state.tabStops, function (tabStop) { return tabStop.id === id_2; });
            if (index === -1) {
                warning(false, id_2 + " tab stop not registered");
                return state;
            }
            var newIndex = action.type === ActionTypes.TAB_TO_PREVIOUS
                ? index <= 0
                    ? state.tabStops.length - 1
                    : index - 1
                : index >= state.tabStops.length - 1
                    ? 0
                    : index + 1;
            return __assign({}, state, { lastActionOrigin: "keyboard", selectedId: state.tabStops[newIndex].id });
        }
        case ActionTypes.TAB_TO_PREVIOUS_ROW:
        case ActionTypes.TAB_TO_NEXT_ROW: {
            var id_3 = action.payload.id;
            var indexOverall = findIndex(state.tabStops, function (tabStop) { return tabStop.id === id_3; });
            var indexInRow = Array.prototype.indexOf.call(state.tabStops[indexOverall].domElementRef.current.parentNode.childNodes, state.tabStops[indexOverall].domElementRef.current);
            var stepToMove = state.tabStops[indexOverall].domElementRef.current.parentNode.childNodes.length;
            if (indexOverall === -1) {
                warning(false, id_3 + " tab stop not registered");
                return state;
            }
            var newIndex = action.type === ActionTypes.TAB_TO_PREVIOUS_ROW ?
                // if first row
                indexOverall - stepToMove < 0 ?
                    (state.tabStops.length) - (stepToMove - indexInRow)
                    : indexOverall - stepToMove
                // if last row  
                : indexOverall + stepToMove > state.tabStops.length - 1 ?
                    indexInRow
                    : indexOverall + stepToMove;
            return __assign({}, state, { lastActionOrigin: "keyboard", selectedId: state.tabStops[newIndex].id });
        }
        case ActionTypes.TAB_TO_FIRST:
        case ActionTypes.TAB_TO_LAST: {
            var id_4 = action.payload.id;
            var index = findIndex(state.tabStops, function (tabStop) { return tabStop.id === id_4; });
            if (index === -1) {
                warning(false, id_4 + " tab stop not registered");
                return state;
            }
            var newIndex = action.type === ActionTypes.TAB_TO_FIRST
                ? 0
                : state.tabStops.length - 1;
            return __assign({}, state, { lastActionOrigin: "keyboard", selectedId: state.tabStops[newIndex].id });
        }
        case ActionTypes.CLICKED: {
            return __assign({}, state, { lastActionOrigin: "mouse", selectedId: action.payload.id });
        }
        default:
            return state;
    }
}
var RovingTabIndexContext = React.createContext({
    state: {
        selectedId: null,
        lastActionOrigin: "mouse",
        tabStops: []
    },
    dispatch: function () { }
});
var Provider = function (_a) {
    var children = _a.children;
    var _b = React.useReducer(reducer, {
        selectedId: null,
        lastActionOrigin: "mouse",
        tabStops: []
    }), state = _b[0], dispatch = _b[1];
    var context = React.useMemo(function () { return ({
        state: state,
        dispatch: dispatch
    }); }, [state]);
    return (React.createElement(RovingTabIndexContext.Provider, { value: context }, children));
};

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
function useRovingTabIndex(domElementRef, disabled, isGrid, id) {
    // This id is stable for the life of the component:
    var tabIndexId = React.useRef(id || uniqueId("roving-tabindex_"));
    var context = React.useContext(RovingTabIndexContext);
    // Registering and unregistering are tied to whether the input is disabled or not.
    // Context is not in the inputs because context.dispatch is stable.
    React.useLayoutEffect(function () {
        if (disabled) {
            return;
        }
        context.dispatch({
            type: ActionTypes.REGISTER,
            payload: { id: tabIndexId.current, domElementRef: domElementRef }
        });
        return function () {
            context.dispatch({
                type: ActionTypes.UNREGISTER,
                payload: { id: tabIndexId.current }
            });
        };
    }, [disabled]);
    var handleKeyDown = React.useCallback(function (event) {
        // when it is not a grid, both arrows should move focus backwards
        if (event.key === "ArrowLeft" || (!isGrid && event.key === "ArrowUp")) {
            context.dispatch({
                type: ActionTypes.TAB_TO_PREVIOUS,
                payload: { id: tabIndexId.current }
            });
            event.preventDefault();
            // when it is not a grid, both arrows should move focus forward
        }
        else if (event.key === "ArrowRight" || (!isGrid && event.key === "ArrowDown")) {
            context.dispatch({
                type: ActionTypes.TAB_TO_NEXT,
                payload: { id: tabIndexId.current }
            });
            event.preventDefault();
            // in a grid, should move focus to previous row
        }
        else if (event.key === "ArrowUp") {
            context.dispatch({
                type: ActionTypes.TAB_TO_PREVIOUS_ROW,
                payload: { id: tabIndexId.current }
            });
            event.preventDefault();
            // in a grid, should move focus to next row
        }
        else if (event.key === "ArrowDown") {
            context.dispatch({
                type: ActionTypes.TAB_TO_NEXT_ROW,
                payload: { id: tabIndexId.current }
            });
            event.preventDefault();
            // should move focus to initial element 
        }
        else if (event.key === "Home") {
            context.dispatch({
                type: ActionTypes.TAB_TO_FIRST,
                payload: { id: tabIndexId.current }
            });
            event.preventDefault();
            // should move focus to last element
        }
        else if (event.key === "End") {
            context.dispatch({
                type: ActionTypes.TAB_TO_LAST,
                payload: { id: tabIndexId.current }
            });
            event.preventDefault();
        }
    }, [isGrid]);
    var handleClick = React.useCallback(function () {
        context.dispatch({
            type: ActionTypes.CLICKED,
            payload: { id: tabIndexId.current }
        });
    }, []);
    var selected = !disabled && tabIndexId.current === context.state.selectedId;
    var tabIndex = selected ? 0 : -1;
    var focused = selected && context.state.lastActionOrigin === "keyboard";
    return [tabIndex, focused, handleKeyDown, handleClick];
}

// Invokes focus() on ref as a layout effect whenever focused
// changes from false to true.
function useFocusEffect(focused, ref) {
    React.useLayoutEffect(function () {
        if (focused && ref.current) {
            ref.current.focus();
        }
    }, [focused]);
}

export { Provider as RovingTabIndexProvider, useRovingTabIndex, useFocusEffect };
//# sourceMappingURL=index.es.js.map
