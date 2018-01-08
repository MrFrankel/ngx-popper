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
  EventEmitter, OnInit, Renderer2
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
  private ignoreDocClick: boolean = false;
  private subscriptions: any[] = [];
  private globalClick: any;

  constructor(private viewContainerRef: ViewContainerRef,
              private resolver: ComponentFactoryResolver,
              private renderer: Renderer2) {
  }

  static baseOptions: PopperContentOptions = <PopperContentOptions>{};

  @Input('popper')
  content: string | PopperContent;

  @Input('popperDisabled')
  disabled: boolean;

  @Input('popperPlacement')
  placement: Placement = Placements.Auto;

  @Input('popperTrigger')
  showTrigger: Trigger;

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
  closeOnClickOutside: boolean = true;

  @Input('popperPositionFixed')
  positionFixed: boolean;

  @Input('popperModifiers')
  popperModifiers: {};

  @Input('popperDisableStyle')
  disableStyle: boolean;

  @Input('popperDisableAnimation')
  disableAnimation: boolean;

  @Output()
  popperOnShown = new EventEmitter<PopperController>();

  @Output()
  popperOnHidden = new EventEmitter<PopperController>();

  @HostListener('touchstart', ['$event'])
  @HostListener('click', ['$event'])
  showOrHideOnClick($event: MouseEvent): void {
    if (this.disabled || this.showTrigger !== Triggers.CLICK) {
      return;
    }
    debugger;
    this.toggle();
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  showOrHideOnMouseOver($event: MouseEvent): void {
    if (this.disabled || this.showTrigger !== Triggers.MOUSEDOWN) {
      return;
    }
    this.toggle();
  }


  @HostListener('mouseenter', ['$event'])
  showOnHover(): void {
    if (this.disabled || this.showTrigger !== Triggers.HOVER) {
      return;
    }
    this.scheduledShow();
  }

  hideOnClickOutside($event: MouseEvent): void {
    if (this.disabled || !this.closeOnClickOutside) {
      return;
    }
    this.scheduledHide($event, this.hideTimeout);
  }

  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  @HostListener('mouseleave', ['$event'])
  hideOnLeave($event: MouseEvent): void {
    if (this.disabled || this.showTrigger !== Triggers.HOVER) {
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
    if (typeof this.content === 'string') {
      const text = this.content;
      this.content = this.constructContent();
      this.content.text = text;
    }
    const popperRef = this.content as PopperContent;
    popperRef.referenceObject = this.getRefElement();
    this.setContentProperties(popperRef);

    if (this.showOnStart) {
      this.scheduledShow();
    }
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes['popperDisabled']) {
      if (changes['popperDisabled'].currentValue) {
        this.hide();
      }
    }
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub => sub.unsubscribe && sub.unsubscribe());
    this.subscriptions.length = 0;
    this.clearGlobalClick();
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
    const popperRef = this.content as PopperContent;
    const element = this.getRefElement();
    if(popperRef.referenceObject !== element){
      popperRef.referenceObject = element;
    }
    popperRef.show();
    this.popperOnShown.emit(this);
    if(this.timeoutAfterShow > 0){
      this.scheduledHide(null, this.timeoutAfterShow);
    }
    this.globalClick = this.renderer.listen('document', 'click', this.hideOnClickOutside.bind(this))
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
      (this.content as PopperContent).hide();
    }
    this.popperOnHidden.emit(this);
    this.clearGlobalClick();
  }

  scheduledShow(delay: number = this.showDelay) {
    this.overrideHideTimeout();
    this.scheduledShowTimeout = setTimeout(() => {
      this.show();
    }, delay)
  }

  scheduledHide($event: any = null, delay: number = 0) {
    this.overrideShowTimeout();
    this.scheduledHideTimeout = setTimeout(() => {
      const toElement = $event ? $event.toElement : null;
      const popperContentView = (this.content as PopperContent).popperViewRef ? (this.content as PopperContent).popperViewRef.nativeElement : false;
      if (!popperContentView || popperContentView === toElement || popperContentView.contains(toElement) || (this.content as PopperContent).isMouseOver) {
        return;
      }
      this.hide();
    }, delay)
  }

  getRefElement() {
    return this.targetElement || this.viewContainerRef.element.nativeElement;
  }

  private clearGlobalClick(){
    this.globalClick && typeof this.globalClick === 'function' && this.globalClick();
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
    });
    this.subscriptions.push(popperRef.onHidden.subscribe(this.hide.bind(this)));
  }

}