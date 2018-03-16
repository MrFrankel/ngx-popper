import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  EventEmitter,
  HostListener, Renderer2,
} from "@angular/core";
import Popper from 'popper.js';
import {Placements, Triggers, PopperContentOptions} from './popper.model';

@Component({
  selector: "popper-content",
  template: `
    <div #popperViewRef
         [class.ngxp__container]="!popperOptions.disableDefaultStyling"
         [class.ngxp__animation]="!popperOptions.disableAnimation"
         [style.display]="displayType"
         [style.opacity]="opacity"
         [ngClass]="extractAppliedClassListExpr(popperOptions.applyClass)"
         role="popper">
      <div class="ngxp__inner">
        <ng-content></ng-content>
        {{ text }}
      </div>
      <div class="ngxp__arrow"></div>

    </div>
  `,
  styles: [`
    .ngxp__container {
      display: none;
      position: absolute;
      border-radius: 3px;
      border: 1px solid grey;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
      padding: 10px;
    }

    .ngxp__container.ngxp__animation {
      -webkit-animation: ngxp-fadeIn 150ms ease-out;
      -moz-animation: ngxp-fadeIn 150ms ease-out;
      -o-animation: ngxp-fadeIn 150ms ease-out;
      animation: ngxp-fadeIn 150ms ease-out;

    }

    .ngxp__container .ngxp__arrow {
      width: 0;
      height: 0;
      border-style: solid;
      position: absolute;
      margin: 5px;
    }

    .ngxp__container[x-placement^="top"],
    .ngxp__container[x-placement^="bottom"],
    .ngxp__container[x-placement^="right"],
    .ngxp__container[x-placement^="left"] {
      display: block;
    }

    .ngxp__container[x-placement^="top"] {
      margin-bottom: 5px;
    }

    .ngxp__container[x-placement^="top"] .ngxp__arrow {
      border-width: 5px 5px 0 5px;
      border-color: grey transparent transparent transparent;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }

    .ngxp__container[x-placement^="bottom"] {
      margin-top: 5px;
    }

    .ngxp__container[x-placement^="bottom"] .ngxp__arrow {
      border-width: 0 5px 5px 5px;
      border-color: transparent transparent grey transparent;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }

    .ngxp__container[x-placement^="right"] {
      margin-left: 5px;
    }

    .ngxp__container[x-placement^="right"] .ngxp__arrow {
      border-width: 5px 5px 5px 0;
      border-color: transparent grey transparent transparent;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }

    .ngxp__container[x-placement^="left"] {
      margin-right: 5px;
    }

    .ngxp__container[x-placement^="left"] .ngxp__arrow {
      border-width: 5px 0 5px 5px;
      border-color: transparent transparent transparent grey;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }

    @-webkit-keyframes ngxp-fadeIn {
      0% {
        display: none;
        opacity: 0;
      }

      1% {
        display: block;
        opacity: 0;
      }

      100% {
        display: block;
        opacity: 1;
      }
    }

    @keyframes ngxp-fadeIn {
      0% {
        display: none;
        opacity: 0;
      }

      1% {
        display: block;
        opacity: 0;
      }

      100% {
        display: block;
        opacity: 1;
      }
    }
  `]
})
export class PopperContent implements OnDestroy {

  popperOptions: PopperContentOptions = <PopperContentOptions>{
    disableAnimation: false,
    disableDefaultStyling: false,
    placement: Placements.Auto,
    boundariesElement: '',
    trigger: Triggers.HOVER,
    positionFixed: false,
    popperModifiers: {}
  };

  referenceObject: HTMLElement;

  isMouseOver: boolean = false;

  onHidden = new EventEmitter();

  text: string;

  popperInstance: Popper;

  displayType: string = "none";

  opacity: number = 0;

  private globalResize: any;

  @ViewChild("popperViewRef")
  popperViewRef: ElementRef;

  @HostListener('mouseover')
  onMouseOver() {
    this.isMouseOver = true;
  }

  @HostListener('mouseleave')
  showOnLeave() {
    this.isMouseOver = false;
    if (this.popperOptions.trigger !== Triggers.HOVER && !this.popperOptions.hideOnMouseLeave) {
      return;
    }
    this.hide();
  }

  onDocumentResize() {
    this.update();
  }

  constructor(private renderer: Renderer2) {
  }

  ngOnDestroy() {
    if (!this.popperInstance) {
      return;
    }
    (this.popperInstance as any).disableEventListeners();
    this.popperInstance.destroy();

  }

  show(): void {
    if (!this.referenceObject) {
      return;
    }

    let popperOptions: Popper.PopperOptions = <Popper.PopperOptions>{
      placement: this.popperOptions.placement,
      positionFixed: this.popperOptions.positionFixed,
      modifiers: {
        arrow: {
          element: this.popperViewRef.nativeElement.querySelector('.ngxp__arrow')
        }
      }
    };

    let boundariesElement = this.popperOptions.boundariesElement && document.querySelector(this.popperOptions.boundariesElement);

    if (popperOptions.modifiers && boundariesElement) {
      popperOptions.modifiers.preventOverflow = {boundariesElement};
    }

    popperOptions.modifiers = Object.assign(popperOptions.modifiers, this.popperOptions.popperModifiers);

    this.popperInstance = new Popper(
      this.referenceObject,
      this.popperViewRef.nativeElement,
      popperOptions,
    );
    (this.popperInstance as any).enableEventListeners();
    this.scheduleUpdate();
    this.toggleVisibility(true);
    this.globalResize = this.renderer.listen('document', 'resize', this.onDocumentResize.bind(this))
  }

  update(): void {
    this.popperInstance && (this.popperInstance as any).update();
  }

  scheduleUpdate(): void {
    this.popperInstance && (this.popperInstance as any).scheduleUpdate();
  }

  hide(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }
    this.toggleVisibility(false);
    this.onHidden.emit();
  }

  toggleVisibility(state: boolean) {
    if (!state) {
      this.opacity = 0;
      this.displayType = "none";
    }
    else {
      this.opacity = 1;
      this.displayType = "block";
    }
  }

  extractAppliedClassListExpr(classList?: string): Object | null {
    if (!classList || typeof classList !== 'string') {
      return null;
    }
    try {
      return classList
        .replace(/ /, '')
        .split(',')
        .reduce((acc, clss) => {
          acc[clss] = true;
          return acc;
        }, {})
    }
    catch (e) {
      return null;
    }
  }

  private clearGlobalResize() {
    this.globalResize && typeof this.globalResize === 'function' && this.globalResize();
  }

}
