import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { MessageService } from 'primeng/api';
import { ContactRequest } from 'src/app/interface/contact-request';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-manage-contact-requests',
  templateUrl: './manage-contact-requests.component.html',
  styleUrls: ['./manage-contact-requests.component.css']
})
export class ManageContactRequestsComponent implements OnInit {

  allContactRequests: ContactRequest[] = [];
  loading: boolean = false;

  contactRequestColumns = [
    {field: 'id', header: 'Id'},
    { field: 'name', header: 'Full Name' },
    { field: 'email', header: 'Email' },
    { field: 'message', header: 'Message'},
    { field: 'date', header: 'Date'},
    { field: 'status', header: 'Status'},
    { field: 'action', header: 'Action'}
  ];


  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.authService.getAllContactRequests().subscribe(allContactRequests =>{
      console.log("All contact requests: ", allContactRequests)
      this.allContactRequests = allContactRequests
      this.allContactRequests.sort((a,b) =>{
        if(a.date === b.date){
          return 0
        }
        //latest contact request
        else if(a.date > b.date){
          return -1
        }
        //older contact request
        else{
          return 1
        }
      })
      this.allContactRequests.forEach(contactRequest =>{
        contactRequest.date = (<Timestamp><unknown>contactRequest.date).toDate()
      })
    })
  }

  resolveRequest(contactRequest: ContactRequest, index: number){
    if(contactRequest.status === 'Pending' ){
      contactRequest.status = 'Resolved';
    }
    else{
      contactRequest.status = 'Pending';
    }
    this.authService.updateContactRequestInfo(contactRequest.id, contactRequest.status).subscribe(contactRequestUpdated =>{
      console.log("Contact Request updated: ", contactRequestUpdated)
    })
  }

}
