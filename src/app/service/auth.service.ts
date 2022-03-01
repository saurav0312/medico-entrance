import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser
} from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable, switchMap, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MockTest} from '../interface/mockTest';
import { Firestore, addDoc, collectionData, collection, doc, docData, setDoc, updateDoc, arrayUnion, getDocs } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { uploadBytes } from 'firebase/storage';
import { TestReportData } from '../interface/testReportData';
import { arrayRemove, deleteDoc, FieldValue, query, where } from 'firebase/firestore';
import { ProfileService } from './profile.service';
import { ContactRequest } from '../interface/contact-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // mock$ = this.readMockTest();
  realtimeDatabaseUrl = environment.firebase.realtimeDatabaseUrl;

  constructor(
    private auth: Auth,
    private httpClient : HttpClient,
    private router : Router,
    private activatedRoute: ActivatedRoute,
    private firestore: Firestore,
    private storage: Storage,
    private profileService: ProfileService
    ) { 

  }

  createContactRequest(contactFormData: ContactRequest):Observable<any>{
    const docRef = collection(this.firestore, 'ContactRequests'); 
    return from(addDoc(docRef, contactFormData));
  }

  getCurrentUser(): Observable<any>{
    return authState(this.auth)
  }

  // getCurrentUserAccountType(): Observable<string>{
  //   return this.getCurrentUser() pipe(
  //     map(currentUser =>{
  //       // return currentUser.uid
  //       console.log("Current user logged in is : ", currentUser)
  //       let accountType ='';
  //       this.profileService.getUserDetails(currentUser.uid).subscribe(response =>{
  //         accountType = response.accountType
  //         console.log("User acc typee: ",accountType)
  //       })
  //       return accountType
  //     }))
  // }

  // Login a user
  loginUser(loginForm: any) : Observable<any>{
    return from(signInWithEmailAndPassword(this.auth, loginForm.get('email')?.value, loginForm.get('password')?.value)).pipe(
      map((userCredentials) =>{
        console.log("Logged in user: ", userCredentials.user.uid)
        localStorage.setItem('userId',userCredentials.user.uid)
      })
    )
  }

  // Creates a user
  signUpUser(signUpForm : any) : Observable<any>{
    return from(createUserWithEmailAndPassword(this.auth, signUpForm.get('email')?.value, signUpForm.get('password')?.value)).pipe(
      switchMap(({user}) => 
        updateProfile(user, { displayName: signUpForm.get('firstName')?.value })
      )
    )
  }

  //send verification mail
  sendVerificationEmail(user: any) : Observable<any>{
    return from(sendEmailVerification(user))
  }

  //logs out a user
  logout(): Observable<any> {
    return from(this.auth.signOut()).pipe(
      map(() =>{
        localStorage.setItem('userId','')
      })
    );
  }

  //send change password email
  changePassword(changePasswordForm: any) : Observable<any>{
    return from(sendPasswordResetEmail(this.auth, changePasswordForm.get('email')?.value));
  }

  //uploads image for a question.... not used till now
  uploadQuestionImage(image: File, path: string) : Observable<any>{
    const storageReference = ref(this.storage, path)
    const uploadTask = from(uploadBytes(storageReference, image));
    return uploadTask.pipe(
      switchMap( (result) =>getDownloadURL(result.ref) )
    );
  }

  //adds a mock test
  createMockTest(mockTest: MockTest){
    const booksRef = collection(this.firestore, 'MockTests'); 
    return addDoc(booksRef, mockTest);
  }

  //delete specific mock test using test id
  deleteMockTest(testId: string) : Observable<any>{
    const bookRef = doc(this.firestore, `MockTests/${testId}`);
    return from(deleteDoc(bookRef));
  }

  deleteEntryFromSubscriptionCollection(subscriberUserId: string, testIdToDelete: string){
    const docRef = doc(this.firestore, `TestSubscriptionDetails/${subscriberUserId}`)
    updateDoc(docRef,{"allSubscribedTests": arrayRemove(testIdToDelete)})
  }

  // This method reads all mock tests of particular test type ex: free or paid
  readMockTest(testCategory: string, testType?: string): Observable<any>{
    const collectionList = collection(this.firestore, 'MockTests');
    if(testType === undefined){
      const q = query(collectionList, where("testCategory","==", testCategory))
      return collectionData(q, {idField: 'id'})
    }
    const q = query(collectionList, where("testType", "==", testType))
    return collectionData(q,{idField: 'id'})
  }

  //fetch mock test by its id
  getMockTestByID(id: string) {
    const bookRef = doc(this.firestore, `MockTests/${id}`);
    return docData(bookRef) as Observable<MockTest>;
  }

  // This method creates a entry when a student gives a test
  createAllMockTestsGivenByAUser(id: string | undefined, data: any, isYourFirstTest: boolean): Observable<any>{
    const docRef = doc(this.firestore, `IndividualUserTests/${id}`);
    if(isYourFirstTest){
      return from(setDoc(docRef, data, {merge: true}))
    }
    else{
      return from(updateDoc(docRef, {allTests : arrayUnion(data.allTests[0])} ))    
    }
  }
  
  // This method fetches all tests given by a student
  getAllMockTestsGivenByAUser(id: string | undefined) : Observable<TestReportData>{
    const bookRef = doc(this.firestore, `IndividualUserTests/${id}`);
    return docData(bookRef) as Observable<TestReportData>;
  }

  //fetches all tests created by a teacher
  fetchAllMockTestsCreatedByATeacher(teacherUserId: string | undefined) : Observable<any>{
    const collectionList = collection(this.firestore, 'MockTests');
    const q = query(collectionList, where("teacherUserId", "==", teacherUserId))
    return collectionData(q,{idField: 'id'})
  }

  //fetches all users who have subscribed to the current logged in teacher's tests
  fetchAllUserDetailsSubscribedToTeacherTests(testIds: Array<string | undefined>):Observable<any>{
    const collectionList = collection(this.firestore, 'TestSubscriptionDetails');
    const q = query(collectionList, where("allSubscribedTests", "array-contains-any",  testIds))
    return collectionData(q,{idField: 'id'})
  }

  //gets user details based on account type ex: teacher or student
  getUserDetailsByType(type: string):Observable<any>{
    const collectionList = collection(this.firestore, 'UserDetails');
    const q = query(collectionList, where("accountType", "==",  type))
    return collectionData(q,{idField: 'id'})
  }

  //fetches all users who have subscribed to the current logged in teacher's tests
  fetchAllTestsBoughtByThisStudent(studentId: string | undefined):Observable<any>{
    const docRef = doc(this.firestore, `TestSubscriptionDetails/${studentId}`);
    return docData(docRef)
  }

  //sets test finish time in server whenever a student starts a test
  setTestFinishTime(userId: string | undefined, data: any): void{
    const docRef = doc(this.firestore, `TestTime/${userId}`);
    setDoc(docRef, data, {merge: true})
  }

  //fetches test finish time
  getTestFinishTime(userId: string | undefined): Observable<any>{
    const docRef = doc(this.firestore, `TestTime/${userId}`);
    return docData(docRef)
  }

  // remove test finish time after test is finished
  removeTestFinishTime(userId: string | undefined){
    const docRef = doc(this.firestore, `TestTime/${userId}`);
    return from(deleteDoc(docRef));
  }

  //update mock test details
  updateMockTestDetails(testId: string | undefined, testDetail: MockTest): Observable<any>{
    const docRef = doc(this.firestore, `MockTests/${testId}`);
    return from(setDoc(docRef, testDetail, {merge: true}))
  }

  fetchTestsList(testCategory: string): Observable<any>{
    const collectionList = collection(this.firestore, 'MockTests');
    const q = query(collectionList, where("testCategory", "==", testCategory))
    return collectionData(q,{idField: 'id'})
  }
}
