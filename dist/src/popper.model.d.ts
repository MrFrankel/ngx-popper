export declare type Trigger = 'click' | 'mousedown' | 'hover' | 'none';
export declare class Triggers {
    static CLICK: Trigger;
    static HOVER: Trigger;
    static MOUSEDOWN: Trigger;
    static NONE: Trigger;
}
export declare type Placement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'bottom-start' | 'left-start' | 'right-start' | 'top-end' | 'bottom-end' | 'left-end' | 'right-end' | 'auto' | 'auto-top' | 'auto-bottom' | 'auto-left' | 'auto-right' | Function;
export declare class Placements {
    static Top: Placement;
    static Bottom: Placement;
    static Left: Placement;
    static Right: Placement;
    static TopStart: Placement;
    static BottomStart: Placement;
    static LeftStart: Placement;
    static RightStart: Placement;
    static TopEnd: Placement;
    static BottomEnd: Placement;
    static LeftEnd: Placement;
    static RightEnd: Placement;
    static Auto: Placement;
    static AutoTop: Placement;
    static AutoBottom: Placement;
    static AutoLeft: Placement;
    static AutoRight: Placement;
}
export interface PopperContentOptions {
    disableAnimation?: boolean;
    disableDefaultStyling?: boolean;
    placement?: Placement;
    boundariesElement?: string;
    trigger?: Trigger;
    positionFixed?: boolean;
    popperModifiers?: {};
}
