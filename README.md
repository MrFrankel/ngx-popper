# ngx-popper  

[![npm](https://img.shields.io/npm/v/ngx-popper.svg?style=flat-square)](https://www.npmjs.com/package/ngx-popper) 
[![npm](https://img.shields.io/npm/dm/ngx-popper.svg?style=flat-square)](https://www.npmjs.com/package/ngx-popper) 
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/MrFrankel/ngx-popper/blob/master/LICENSE)


ngx-popper is an angular wrapper for the [Popper.js](https://popper.js.org/) library.

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
  
SystemJS 
```
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'libs/'
        },
        // map tells the System loader where to look for things
        map: {
            ... ,
            'ngx-popper': 'npm:ngx-popper',
            'popper-directive.js': 'npm:ngx-popper',
            'popper.module': 'npm:ngx-popper',
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            ... ,
            'ngx-popper': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            'popper.js': {
                main: 'popper-directive.js',
                defaultExtension: 'js'
            },
            'popper.module': {
                main: './popper.module.js',
                defaultExtension: 'js'
            }
        }
    });

```
  

3. Add to view:

  ```HTML  
   <div #popper1
            [popper]="popper1Content"
            [popperShowOnStart]="true"
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
           [popperPlacement]="'bottom'"
           (popperOnShown)="onShown($event)">
        <p class="bold">Pop</p>
        <p class="thin">on the bottom</p>
      </div>
    </div>
 ```
 
  5. Position fixed, breaking overflow:
   ```HTML
  <div class="example">
        <div #popperTargetElement>The popper will show when hovering over this element</div>
        <div>bla bla bla bla</div>
        <div class="rel" id="example5reference1"
             #popper5
             [popper]="'As text'"
             [popperTrigger]="'hover'"
             [popperPlacement]="'bottom'"
             [popperPositionFixed]="true"
             (popperOnShown)="onShown($event)">
          <p class="bold">Pop</p>
          <p class="thin">on the bottom</p>
        </div>
      </div>
   ```
 
 6. Specific target:
  ```HTML
 <div class="example">
       <div #popperTargetElement>The popper will show when hovering over this element</div>
       <div>bla bla bla bla</div>
       <div class="rel" id="example5reference1"
            #popper5
            [popper]="'As text'"
            [popperTrigger]="'hover'"
            [popperPlacement]="'bottom'"
            [popperTarget]="popperTargetElement"
            (popperOnShown)="onShown($event)">
         <p class="bold">Pop</p>
         <p class="thin">on the bottom</p>
       </div>
     </div>
  ```
 
7. Attributes map:  
  
    | Option                   | Type              | Default  |
    |:-------------------      |:----------------  |:-------- |
    | popperDisableAnimation   | boolean           | false    |
    | popperDisableStyle       | boolean           | false    |
    | popperDisabled           | boolean           | false    |
    | popperDelay              | number            | 0        |
    | popperTimeout            | number            | 0        |
    | popperTimeoutAfterShow   | number            | 0        |
    | popperPlacement          | Placement(string) | auto     |
    | popperTarget             | HtmlElement       | auto     |
    | popperBoundaries         | string(selector)  | undefined|  
    | popperShowOnStart        | number            | 0        |                         
    | popperTrigger            | Trigger(string)   | hover    |
    | popperPositionFixed      | boolean           | false    |
    | popperCloseOnClickOutside| boolean           | true     |    
    | popperTrigger            | Trigger(string)   | hover    |
    | popperModifiers          | popperModifier    | undefined|
    | popperOnShown            | EventEmitter<void>| $event   |    
    | popperOnHidden           | EventEmitter<void>| $event   |
    
8. Override default
    Ngx-popper comes with a few default properties you can override in default to effect all instances
    These are overridden by any child attributes.
```JavaScript
NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgxPopperModule.forRoot({placement: 'bottom'})],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]

})
```
  
   | Options                  | Type              | Default  |
   |:-------------------      |:----------------  |:-------- |
   | disableAnimation         | boolean           | false    |
   | disableDefaultStyling    | boolean           | false    |        
   | placement                | Placement(string) | auto     |
   | boundariesElement        | string(selector)  | undefined|  
   | trigger                  | Trigger(string)   | hover    |    
   | popperModifiers          | popperModifier    | undefined|
   | positionFixed            | boolean           | false    |

9. popperPlacement:

  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'bottom-start'
  | 'left-start'
  | 'right-start'
  | 'top-end'
  | 'bottom-end'
  | 'left-end'
  | 'right-end'
  | 'auto'
  | 'auto-top'
  | 'auto-bottom'
  | 'auto-left'
  | 'auto-right'
  | Function
  
10. popperTrigger:

  | 'click'
  | 'mousedown'
  | 'hover'
  | 'none'
  
    
### Demo
<a href="https://mrfrankel.github.io/ngx-popper/">Demo</a>

### Contribute
  Hell ya!!!
  
```terminal
  $ yarn install
  $ npm run dev  
```

