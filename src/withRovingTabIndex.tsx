import React from 'react';
import { RovingTabIndexContext } from "./Provider";
import uniqueId from "lodash.uniqueid";
import { IUseRovingProps, INewProps } from './types';
import { onKeyDown, onClick, register, unregister, calcTabIndex } from './common';

export const withRovingTabIndex = <OriginalProps extends object>(WrappedComponent: React.ComponentType<OriginalProps>, disabled: boolean = false, isGrid?: boolean) => {
  type HocProps = OriginalProps & IUseRovingProps & INewProps;
  class WithRovingTabIndexElem extends React.Component<OriginalProps & IUseRovingProps> {
    public tabIndexId: string;

    public constructor(props: OriginalProps & IUseRovingProps) {
      super(props);

      // This id is stable for the life of the component:
      this.tabIndexId = props.id || uniqueId("roving-tabindex_");
    }

    // Registering and unregistering are tied to whether the input is disabled or not.
    // Context is not in the inputs because context.dispatch is stable.
    public componentDidMount() {
      const { disabled, domElementRef, context } = this.props;

      register(context, this.tabIndexId, domElementRef, disabled);
    }

    isFocused(props: IUseRovingProps & OriginalProps) {
      const { disabled, context } = props;

      const selected = !disabled && this.tabIndexId === context.state.selectedId;
      const focused = selected && context.state.lastActionOrigin === "keyboard";

      return focused;
    }

    public componentDidUpdate(prevProps: IUseRovingProps & OriginalProps) {
      const { domElementRef } = this.props;
      if (this.isFocused(this.props) && !this.isFocused(prevProps) && domElementRef) {
        (domElementRef.current as any).focus();
      }
    }

    public componentWillUnmount() {
      unregister(this.props.context, this.tabIndexId);
    };

    public handleKeyDown = (event: React.KeyboardEvent<any>): void => {
      const { tabIndexId } = this;
      const { isGrid, context } = this.props;

      onKeyDown(event, context, tabIndexId, isGrid);
    };

    public handleClick = () => {
      const { tabIndexId } = this;
      const { context } = this.props;

      onClick(context, tabIndexId);
    };

    public render() {
      const { tabIndexId, handleKeyDown, handleClick } = this;
      const { context, disabled, domElementRef, ...rest } = this.props;

      const childProps = {
        ...rest,
        ...calcTabIndex(context, tabIndexId, disabled),
        ref: domElementRef,
        onKeyDown: handleKeyDown,
        onClick: handleClick
      };

      return <WrappedComponent {...childProps as OriginalProps & INewProps} />;
    }
  }

  return React.forwardRef<typeof WrappedComponent, OriginalProps>((props, ref) => {
    return <RovingTabIndexContext.Consumer>
      {value => <WithRovingTabIndexElem {...props as HocProps} disabled={disabled} isGrid={isGrid} context={value} domElementRef={ref} />}
    </RovingTabIndexContext.Consumer>;
  });
};