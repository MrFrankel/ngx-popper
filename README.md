# ngx-popper  

ngx-popper is an angular wrapper for the [popperjs](https://popper.js.org/).

### Installation

node and npm are required to run this package.

1. Use npm to install the package

  ```terminal
  $ npm install ngx-popper --save 
  ```

2. You simply add into your module `NgxPopperModule`.

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

3. Add to view

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

4. As text
 ```
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
### Demo
<a href="https://mrfrankel.github.io/ngx-popper/">Demo</a>

### Contribute
 
    terminal
      $ yarn install
      $ npm run dev 
      


