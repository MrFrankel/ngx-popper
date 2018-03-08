import 'zone.js';
import 'reflect-metadata';
import '@angular/common';
import '@angular/compiler';
import '@angular/core';
import '@angular/forms';
import '@angular/platform-browser-dynamic';
import '@angular/platform-browser';
import 'rxjs';

import { enableProdMode } from '@angular/core';
// The browser platform with a compiler
//import {platformBrowser} from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// The app module
import { AppModule } from './app.module';

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
