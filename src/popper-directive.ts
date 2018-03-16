import {
  Directive,
  HostListener,
  ComponentRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter, OnInit, Renderer2, ChangeDetectorRef, Inject
} from '@angular/core';
import {PopperContent} from './popper-content';
import {Placement, Placements, PopperContentOptions, Trigger, Triggers} from './popper.model';

@Directive({
  selector: '[popper]',
  exportAs: 'popper'
})
export class PopperController implements OnInit, OnChanges {
  private popperContentClass = PopperContent;
  private popperContentRef: ComponentRef<PopperContent>;
  private shown: boolean = false;
  private scheduledShowTimeout: any;
  private scheduledHideTimeout: any;
  private subscriptions: any[] = [];
  private globalClick: any;
  private globalScroll: any;
  private popperContent: PopperContent;

  constructor(private viewContainerRef: ViewContainerRef,
              private changeDetectorRef: ChangeDetectorRef,
              private resolver: ComponentFactoryResolver,
              private renderer: Renderer2,
              @Inject('popperDefaults') private popperDefaults: PopperContentOptions = {}) {
    PopperController.baseOptions = {...PopperController.baseOptions, ...this.popperDefaults}
  }

  public static baseOptions: PopperContentOptions = <PopperContentOptions>{
    placement: Placements.Auto,
    hideOnClickOutside: true,
    hideOnMouseLeave: false,
    hideOnScroll: false,
    showTrigger: Triggers.HOVER
  };

  @Input('popper')
  content: string | PopperContent;

  @Input('popperDisabled')
  disabled: boolean;

  @Input('popperPlacement')
  placement: Placement;

  @Input('popperTrigger')
  showTrigger: Trigger | undefined;

  @Input('popperTarget')
  targetElement: HTMLElement;

  @Input('popperDelay')
  showDelay: number = 0;

  @Input('popperTimeout')
  hideTimeout: number = 0;

  @Input('popperTimeoutAfterShow')
  timeoutAfterShow: number = 0;

  @Input('popperBoundaries')
  boundariesElement: string;

  @Input('popperShowOnStart')
  showOnStart: boolean;

  @Input('popperCloseOnClickOutside')
  closeOnClickOutside: boolean;

  @Input('popperHideOnClickOutside')
  hideOnClickOutside: boolean | undefined;

  @Input('popperHideOnScroll')
  hideOnScroll: boolean | undefined;

  @Input('popperHideOnMouseLeave')
  hideOnMouseLeave: boolean | undefined;

  @Input('popperPositionFixed')
  positionFixed: boolean;

  @Input('popperModifiers')
  popperModifiers: {};

  @Input('popperDisableStyle')
  disableStyle: boolean;

  @Input('popperDisableAnimation')
  disableAnimation: boolean;

  @Input('popperForceDetection')
  forceDetection: boolean;

  @Input('popperApplyClass')
  applyClass: string;

  @Output()
  popperOnShown = new EventEmitter<PopperController>();

  @Output()
  popperOnHidden = new EventEmitter<PopperController>();

  @HostListener('touchstart')
  @HostListener('click')
  showOrHideOnClick(): void {
    if (this.disabled || this.showTrigger !== Triggers.CLICK) {
      return;
    }
    this.toggle();
  }

  @HostListener('touchstart')
  @HostListener('mousedown')
  showOrHideOnMouseOver(): void {
    if (this.disabled || this.showTrigger !== Triggers.MOUSEDOWN) {
      return;
    }
    this.toggle();
  }

  @HostListener('mouseenter')
  showOnHover(): void {
    if (this.disabled || this.showTrigger !== Triggers.HOVER) {
      return;
    }
    this.scheduledShow();
  }

  hideOnClickOutsideHandler($event: MouseEvent): void {
    if (this.disabled || !this.hideOnClickOutside) {
      return;
    }
    this.scheduledHide($event, this.hideTimeout);
  }

  hideOnScrollHandler($event: MouseEvent): void {
    if (this.disabled || !this.hideOnScroll) {
      return;
    }
    this.scheduledHide($event, this.hideTimeout);
  }

  @HostListener('touchend')
  @HostListener('touchcancel')
  @HostListener('mouseleave')
  hideOnLeave(): void {
    if (this.disabled || (this.showTrigger !== Triggers.HOVER && !this.hideOnMouseLeave)) {
      return;
    }
    this.scheduledHide(null, this.hideTimeout);
  }

  static assignDefined(target: any, ...sources: any[]) {
    for (const source of sources) {
      for (const key of Object.keys(source)) {
        const val = source[key];
        if (val !== undefined) {
          target[key] = val;
        }
      }
    }
    return target;
  }

  ngOnInit() {
    //Support legacy prop
    this.hideOnClickOutside = typeof this.hideOnClickOutside === 'undefined' ?
      this.closeOnClickOutside : this.hideOnClickOutside;

    if (typeof this.content === 'string') {
      const text = this.content;
      this.popperContent = this.constructContent();
      this.popperContent.text = text;
    }
    else {
      this.popperContent = this.content;
    }
    const popperRef = this.popperContent;
    popperRef.referenceObject = this.getRefElement();
    this.setContentProperties(popperRef);
    this.setDefaults();

    if (this.showOnStart) {
      this.scheduledShow();
    }
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes['popperDisabled'] && changes['popperDisabled'].currentValue) {
      this.hide();
    }
    if (changes['content']
      && !changes['content'].firstChange
      && typeof changes['content'].currentValue === 'string') {
      this.popperContent.text = changes['content'].currentValue;
    }

    if (changes['applyClass']
      && !changes['applyClass'].firstChange
      && typeof changes['applyClass'].currentValue === 'string') {
      this.popperContent.popperOptions.applyClass = changes['applyClass'].currentValue;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe && sub.unsubscribe());
    this.subscriptions.length = 0;
    this.clearEventListeners();
  }

  toggle() {
    this.shown ? this.scheduledHide(null, this.hideTimeout) : this.scheduledShow();
  }

  show() {
    if (this.shown) {
      this.overrideHideTimeout();
      return;
    }

    this.shown = true;
    const popperRef = this.popperContent;
    const element = this.getRefElement();
    if (popperRef.referenceObject !== element) {
      popperRef.referenceObject = element;
    }
    this.setContentProperties(popperRef);
    popperRef.show();
    this.popperOnShown.emit(this);
    if (this.timeoutAfterShow > 0) {
      this.scheduledHide(null, this.timeoutAfterShow);
    }
    this.globalClick = this.renderer.listen('document', 'click', this.hideOnClickOutsideHandler.bind(this));
    this.globalScroll = this.renderer.listen(this.getScrollParent(this.getRefElement()), 'scroll', this.hideOnScrollHandler.bind(this));
  }

  hide() {
    if (!this.shown) {
      this.overrideShowTimeout();
      return;
    }

    this.shown = false;
    if (this.popperContentRef) {
      this.popperContentRef.instance.hide();
    }
    else {
      this.popperContent.hide();
    }
    this.popperOnHidden.emit(this);
    this.clearEventListeners();
  }

  scheduledShow(delay: number = this.showDelay) {
    this.overrideHideTimeout();
    this.scheduledShowTimeout = setTimeout(() => {
      this.show();
      this.applyChanges();
    }, delay)
  }

  scheduledHide($event: any = null, delay: number = 0) {
    this.overrideShowTimeout();
    this.scheduledHideTimeout = setTimeout(() => {
      const toElement = $event ? $event.toElement : null;
      const popperContentView = this.popperContent.popperViewRef ? this.popperContent.popperViewRef.nativeElement : false;
      if (!popperContentView || popperContentView === toElement || popperContentView.contains(toElement) || (this.content as PopperContent).isMouseOver) {
        return;
      }
      this.hide();
      this.applyChanges();
    }, delay)
  }

  getRefElement() {
    return this.targetElement || this.viewContainerRef.element.nativeElement;
  }

  private applyChanges() {
    this.changeDetectorRef.markForCheck();
    if (this.forceDetection) {
      this.changeDetectorRef.detectChanges();
    }
  }

  private setDefaults() {
    this.showTrigger = typeof this.showTrigger === 'undefined' ? PopperController.baseOptions.trigger : this.showTrigger;
    this.hideOnClickOutside = typeof this.hideOnClickOutside === 'undefined' ? PopperController.baseOptions.hideOnClickOutside : this.hideOnClickOutside;
    this.hideOnScroll = typeof this.hideOnScroll === 'undefined' ? PopperController.baseOptions.hideOnScroll : this.hideOnScroll;
    this.hideOnMouseLeave = typeof this.hideOnMouseLeave === 'undefined' ? PopperController.baseOptions.hideOnMouseLeave : this.hideOnMouseLeave;
  }

  private clearEventListeners() {
    this.globalClick && typeof this.globalClick === 'function' && this.globalClick();
    this.globalScroll && typeof this.globalScroll === 'function' && this.globalScroll();
  }

  private overrideShowTimeout() {
    if (this.scheduledShowTimeout) {
      clearTimeout(this.scheduledShowTimeout);
      this.scheduledHideTimeout = 0;
    }
  }

  private overrideHideTimeout() {
    if (this.scheduledHideTimeout) {
      clearTimeout(this.scheduledHideTimeout);
      this.scheduledHideTimeout = 0;
    }
  }

  private constructContent(): PopperContent {
    const factory = this.resolver.resolveComponentFactory(this.popperContentClass);
    this.popperContentRef = this.viewContainerRef.createComponent(factory);
    return this.popperContentRef.instance as PopperContent;
  }

  private setContentProperties(popperRef: PopperContent) {
    popperRef.popperOptions = PopperController.assignDefined(popperRef.popperOptions, PopperController.baseOptions, {
      disableAnimation: this.disableAnimation,
      disableDefaultStyling: this.disableStyle,
      placement: this.placement,
      boundariesElement: this.boundariesElement,
      trigger: this.showTrigger,
      positionFixed: this.positionFixed,
      popperModifiers: this.popperModifiers,
      applyClass: this.applyClass
    });
    this.subscriptions.push(popperRef.onHidden.subscribe(this.hide.bind(this)));
  }

  private getScrollParent(node) {
    const isElement = node instanceof HTMLElement;
    const overflowY = isElement && window.getComputedStyle(node).overflowY;
    const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

    if (!node) {
      return null;
    } else if (isScrollable && node.scrollHeight >= node.clientHeight) {
      return node;
    }

    return this.getScrollParent(node.parentNode) || document;
  }

}