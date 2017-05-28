import {Component, ElementRef, OnInit} from '@angular/core';
@Component({
  selector: 'test-comp',
  template: `
    <div>test</div>
  `
})

export class testComponent implements OnInit{

  constructor(private element: ElementRef){

  }

  ngOnInit(){

  }

}