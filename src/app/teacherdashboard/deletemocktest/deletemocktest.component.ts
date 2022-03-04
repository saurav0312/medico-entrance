import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { MockTest } from 'src/app/interface/mockTest';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationdialogComponent } from 'src/app/reusableComponents/confirmationdialog/confirmationdialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deletemocktest',
  templateUrl: './deletemocktest.component.html',
  styleUrls: ['./deletemocktest.component.css']
})
export class DeletemocktestComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;

  private _dataSource : MatTableDataSource<MockTest> = new MatTableDataSource();

  @Input() loading: boolean = false;

  displayedColumnsForAllTests: string[] = ['no', 'testId', 'testName', 'testTakenBy', 'testCategory' ,'testType', 'totalTime','testPrice', 'actions'];
 
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  @Input()
  set dataSource(dataSourceVal : MatTableDataSource< MockTest> ){
    this._dataSource = dataSourceVal;
  }

  get dataSource (): MatTableDataSource< MockTest>{
    return this._dataSource
  }

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  deleteMockTest(testId: string){
    const dialogRef = this.dialog.open(ConfirmationdialogComponent);
    dialogRef.afterClosed().subscribe(result =>{
      if(result === true){
        this.loading = true
        let testIdArray = [testId];
        this.authService.fetchAllUserDetailsSubscribedToTeacherTests(testIdArray).subscribe(response =>{
          if(response.length > 0){
            response.forEach((user:any) =>{
              this.authService.deleteEntryFromSubscriptionCollection(user['id'],testId);
            })
          }
          this.authService.deleteMockTest(testId).subscribe(response =>{
            this.dataSource.data = this.dataSource.data.filter(test => test.id !== testId)
            this.loading =false;
          })
        })
      }
    })
  }

}
