import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {NgxPopperModule} from '../../src/index';
import {testComponent} from './test/test';
import { Draggable } from 'ng2draggable/draggable.directive';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgxPopperModule],
  declarations: [
    testComponent,
    Draggable,
    AppComponent],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule {
}