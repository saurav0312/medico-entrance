import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homenavigationbar',
  templateUrl: './homenavigationbar.component.html',
  styleUrls: ['./homenavigationbar.component.css']
})
export class HomenavigationbarComponent implements OnInit {

  navOpen: boolean = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  toggleNavBar(){
    this.navOpen = !this.navOpen;
  }

}
