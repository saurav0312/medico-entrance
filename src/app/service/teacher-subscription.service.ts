import { Injectable } from '@angular/core';
import { Firestore, addDoc, collectionData, collection, doc, docData, setDoc, updateDoc, arrayUnion, getDocs, arrayRemove } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { TeacherSubscription } from '../interface/teacher-subscription';

@Injectable({
  providedIn: 'root'
})
export class TeacherSubscriptionService {

  constructor(
    private firestore: Firestore,
  ) {

  }

  subscribeToTeacher(userId : string | undefined, data : TeacherSubscription | undefined, isFirstSubscription: boolean):Observable<any>{
    const docRef = doc(this.firestore, `StudentTeacherSubscriptionDetails/${userId}`);
    if(isFirstSubscription){
      return from(setDoc(docRef, data, {merge: true}))
    }
      return from(updateDoc(docRef, {allTeacherSubscribed : arrayUnion(data?.allTeacherSubscribed[0])} ) )   
  }

  deleteEntryFromStudentTeacherSubscriptionCollection(subscriberUserId: string, teacherIdToDelete: string | undefined) : Observable<any>{
    const docRef = doc(this.firestore, `StudentTeacherSubscriptionDetails/${subscriberUserId}`)
    return from(updateDoc(docRef,{"allTeacherSubscribed": arrayRemove(teacherIdToDelete)}))
  }

  getAllSubscribedTeachersByAUser(userId: string | undefined) : Observable<TeacherSubscription>{
    const bookRef = doc(this.firestore, `StudentTeacherSubscriptionDetails/${userId}`);
    return docData(bookRef) as Observable<TeacherSubscription>;
  }

}
