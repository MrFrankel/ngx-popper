# ngx-popper  

[![npm](https://img.shields.io/npm/v/ngx-popper.svg?style=flat-square)](https://www.npmjs.com/package/ngx-popper) 
[![npm](https://img.shields.io/npm/dm/ngx-popper.svg?style=flat-square)](https://www.npmjs.com/package/ngx-popper) 
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/MrFrankel/ngx-popper/blob/master/LICENSE)


ngx-popper is an angular wrapper for the [popperjs](https://popper.js.org/).

### Installation

node and npm are required to run this package.

1. Use npm/yarn to install the package:

  ```terminal
  $ npm install ngx-popper --save 
  ```
  
  Or 
  
   ```terminal
    $ yarn add ngx-popper --save 
  ```

2. You simply add into your module `NgxPopperModule`:

  ```typescript
  import {NgxPopperModule} from 'ngx-popper';
  
  @NgModule({
   // ...
   imports: [
     // ...
     NgxPopperModule
   ]
  })
  ```

3. Add to view:

  ```HTML  
   <div #popper1
            [popper]="popper1Content"
            [popperShowOnstart]="true"
            [popperTrigger]="'click'"
            [popperPlacement]="'bottom'">
         <p class="bold">Hey!</p>
         <p class="thin">Choose where to put your popper!</p>         
       </div>
       <popper-content #popper1Content>
         <p class="bold">Popper on bottom</p>
       </popper-content>
  ```

4. As text:
 ```HTML
<div class="example">
      <div class="rel" id="example5reference1"
           #popper5
           [popper]="'As text'"
           [popperTrigger]="'hover'"
           [popperPlacement]="'bottom'">
        <p class="bold">Pop</p>
        <p class="thin">on the bottom</p>
      </div>
    </div>
 ```
 
5. Attributes map:  
  
    | Options                  | Type             | Default  |
    |:-------------------      |:---------------- |:-------- |
    | popperDisableAnimation   | boolean          | false    |
    | popperDisableStyle       | boolean          | false    |
    | popperDisabled           | boolean          | false    |
    | popperDelay              | number           | 0        |
    | popperTimeout            | number           | 0        |
    | popperPlacement          | Placement(string)| auto     |
    | popperBoundaries         | string(selector) | undefined|  
    | popperShowOnStart        | number           | 0        |                         
    | popperTrigger            | Trigger(string)  | hover    |
    | popperModifiers          | popperModifier   | undefined|
    
6. Override default    
```JavaScript
// Simply override PopperController baseOptions, this will apply to all popper that do not have an attribute set
constructor(private elem: ElementRef) {
    PopperController.baseOptions.disableAnimation = true;
  }
```
    
### Demo
<a href="https://mrfrankel.github.io/ngx-popper/">Demo</a>

### Contribute
 
    terminal
      $ yarn install
      $ npm run dev 
      


