import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-util',
  templateUrl: './footer-util.component.html',
  styleUrls: ['./footer-util.component.scss']
})
export class FooterUtilComponent implements OnInit {

  now:Date = new Date();
  constructor() {
    setInterval(() =>{
      this.now = new Date();
    },1)
   }

  ngOnInit(): void {
  }

}
