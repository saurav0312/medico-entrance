import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { MockTest } from 'src/app/interface/mockTest';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Tests } from '../../interface/tests';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationdialogComponent } from 'src/app/reusableComponents/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'app-deletemocktest',
  templateUrl: './deletemocktest.component.html',
  styleUrls: ['./deletemocktest.component.css']
})
export class DeletemocktestComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;

  loading: boolean = false;

  displayedColumnsForAllTests: string[] = ['no', 'testId', 'testName', 'testTakenBy', 'testType', 'totalTime','testPrice', 'actions'];
  dataSource: MatTableDataSource<MockTest> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading = true;
    let sub = this.authService.getCurrentUser().subscribe(response =>{
      if(response !== null){
        this.authService.fetchAllMockTestsCreatedByATeacher(response.uid).subscribe((response:MockTest[]) =>{
          console.log("tests by a teacher to be deleted: ", response)
          if(response !== null){
            this.dataSource.data = response;
            this.dataSource.paginator = this.paginator
            this.loading = false;
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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  deleteMockTest(testId: string){
    const dialogRef = this.dialog.open(ConfirmationdialogComponent);
    dialogRef.afterClosed().subscribe(result =>{
      console.log("Dialog result: ", result)
      if(result === true){
        this.authService.deleteMockTest(testId).subscribe(response =>{
          console.log("Test deleted: ", response)
        })
      }
    })
  }

}
