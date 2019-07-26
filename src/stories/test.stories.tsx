import { uniqueId } from "lodash";
import React from "react";
import { storiesOf } from "@storybook/react";
import { State, Store } from "@sambego/storybook-state";
import { RovingTabIndexProvider, useRovingTabIndex, useFocusEffect } from "..";

const store = new Store({
  active: [true, true, false, true, true]
});

const TestButton = ({
  disabled,
  children,
  onClick
}: {
  disabled: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  const id = React.useRef<string>(uniqueId());
  const ref = React.useRef<HTMLButtonElement>(null);
  const [tabIndex, focused, handleKeyDown, handleClick] = useRovingTabIndex(
    ref,
    disabled
  );
  useFocusEffect(focused, ref);
  return (
    <button
      ref={ref}
      id={id.current}
      onKeyDown={handleKeyDown}
      onClick={() => {
        handleClick();
        onClick();
      }}
      tabIndex={tabIndex}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const TestTd = ({
  children
}: {
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  const id = React.useRef<string>(uniqueId());
  const ref = React.useRef<HTMLTableCellElement>(null);
  const [tabIndex, focused, handleKeyDown] = useRovingTabIndex(
    ref,
    false,
    true
  );
  useFocusEffect(focused, ref);
  return (
    <td
      ref={ref}
      id={id.current}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
    >
      {children}
    </td>
  );
};

storiesOf("Button", module).add("Text", () => (
  <React.Fragment>
    <RovingTabIndexProvider>
      <table style={{'width': '100%'}}>
        <tbody>
          <tr>
            <TestTd>1</TestTd>
            <TestTd>2</TestTd>
            <TestTd>3</TestTd>
            <TestTd>4</TestTd>
          </tr>
          <tr>
            <TestTd>5</TestTd>
            <TestTd>6</TestTd>
            <TestTd>7</TestTd>
            <TestTd>8</TestTd>
          </tr>
          <tr>
            <TestTd>9</TestTd>
            <TestTd>10</TestTd>
            <TestTd>11</TestTd>
            <TestTd>12</TestTd>
          </tr>
        </tbody>
      </table>
    </RovingTabIndexProvider>
    <State store={store}>
      {state => (
        <RovingTabIndexProvider>
          <div>
            <TestButton
              disabled={!state.active[0]}
              onClick={() => window.alert("Button One clicked")}
            >
              Button One
            </TestButton>
            <TestButton
              disabled={!state.active[1]}
              onClick={() => window.alert("Button Two clicked")}
            >
              Button Two
            </TestButton>
            <TestButton
              disabled={!state.active[2]}
              onClick={() => window.alert("Button Three clicked")}
            >
              Button Three
            </TestButton>
            <TestButton
              disabled={!state.active[3]}
              onClick={() => window.alert("Button Four clicked")}
            >
              Button Four
            </TestButton>
            <TestButton
              disabled={!state.active[4]}
              onClick={() => window.alert("Button Five clicked")}
            >
              Button Five
            </TestButton>
          </div>
        </RovingTabIndexProvider>
      )}
    </State>
  </React.Fragment>
));
