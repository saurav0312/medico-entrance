import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MockTest} from '../interface/mockTest';
import { Firestore, addDoc, collectionData, collection } from '@angular/fire/firestore';


const realtimeDatabaseUrl = environment.firebase.realtimeDatabaseUrl

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$ = authState(this.auth);

  constructor(
    private auth: Auth,
    private httpClient : HttpClient,
    private router : Router,
    private activatedRoute: ActivatedRoute,
    private firestore: Firestore
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

  createMockTest(mockTest: MockTest){
    const booksRef = collection(this.firestore, 'MockTests'); 
    return addDoc(booksRef, mockTest);
  }

  readMockTest(): Observable<any>{
    const collectionList = collection(this.firestore, 'MockTests');
    return collectionData(collectionList)
  }
}
