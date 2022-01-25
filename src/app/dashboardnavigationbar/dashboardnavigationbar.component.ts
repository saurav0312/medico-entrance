import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboardnavigationbar',
  templateUrl: './dashboardnavigationbar.component.html',
  styleUrls: ['./dashboardnavigationbar.component.css']
})
export class DashboardnavigationbarComponent implements OnInit {

  constructor(
    private authService :  AuthService,
    private toastrService: ToastrService,
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  logout(): void{
    this.authService.logout().subscribe(response =>{
      this.toastrService.success("Logged Out Successfully")
      this.router.navigateByUrl("/")
    })
  }

  uploadData(event : any): void{
    console.log(event)
    const target: DataTransfer = <DataTransfer>(event.target)
    if(target.files.length !== 1){
      throw new Error("Cannot upload multiple files!")
    }

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
  }

}
