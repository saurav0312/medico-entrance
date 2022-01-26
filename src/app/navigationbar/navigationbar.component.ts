import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.css']
})
export class NavigationbarComponent implements OnInit {

  constructor(
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  loginPage(): void{
    this.router.navigateByUrl("/signin")
  }

  signUpPage(): void{
    this.router.navigateByUrl("/chooseSignUpOption")
  }

}
