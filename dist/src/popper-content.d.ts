import { ElementRef, OnDestroy, EventEmitter, Renderer2 } from "@angular/core";
import Popper from 'popper.js';
import { PopperContentOptions } from './popper.model';
export declare class PopperContent implements OnDestroy {
    private renderer;
    popperOptions: PopperContentOptions;
    referenceObject: HTMLElement;
    isMouseOver: boolean;
    onHidden: EventEmitter<{}>;
    text: string;
    popperInstance: Popper;
    displayType: string;
    opacity: number;
    private globalResize;
    popperViewRef: ElementRef;
    onMouseOver(): void;
    showOnLeave(): void;
    onDocumentResize(): void;
    constructor(renderer: Renderer2);
    ngOnDestroy(): void;
    show(): void;
    update(): void;
    scheduleUpdate(): void;
    hide(): void;
    toggleVisibility(state: boolean): void;
    private clearGlobalResize();
}
