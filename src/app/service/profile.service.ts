import { Injectable } from '@angular/core';
import { Firestore, addDoc, collectionData, collection, doc, docData, setDoc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Storage, uploadBytes, ref, UploadResult, getDownloadURL } from '@angular/fire/storage';
import { query, where } from 'firebase/firestore';
import { from, switchMap, Observable } from 'rxjs';
import { InstituteDetail } from '../interface/institute-detail';
import { Userr } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) { }

  updateUserDetails(id: string | undefined, userDetail: Userr): Observable<any>{
    const docRef = doc(this.firestore, `UserDetails/${id}`);
    return from(setDoc(docRef, userDetail, {merge: true}))
  }

  addInstituteDetails(instituteDetails: InstituteDetail): Observable<any>{
    const booksRef = collection(this.firestore, 'Institutes'); 
    return from(addDoc(booksRef, instituteDetails));
  }

  fetchInstituteDetailByEmail(emailId: string): Observable<any>{
    const collectionList = collection(this.firestore, 'Institutes');
    
    const q = query(collectionList, where("instituteEmail","==", emailId))
    return collectionData(q, {idField: 'id'})
  }

  getUserDetails(id: string | undefined): Observable<Userr>{
    const bookRef = doc(this.firestore, `UserDetails/${id}`);
    return docData(bookRef) as Observable<Userr>;
  }

  getAdminDetails(id: string | undefined):Observable<any>{
    const bookRef = doc(this.firestore, `AdminDetails/${id}`);
    return docData(bookRef) as Observable<any>;
  }

  getCountryDetails(): Observable<any>{
    const bookRef = collection(this.firestore, `CountriesWithState`);
    return collectionData(bookRef) as Observable<any>;
  }

  uploadProfileImage(path: Blob, filename: string| undefined) : Observable<string>{
    const profileImagesRef = ref(this.storage, `profileImages/${filename}`)
    const uploadTask = from(uploadBytes(profileImagesRef, path))
    return uploadTask.pipe(
      switchMap((result) => from(getDownloadURL(result.ref))
      )
    )
  }

  uploadQuestionImage(path: Blob | ArrayBuffer | Uint8Array, filename: string, userId: string, testId: string| undefined,questionNumber: string) : Observable<string>{
    const profileImagesRef = ref(this.storage, `questionImages/${userId}/${testId}/${questionNumber}/${filename}`)
    const uploadTask = from(uploadBytes(profileImagesRef, path, {contentType: 'image/jpeg'}))
    return uploadTask.pipe(
      switchMap((result) => from(getDownloadURL(result.ref))
      )
    )
  }
}
