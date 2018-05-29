import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {NgxPopperModule, Triggers} from '../../dist/ngx-popper.js';
import {Draggable} from 'ng2draggable/draggable.directive';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgxPopperModule.forRoot({
      trigger: Triggers.CLICK,
      hideOnClickOutside: false
    })],
  declarations: [
    Draggable,
    AppComponent],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule {
}