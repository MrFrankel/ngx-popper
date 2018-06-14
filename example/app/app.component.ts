import {Component, ElementRef, ViewEncapsulation, OnInit, ViewChild} from '@angular/core';
import {PopperContent} from '../../dist';
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
  @ViewChild('popper3Content') popper3Content: any;

  constructor(private elem: ElementRef) {
  }

  ngOnInit() {
    setInterval(() => {
      this.popper3Content.update();
    }, 10);
  }

  changeExample1(popperRef: PopperContent) {
    setTimeout(() => {
      this.elem.nativeElement.querySelector('#example10reference1').dispatchEvent(new Event('click'));
    }, 100)

  }

}