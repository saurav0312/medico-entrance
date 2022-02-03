import { Injectable } from '@angular/core';
import { Firestore, addDoc, collectionData, collection, doc, docData, setDoc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Storage, uploadBytes, ref, UploadResult, getDownloadURL } from '@angular/fire/storage';
import { from, switchMap, Observable } from 'rxjs';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) { }

  updateUserDetails(id: string | undefined, userDetail: User): Observable<any>{
    const docRef = doc(this.firestore, `UserDetails/${id}`);
    return from(setDoc(docRef, userDetail, {merge: true}))
  }

  getUserDetails(id: string | undefined): Observable<User>{
    const bookRef = doc(this.firestore, `UserDetails/${id}`);
    return docData(bookRef) as Observable<User>;
  }

  uploadProfileImage(path: Blob, filename: string| undefined) : Observable<string>{
    const profileImagesRef = ref(this.storage, `profileImages/${filename}`)
    const uploadTask = from(uploadBytes(profileImagesRef, path))
    return uploadTask.pipe(
      switchMap((result) => from(getDownloadURL(result.ref))
      )
    )
  }
}
