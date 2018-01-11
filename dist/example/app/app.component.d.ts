import { ElementRef, OnInit } from '@angular/core';
import { PopperContent } from '../../src/popper-content';
/**
 * This class represents the main application component.
 */
export declare class AppComponent implements OnInit {
    private elem;
    example3modifiers: {
        flip: {
            behavior: string[];
        };
    };
    example1select: string;
    popper3Content: PopperContent;
    constructor(elem: ElementRef);
    ngOnInit(): void;
    private changeExample1(popperRef);
}
