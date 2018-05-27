import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {NgxPopperModule, Triggers} from '../../dist/ngx-popper.js';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgxPopperModule.forRoot({
      trigger: Triggers.NONE,
      hideOnClickOutside: false
    })],
  declarations: [
    AppComponent],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule {
}