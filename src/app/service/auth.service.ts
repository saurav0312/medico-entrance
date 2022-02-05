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
import { from, Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MockTest} from '../interface/mockTest';
import { Firestore, addDoc, collectionData, collection, doc, docData, setDoc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { uploadBytes } from 'firebase/storage';
import { TestReportData } from '../interface/testReportData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$ = authState(this.auth);
  mock$ = this.readMockTest();
  realtimeDatabaseUrl = environment.firebase.realtimeDatabaseUrl;

  constructor(
    private auth: Auth,
    private httpClient : HttpClient,
    private router : Router,
    private activatedRoute: ActivatedRoute,
    private firestore: Firestore,
    private storage: Storage
    ) { }

  loginUser(loginForm: any) : Observable<any>{
    return from(signInWithEmailAndPassword(this.auth, loginForm.get('email')?.value, loginForm.get('password')?.value))
  }

  signUpUser(signUpForm : any) : Observable<any>{
    return from(createUserWithEmailAndPassword(this.auth, signUpForm.get('email')?.value, signUpForm.get('password')?.value)).pipe(
      switchMap(({user}) => 
        updateProfile(user, { displayName: signUpForm.get('firstName')?.value })
      )
    )
  }

  sendVerificationEmail(user: any) : Observable<any>{
    return from(sendEmailVerification(user))
  }

  logout(): Observable<any> {
    return from(this.auth.signOut());
  }

  changePassword(changePasswordForm: any) : Observable<any>{
    return from(sendPasswordResetEmail(this.auth, changePasswordForm.get('email')?.value));
  }

  uploadQuestionImage(image: File, path: string) : Observable<any>{
    const storageReference = ref(this.storage, path)
    const uploadTask = from(uploadBytes(storageReference, image));
    return uploadTask.pipe(
      switchMap( (result) =>getDownloadURL(result.ref) )
    );
  }

  createMockTest(mockTest: MockTest){
    const booksRef = collection(this.firestore, 'MockTests'); 
    return addDoc(booksRef, mockTest);
  }

  readMockTest(): Observable<any>{
    const collectionList = collection(this.firestore, 'MockTests');
    return collectionData(collectionList,{idField: 'id'})
  }

  getMockTestByID(id: string) {
    const bookRef = doc(this.firestore, `MockTests/${id}`);
    return docData(bookRef) as Observable<MockTest>;
  }

  createAllMockTestsGivenByAUser(id: string | undefined, data: any, isYourFirstTest: boolean){
    const docRef = doc(this.firestore, `IndividualUserTests/${id}`);
    if(isYourFirstTest){
      setDoc(docRef, data, {merge: true})
    }
    else{
      updateDoc(docRef, {allTests : arrayUnion(data.allTests[0])} )    
    }
  }

  getAllMockTestsGivenByAUser(id: string | undefined) : Observable<TestReportData>{
    const bookRef = doc(this.firestore, `IndividualUserTests/${id}`);
    return docData(bookRef) as Observable<TestReportData>;
  }
}
