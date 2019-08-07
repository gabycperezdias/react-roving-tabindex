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
export declare const CellContent: any;
