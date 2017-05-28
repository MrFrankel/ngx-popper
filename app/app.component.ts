import {Component, ElementRef, ViewEncapsulation, OnInit, ViewChild} from '@angular/core';
import {PopperContent} from '../../src/popper-content';
import set = Reflect.set;
/**
 * This class represents the main application component.
 */
@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  example3modifiers = {
    flip: {
      behavior: ['right', 'bottom', 'top']
    }
  };
  example1select: string = 'top';
  @ViewChild('popper3Content') popper3Content: PopperContent;

  constructor(private elem: ElementRef) {

  }

  ngOnInit() {
    setInterval(() => {
      this.popper3Content.update();
    }, 10);
  }


  private changeExample1(popperRef: PopperContent) {
    popperRef.hide();
    setTimeout(() => {
      this.elem.nativeElement.querySelector('#example10reference1').dispatchEvent(new Event('click'));
    })

  }

}