import React from "react";
declare type ReturnType = [number, boolean, (event: React.KeyboardEvent<any>) => void, () => void];
export default function useRovingTabIndex(domElementRef: React.RefObject<any>, disabled: boolean, isGrid?: boolean, id?: string): ReturnType;
export {};
