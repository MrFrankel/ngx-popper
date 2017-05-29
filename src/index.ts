import 'popper.js';
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {PopperController} from './popper';
import {PopperContent} from './popper-content';
export * from './popper';
export * from './popper.model';
export * from './popper-content';

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

}