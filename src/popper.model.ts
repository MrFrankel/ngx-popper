export type Trigger =
  | 'click'
  | 'mousedown'
  | 'hover';

export class Triggers {
  static Click: Trigger = 'click';
  static Hover: Trigger = 'hover';
  static MouseDown: Trigger = 'mousedown';
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
  | 'auto-top'
  | 'auto-bottom'
  | 'auto-left'
  | 'auto-right'
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
static AutoTop: Placement = 'auto-top';
static AutoBottom: Placement = 'auto-bottom';
static AutoLeft: Placement = 'auto-left';
static AutoRight: Placement = 'auto-right';
}