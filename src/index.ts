import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {NgxPopperModule} from './popper.module';

import 'popper.js';
export * from './popper';
export * from './popper.model';
export * from './popper-content';
export * from './popper.module';
platformBrowserDynamic().bootstrapModule(NgxPopperModule);