import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Firestore, addDoc, collectionData, collection, doc, docData, setDoc, updateDoc, arrayUnion, getDocs } from '@angular/fire/firestore';
import { TestSubscription } from '../interface/test-subscription';
import { StudentsOfTest } from '../interface/students-of-test';

@Injectable({
  providedIn: 'root'
})
export class TestsubscriptionService {

  constructor(
    private firestore: Firestore,
  ) { }

  //Create sub collection for a user which contains all subscribed tests by the user
  subscribeToTest(userId: string | undefined, testId: string | undefined){
    const docRef = collection(this.firestore, `TestSubscriptionDetails/${userId}/allSubscribedTests`);
    addDoc(docRef, {testId: testId})
  }

  // This method fetches all tests subscribed by a student
  getAllSubscribedTestsByAUser(userId: string | undefined) : Observable<TestSubscription>{
    const docRef = collection(this.firestore, `TestSubscriptionDetails/${userId}/allSubscribedTests`);
    return collectionData(docRef).pipe(
      map((result:any) => {
        let allSubscribedTests: string[] = [] 
        result.forEach((test:any) =>{
          allSubscribedTests.push(test.testId)
        })
        let testSubscription: TestSubscription ={
          allSubscribedTests: allSubscribedTests
        }
        return testSubscription
      })
    )
  }

  //Create sub collection for a test which contains all students of this test
  addStudentToATest(testId: string | undefined, userId: string | undefined){
    const docRef = collection(this.firestore, `StudentsOfATest/${testId}/allStudentsOfTheTest`);
    addDoc(docRef, {userId: userId})
  }

  // This method fetches all students of a test who have bought this test
  getAllStudentsOfATest(testId: string | undefined) : Observable<StudentsOfTest>{
    const docRef = collection(this.firestore, `StudentsOfATest/${testId}/allStudentsOfTheTest`);
    return collectionData(docRef).pipe(
      map((result:any) => {
        let allStudentsOfTheTest: string[] = [] 
        result.forEach((user:any) =>{
          allStudentsOfTheTest.push(user.userId)
        })
        let studentsOfTest: StudentsOfTest ={
          allStudentsOfTheTest: allStudentsOfTheTest
        }
        return studentsOfTest
      })
    )
  }
}
