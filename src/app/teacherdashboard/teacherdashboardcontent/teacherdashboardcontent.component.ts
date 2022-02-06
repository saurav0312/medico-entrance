import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-teacherdashboardcontent',
  templateUrl: './teacherdashboardcontent.component.html',
  styleUrls: ['./teacherdashboardcontent.component.scss']
})
export class TeacherdashboardcontentComponent implements OnInit {

  constructor(
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
  }
}
