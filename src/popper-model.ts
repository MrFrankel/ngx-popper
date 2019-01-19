export type Trigger =
  | 'click'
  | 'mousedown'
  | 'hover'
  | 'none' ;

export class Triggers {
  static CLICK: Trigger = 'click';
  static HOVER: Trigger = 'hover';
  static MOUSEDOWN: Trigger = 'mousedown';
  static NONE: Trigger = 'none';
}

export type Placement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'bottom-start'
  | 'left-start'
  | 'right-start'
  | 'top-end'
  | 'bottom-end'
  | 'left-end'
  | 'right-end'
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | Function

export class Placements {
  static Top: Placement = 'top';
  static Bottom: Placement = 'bottom';
  static Left: Placement = 'left';
  static Right: Placement = 'right';
  static TopStart: Placement = 'top-start';
  static BottomStart: Placement = 'bottom-start';
  static LeftStart: Placement = 'left-start';
  static RightStart: Placement = 'right-start';
  static TopEnd: Placement = 'top-end';
  static BottomEnd: Placement = 'bottom-end';
  static LeftEnd: Placement = 'left-end';
  static RightEnd: Placement = 'right-end';
  static Auto: Placement = 'auto';
  static AutoStart: Placement = 'auto-start';
  static AutoEnd: Placement = 'auto-end';
}

export interface PopperContentOptions {
  showDelay?: number;
  disableAnimation?: boolean;
  disableDefaultStyling?: boolean;
  placement?: Placement;
  boundariesElement?: string;
  trigger?: Trigger;
  positionFixed?: boolean;
  hideOnClickOutside?: boolean;
  hideOnMouseLeave?: boolean;
  hideOnScroll?: boolean;
  popperModifiers?: {};
  ariaRole?: string;
  ariaDescribe?: string;
  applyClass?: string;
  applyArrowClass?: string;
  styles?: Object;
  appendTo?: string;
  preventOverflow?: boolean;
}