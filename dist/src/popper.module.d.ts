import { ModuleWithProviders } from "@angular/core";
import { PopperContentOptions } from './popper.model';
export declare class NgxPopperModule {
    ngDoBootstrap(): void;
    static forRoot(popperBaseOptions?: PopperContentOptions): ModuleWithProviders;
}
