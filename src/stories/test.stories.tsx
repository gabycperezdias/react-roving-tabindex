import { uniqueId } from "lodash";
import React from "react";
import { storiesOf } from "@storybook/react";
import { State, Store } from "@sambego/storybook-state";
import { RovingTabIndexProvider, useRovingTabIndex, useFocusEffect, withRovingTabIndex } from "..";
import styled from 'styled-components';

export interface ICellContentProps {
  disabled?: boolean;
  textAlign?: string;
  width?: number;
  type?: string;
}

export interface ICellContentAttrs {
  tabIndex: number | undefined;
  handleKeyDown: (e: Event) => void;
  handleClick: (e: Event) => void;
}

export const CellContent = withRovingTabIndex(styled<ICellContentAttrs & any>('td')((props: ICellContentProps) => {
  const { disabled } = props;
  let disableCss = '';

  if (disabled) {
    disableCss = `pointer-events: none;`;
  }

  return `
    text-align: 'left';
    ${disableCss}
  `;
}), false, true);

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

class TestTd extends React.Component {
  private ref: React.RefObject<HTMLTableCellElement>;

  public constructor(props: object) {
    super(props);

    this.ref = React.createRef<HTMLTableCellElement>();
  }
  public render() {
    return <CellContent ref={this.ref}>
      {this.props.children}
    </CellContent>
  };
}

storiesOf("Button", module).add("Text", () => (
  <React.Fragment>
    <RovingTabIndexProvider>
      <table style={{ 'width': '100%' }}>
        <tbody>
          <tr>
            <TestTd><span>1</span></TestTd>
            <TestTd><span>2</span></TestTd>
            <TestTd><span>3</span></TestTd>
            <TestTd><span>4</span></TestTd>
          </tr>
          <tr>
            <TestTd><span>5</span></TestTd>
            <TestTd><span>6</span></TestTd>
            <TestTd><span>7</span></TestTd>
            <TestTd><span>8</span></TestTd>
          </tr>
          <tr>
            <TestTd><span>9</span></TestTd>
            <TestTd><span>10</span></TestTd>
            <TestTd><span>11</span></TestTd>
            <TestTd><span>12</span></TestTd>
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
