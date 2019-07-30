/// <reference types="react" />
import { Context } from './types';
export declare const onKeyDown: (event: import("react").KeyboardEvent<any>, context: Context, tabIndexId: string, isGrid?: boolean | undefined) => void;
export declare const onClick: (context: Context, tabIndexId: string) => void;
export declare const register: (context: Context, tabIndexId: string, domElementRef: import("react").RefObject<any>, disabled: boolean) => void;
export declare const unregister: (context: Context, tabIndexId: string) => void;
export declare const calcTabIndex: (context: Context, tabIndexId: string, disabled?: boolean | undefined) => {
    tabIndex: number;
    focused: boolean;
};
