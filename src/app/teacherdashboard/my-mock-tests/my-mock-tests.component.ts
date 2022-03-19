import { Component, OnInit } from '@angular/core';
import { MockTest } from 'src/app/interface/mockTest';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-my-mock-tests',
  templateUrl: './my-mock-tests.component.html',
  styleUrls: ['./my-mock-tests.component.css']
})
export class MyMockTestsComponent implements OnInit {

  loading: boolean = false;

  allTestByTheTeacher: Array<MockTest> = [];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    let sub = this.authService.getCurrentUser().subscribe(response =>{
      if(response !== null){
        this.authService.fetchAllMockTestsCreatedByATeacher(response.uid).subscribe((response:MockTest[]) =>{
          if(response !== null){
            this.allTestByTheTeacher = response
            setTimeout(() =>{
              this.loading = false;
            }, 500)
          }
          else{
            this.loading = false;
          }
        })
      }
      else{
        this.loading = false;
      }
      sub.unsubscribe()
    })
  }

}
