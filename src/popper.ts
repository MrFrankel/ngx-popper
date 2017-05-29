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
  EventEmitter, OnInit
} from '@angular/core';
import {PopperContent} from './popper-content';
import {Placement, Placements, Trigger, Triggers} from './popper.model';

@Directive({
  selector: '[popper]',
  exportAs: 'popper'
})
export class PopperController implements OnInit, OnChanges {
  private popperContentClass = PopperContent;
  private popperContentRef: ComponentRef<PopperContent>;
  private shown: boolean = false;

  constructor(private viewContainerRef: ViewContainerRef,
              private resolver: ComponentFactoryResolver) {
  }

  @Input('popper')
  content: string | PopperContent;

  @Input('popper-disabled')
  disabled: boolean;

  @Input('popper-animation')
  animationClass: string;

  @Input('popper-placement')
  placement: Placement = Placements.Auto;

  @Input('popper-text')
  contentText: string;

  @Input('popper-trigger')
  showTrigger: Trigger;

  @Input('popper-delay')
  showDelay: number = 0;

  @Input('popper-timeout')
  hideTimeout: number = 0;

  @Input('popper-boundaries')
  boundariesElement: string;

  @Input('popper-show-onstart')
  showOnStart: boolean;

  @Input('popper-modifiers')
  popperModifiers: {};

  @Output()
  popperOnShown = new EventEmitter<PopperController>();

  @Output()
  popperOnHidden = new EventEmitter<PopperController>();


  @HostListener('click', ['$event'])
  showOrHideOnClick($event: MouseEvent): void {
    if (this.disabled || this.showTrigger !== Triggers.Click) {
      return;
    }
    $event.stopPropagation();
    this.toggle();
  }
  @HostListener('mousedown', ['$event'])
  showOrHideOnMouseOver($event: MouseEvent): void {
    if (this.disabled || this.showTrigger !== Triggers.MouseDown) {
      return;
    }
    $event.stopPropagation();
    this.toggle();
  }

  @HostListener('mouseenter')
  showOnHover(): void {
    if (this.disabled || this.showTrigger !== Triggers.Hover) {
      return;
    }
    this.scheduledShow();
  }

  @HostListener("document:click", ['$event'])
  hideOnClick($event: MouseEvent): void {
    if (this.disabled || this.showTrigger !== Triggers.Click) {
      return;
    }
    this.scheduledHide($event, 0);
  }

  @HostListener('mouseleave', ['$event'])
  hideOnLeave($event: MouseEvent): void {
    if (this.disabled || this.showTrigger !== Triggers.Hover) {
      return;
    }
    this.scheduledHide($event, 200);
  }

  ngOnInit(){
    if(this.showOnStart){
      this.show();
    }
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes['popperDisabled']) {
      if (changes['popperDisabled'].currentValue) {
        this.hide();
      }
    }
  }

  toggle() {
    this.shown ? this.hide() : this.scheduledShow();
  }

  show() {
    if (this.shown) {
      return;
    }
    this.shown = true;
    const isTextContent = typeof this.content === 'string';
    const popperRef = isTextContent ? this.constructContent() : this.content as PopperContent;
    popperRef.referenceObject = this.getElement();
    if (isTextContent) {
      popperRef.content = this.content as string;
      this.setContentProperties(popperRef);
    } else {
      this.setContentProperties(popperRef);
      popperRef.show();
    }

    this.popperOnShown.emit(this);
  }

  hide() {
    if (!this.shown) {
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
  }

  scheduledShow(delay: number = this.showDelay) {
    setTimeout(() => {
      this.show();
    }, delay)
  }

  scheduledHide($event: MouseEvent, delay: number = 0) {
    setTimeout(() => {
      const toElement = $event.toElement;
      const popperContentView = (this.content as PopperContent).popperViewRef.nativeElement;

      if (popperContentView === toElement || popperContentView.contains(toElement) || (this.content as PopperContent).isMouseOver) {
        return;
      }
      this.hide();
    }, delay)
  }

  getElement() {
    return this.viewContainerRef.element.nativeElement;
  }

  private constructContent(): PopperContent {
    const factory = this.resolver.resolveComponentFactory(this.popperContentClass);
    this.popperContentRef = this.viewContainerRef.createComponent(factory);
    return this.popperContentRef.instance as PopperContent;
  }

  private setContentProperties(popperRef: PopperContent) {
    popperRef.placement = this.placement;
    popperRef.animationClass = this.animationClass;
    popperRef.text = this.contentText;
    popperRef.trigger = this.showTrigger;
    popperRef.boundariesElement = this.boundariesElement;
    popperRef.popperModifiers = this.popperModifiers;
    popperRef.onHidden.subscribe(this.hide.bind(this));
    if (this.hideTimeout > 0)
      setTimeout(this.hide.bind(this), this.hideTimeout);
  }

}