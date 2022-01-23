import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import {AngularFirestoreCollection, CollectionReference, DocumentData} from '@angular/fire/compat/firestore';
import { User } from '../interface/user';

const realtimeDatabaseUrl = environment.firebase.realtimeDatabaseUrl



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSidenav) matSideNav!: MatSidenav;
  
  @Input() users! : User[];

  private userFormCollection! : CollectionReference<DocumentData>;

  constructor(
    private observer: BreakpointObserver,
    private router : Router, 
    private httpClient : HttpClient,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService,
    private firestore: Firestore
    ) {
      
    }
  

  ngOnInit(): void {
    // this.httpClient.get(realtimeDatabaseUrl + "users.json").subscribe((response: any) =>{
    //   console.log(response)
      // this.users = response
      // this.users.forEach(user=>{
      //   console.log(user)
      // })
    //})
    //this.items =  this.firedatabase.list('users').valueChanges();
    const collectionList = collection(this.firestore, 'users');
      collectionData(collectionList).subscribe((response: any) =>{
        this.users = response
        console.log("Collection: ", response)
    })

  }

  ngAfterViewInit(): void {
      // this.observer.observe(['{max-width: 800px}']).subscribe((response) =>{
      //   if(response.matches){
      //     this.matSideNav.mode= 'over'
      //     this.matSideNav.close()
      //   }else{
      //     this.matSideNav.mode='side'
      //     this.matSideNav.open()
      //   }
      // })
  }

  logout(): void{
    this.authService.logout().subscribe(response =>{
      this.toastrService.success("Logged Out Successfully")
      this.router.navigateByUrl("/")
    })
  }

  home(): void{
    this.matSideNav.close();
    this.router.navigateByUrl("/home")
  }

  loginPage(selectedIndex: any): void{
    this.router.navigateByUrl("/login", { state: { selectedIndex: selectedIndex } })
  }
}
