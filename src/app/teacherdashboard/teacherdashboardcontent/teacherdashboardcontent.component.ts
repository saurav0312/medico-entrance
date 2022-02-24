import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-teacherdashboardcontent',
  templateUrl: './teacherdashboardcontent.component.html',
  styleUrls: ['./teacherdashboardcontent.component.scss']
})
export class TeacherdashboardcontentComponent implements OnInit {

  loading: boolean = true;
  username : string | null = '';

  constructor(
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.authService.getCurrentUser().subscribe((response:User) =>{
      if(response !== null){
        this.username = response.displayName
        this.loading = false;
      }
    })
  }
}
