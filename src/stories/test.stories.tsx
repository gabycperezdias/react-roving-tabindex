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
}), true);

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

class TestTd extends React.Component<ICellContentProps> {
  private ref: React.RefObject<HTMLTableCellElement>;

  public constructor(props: object) {
    super(props);

    this.ref = React.createRef<HTMLTableCellElement>();
  }
  public render() {
    const { disabled, children } = this.props;
    return <CellContent ref={this.ref} disabled={disabled} tabindex={disabled ? -1 : 0} role="cell">
      {disabled ? "disabled" : children}
    </CellContent>
  };
}

class Table extends React.Component<object, { tdActive: boolean }> {
  public constructor(props: object) {
    super(props);

    this.state = {
      tdActive: true
    };
  }

  private click = () => {
    this.setState({ tdActive: !this.state.tdActive });
  }

  public render() {
    const { tdActive } = this.state;

    return (
      <React.Fragment>
        <button onClick={this.click}>Click to disable</button>

        <RovingTabIndexProvider>
          <table style={{ 'width': '100%' }}>
            <caption>Table!</caption>
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
                <th>Column 4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TestTd disabled={!tdActive}><span>1 not disabled</span></TestTd>
                <TestTd><span>2</span></TestTd>
                <TestTd disabled={!tdActive}><span>3 not disabled</span></TestTd>
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
      </React.Fragment>
    )
  };
}

storiesOf("Button", module).add("Text", () => (
  <React.Fragment>
    <Table />
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
