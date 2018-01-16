import {CommonModule} from "@angular/common";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {PopperController} from './popper-directive';
import {PopperContent} from './popper-content';
import {PopperContentOptions} from './popper.model';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PopperController,
    PopperContent
  ],
  exports: [
    PopperController,
    PopperContent
  ],
  entryComponents: [
    PopperContent
  ]
})
export class NgxPopperModule {
  ngDoBootstrap(){}
  public static forRoot(popperBaseOptions: PopperContentOptions = {}): ModuleWithProviders {
    return {ngModule: NgxPopperModule, providers: [{provide: 'popperDefaults', useValue: popperBaseOptions}]};
  }
}