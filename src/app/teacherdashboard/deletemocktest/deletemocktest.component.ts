import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { MockTest } from 'src/app/interface/mockTest';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationdialogComponent } from 'src/app/reusableComponents/confirmationdialog/confirmationdialog.component';
import { Router } from '@angular/router';
import { UserToTestIdMapping } from 'src/app/interface/user-to-test-id-mapping';
import { TestsubscriptionService } from 'src/app/service/testsubscription.service';
import { ProfileService } from 'src/app/service/profile.service';
import { MessageService } from 'primeng/api';
import { listAll } from 'firebase/storage';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-deletemocktest',
  templateUrl: './deletemocktest.component.html',
  styleUrls: ['./deletemocktest.component.css']
})
export class DeletemocktestComponent implements OnInit, AfterViewInit {

  @ViewChild('testTable') testTableEle!: any;

  private _allMockTests : Array<MockTest> = [];

  @Input() loading: boolean = false;

  userId: string  ='';

  displayedColumnsForAllTests: string[] = ['no', 'testId', 'testName', 'testTakenBy', 'testCategory' ,'testType', 'totalTime','testPrice','testUploadDate', 'actions'];
 
  displayedColumns = [
    { field: 'id', header: 'Test ID' },
    { field: 'testName', header: 'Test Name' },
    { field: 'testTakenBy', header: 'Test Taken By' },
    { field: 'testCategory', header: 'Test Category' },
    { field: 'testType', header: 'Test Type' },
    { field: 'totalTime', header: 'Total Time' },
    { field: 'testPrice', header: 'Test Price' },
    { field: 'testUploadDate', header: 'Test Upload Date' },
    { field: 'studentList', header: 'Students Who Gave Test' },
    { field: 'actions', header: 'Actions' }
  ];


   @Input()
  set allMockTests(allMockTestsVal : Array< MockTest> ){
    this._allMockTests = allMockTestsVal;
  }

  get allMockTests (): Array< MockTest>{
    return this._allMockTests
  }

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private testSubscriptionService: TestsubscriptionService,
    private profileService: ProfileService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.authService.getCurrentUser().subscribe(currentUser =>{
      this.userId = currentUser.uid
    })
  }

  ngAfterViewInit() {
  }

  deleteMockTest(testId: string){
    const dialogRef = this.dialog.open(ConfirmationdialogComponent);
    dialogRef.afterClosed().subscribe(result =>{
      if(result === true){
        this.loading = true
        let testIdArray = [testId];
        this.testSubscriptionService.getAllStudentsOfATest(testId).subscribe(response =>{
          console.log("All students of the test: ", response)
          if(response.allStudentsOfTheTest.length > 0){
            response.allStudentsOfTheTest.forEach((user:any) =>{
              this.testSubscriptionService.deleteEntryFromSubscriptionCollection(user,testId);
              this.testSubscriptionService.deleteStudentToATest(testId, user)
            })
          }
          this.authService.deleteMockTest(testId).subscribe(response =>{
            this.deleteTestQuestionImages(testId)
          })
        })
      }
    })
  }

  subb!: Observable<any>;

  deleteTestQuestionImages(testId: string){
    this.profileService.listOfTestQuestionImages(this.userId, testId).subscribe(listOfTestQuestionImages =>{
      listOfTestQuestionImages.prefixes.forEach((folderRef:any)=>{
        (from(listAll(folderRef)) as Observable<any>).subscribe(allImagesOfAQuestion =>{
          allImagesOfAQuestion.items.forEach((eachImage:any) =>{
            this.profileService.deleteImage(eachImage.fullPath)
          })
        })
      })
      this.loading =false;
      this.messageService.add({severity:'success', summary:"Test Deleted Successfully"})
    },
    error =>{
      this.loading = false
      this.messageService.add({severity:'error', summary:error.error})
    })
  }

}
