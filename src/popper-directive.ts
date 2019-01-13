import {
  Directive,
  ComponentRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  OnDestroy,
  EventEmitter, OnInit, Renderer2, ChangeDetectorRef, Inject, ElementRef
} from '@angular/core';
import {Placement, Placements, PopperContentOptions, Trigger, Triggers} from './popper-model';
import {PopperContent} from './popper-content';

@Directive({
  selector: '[popper]',
  exportAs: 'popper'
})
export class PopperController implements OnInit, OnDestroy, OnChanges {
  private popperContentClass = PopperContent;
  private popperContentRef: ComponentRef<PopperContent>;
  private shown: boolean = false;
  private scheduledShowTimeout: any;
  private scheduledHideTimeout: any;
  private subscriptions: any[] = [];
  private eventListeners: any[] = [];
  private globalEventListeners: any[] = [];
  private popperContent: PopperContent;

  constructor(private viewContainerRef: ViewContainerRef,
              private changeDetectorRef: ChangeDetectorRef,
              private resolver: ComponentFactoryResolver,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              @Inject('popperDefaults') private popperDefaults: PopperContentOptions = {}) {
    PopperController.baseOptions = {...PopperController.baseOptions, ...this.popperDefaults};
  }

  public static baseOptions: PopperContentOptions = <PopperContentOptions>{
    showDelay: 0,
    placement: Placements.Auto,
    hideOnClickOutside: true,
    hideOnMouseLeave: false,
    hideOnScroll: false,
    showTrigger: Triggers.HOVER,
    appendTo: undefined,
    ariaRole: 'popper',
    ariaDescribe: '',
    styles: {}
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
  showDelay: number | undefined;

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

  @Input('popperApplyClass')
  applyClass: string;

  @Input('popperApplyArrowClass')
  applyArrowClass: string;

  @Input('popperAriaDescribeBy')
  ariaDescribe: string | undefined;

  @Input('popperAriaRole')
  ariaRole: string | undefined;

  @Input('popperStyles')
  styles: Object | undefined;

  @Input('popperAppendTo')
  appendTo: string;

  @Output()
  popperOnShown: EventEmitter<PopperController> = new EventEmitter<PopperController>();

  @Output()
  popperOnHidden: EventEmitter<PopperController> = new EventEmitter<PopperController>();

  @Output()
  popperOnUpdate: EventEmitter<any> = new EventEmitter<any>();

  hideOnClickOutsideHandler($event: MouseEvent): void {
    if (this.disabled || !this.hideOnClickOutside || $event.srcElement &&
      $event.srcElement === this.popperContent.elemRef.nativeElement ||
      this.popperContent.elemRef.nativeElement.contains($event.srcElement)) {
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

  applyTriggerListeners() {
    switch (this.showTrigger) {
      case Triggers.CLICK:
        this.eventListeners.push(this.renderer.listen(this.elementRef.nativeElement, 'click', this.toggle.bind(this)));
        break;
      case Triggers.MOUSEDOWN:
        this.eventListeners.push(this.renderer.listen(this.elementRef.nativeElement, 'mousedown', this.toggle.bind(this)));
        break;
      case Triggers.HOVER:
        this.eventListeners.push(this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', this.scheduledShow.bind(this, this.showDelay)));
        this.eventListeners.push(this.renderer.listen(this.elementRef.nativeElement, 'touchend', this.scheduledHide.bind(this, null, this.hideTimeout)));
        this.eventListeners.push(this.renderer.listen(this.elementRef.nativeElement, 'touchcancel', this.scheduledHide.bind(this, null, this.hideTimeout)));
        this.eventListeners.push(this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', this.scheduledHide.bind(this, null, this.hideTimeout)));
        break;
    }
    if (this.showTrigger !== Triggers.HOVER && this.hideOnMouseLeave) {
      this.eventListeners.push(this.renderer.listen(this.elementRef.nativeElement, 'touchend', this.scheduledHide.bind(this, null, this.hideTimeout)));
      this.eventListeners.push(this.renderer.listen(this.elementRef.nativeElement, 'touchcancel', this.scheduledHide.bind(this, null, this.hideTimeout)));
      this.eventListeners.push(this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', this.scheduledHide.bind(this, null, this.hideTimeout)));
    }
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
    this.applyTriggerListeners();
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

    if (changes['applyArrowClass']
      && !changes['applyArrowClass'].firstChange
      && typeof changes['applyArrowClass'].currentValue === 'string') {
      this.popperContent.popperOptions.applyArrowClass = changes['applyArrowClass'].currentValue;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe && sub.unsubscribe());
    this.subscriptions.length = 0;
    this.clearEventListeners();
    this.clearGlobalEventListeners();
    clearTimeout(this.scheduledShowTimeout);
    clearTimeout(this.scheduledHideTimeout);
    this.popperContent && this.popperContent.clean();
  }

  toggle() {
    if (this.disabled) {
      return;
    }
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
    this.globalEventListeners.push(this.renderer.listen('document', 'touchend', this.hideOnClickOutsideHandler.bind(this)));
    this.globalEventListeners.push(this.renderer.listen('document', 'click', this.hideOnClickOutsideHandler.bind(this)));
    this.globalEventListeners.push(this.renderer.listen(this.getScrollParent(this.getRefElement()), 'scroll', this.hideOnScrollHandler.bind(this)));
  }

  hide() {
    if (this.disabled) {
      return;
    }
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
    this.clearGlobalEventListeners();
  }

  scheduledShow(delay: number | undefined = this.showDelay) {
    if (this.disabled) {
      return;
    }
    this.overrideHideTimeout();
    this.scheduledShowTimeout = setTimeout(() => {
      this.show();
      this.applyChanges();
    }, delay)
  }

  scheduledHide($event: any = null, delay: number = this.hideTimeout) {
    if (this.disabled) {
      return;
    }
    this.overrideShowTimeout();
    this.scheduledHideTimeout = setTimeout(() => {
      const toElement = $event ? $event.toElement : null;
      const popperContentView = this.popperContent.popperViewRef ? this.popperContent.popperViewRef.nativeElement : false;
      if (!popperContentView || popperContentView === toElement || popperContentView.contains(toElement) || (this.content as PopperContent).isMouseOver) {
        return;
      }
      this.hide();
      this.applyChanges();
    }, delay);
  }

  getRefElement() {
    return this.targetElement || this.viewContainerRef.element.nativeElement;
  }

  private applyChanges() {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  private setDefaults() {
    this.showDelay = typeof this.showDelay === 'undefined' ? PopperController.baseOptions.showDelay : this.showDelay;
    this.showTrigger = typeof this.showTrigger === 'undefined' ? PopperController.baseOptions.trigger : this.showTrigger;
    this.hideOnClickOutside = typeof this.hideOnClickOutside === 'undefined' ? PopperController.baseOptions.hideOnClickOutside : this.hideOnClickOutside;
    this.hideOnScroll = typeof this.hideOnScroll === 'undefined' ? PopperController.baseOptions.hideOnScroll : this.hideOnScroll;
    this.hideOnMouseLeave = typeof this.hideOnMouseLeave === 'undefined' ? PopperController.baseOptions.hideOnMouseLeave : this.hideOnMouseLeave;
    this.ariaRole = typeof this.ariaRole === 'undefined' ? PopperController.baseOptions.ariaRole : this.ariaRole;
    this.ariaDescribe = typeof this.ariaDescribe === 'undefined' ? PopperController.baseOptions.ariaDescribe : this.ariaDescribe;
    this.styles = typeof this.styles === 'undefined' ? PopperController.baseOptions.styles : this.styles;
  }

  private clearEventListeners() {
    this.eventListeners.forEach(evt => {
      evt && typeof evt === 'function' && evt();
    });
    this.eventListeners.length = 0;
  }

  private clearGlobalEventListeners() {
    this.globalEventListeners.forEach(evt => {
      evt && typeof evt === 'function' && evt();
    });
    this.globalEventListeners.length = 0;
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
      showDelay: this.showDelay,
      disableAnimation: this.disableAnimation,
      disableDefaultStyling: this.disableStyle,
      placement: this.placement,
      boundariesElement: this.boundariesElement,
      trigger: this.showTrigger,
      positionFixed: this.positionFixed,
      popperModifiers: this.popperModifiers,
      ariaDescribe: this.ariaDescribe,
      ariaRole: this.ariaRole,
      applyClass: this.applyClass,
      applyArrowClass: this.applyArrowClass,
      hideOnMouseLeave: this.hideOnMouseLeave,
      styles: this.styles,
      appendTo: this.appendTo
    });
    popperRef.onUpdate = this.onPopperUpdate.bind(this);
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

  private onPopperUpdate(event) {
    this.popperOnUpdate.emit(event);
  }

}
