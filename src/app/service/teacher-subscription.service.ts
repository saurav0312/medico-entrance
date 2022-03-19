import { Injectable } from '@angular/core';
import { Firestore, addDoc, collectionData, collection, doc, docData, setDoc, updateDoc, arrayUnion, getDocs, arrayRemove } from '@angular/fire/firestore';
import { deleteDoc, query, where } from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { TeacherSubscription } from '../interface/teacher-subscription';

@Injectable({
  providedIn: 'root'
})
export class TeacherSubscriptionService {

  constructor(
    private firestore: Firestore,
  ) {

  }

  //Create sub collection for a user which contains all teacher id subscribed by the student
  subscribeToTeacher(userId: string | undefined, teacherId: string | undefined):Observable<any>{
    const docRef = doc(this.firestore, `StudentTeacherSubscriptionDetails/${userId}/allTeacherSubscribed/${teacherId}`);
    return from(setDoc(docRef, {teacherId: teacherId}))
  }

  // This method fetches all subscribed teachers by a student
  getAllSubscribedTeachersByAUser(userId: string | undefined) : Observable<TeacherSubscription>{
    const docRef = collection(this.firestore, `StudentTeacherSubscriptionDetails/${userId}/allTeacherSubscribed`);
    return collectionData(docRef,{idField:'id'}).pipe(
      map((result: any) => {
        let allTeacherSubscribed: string[] = [] 
        result.forEach((teacher:any) =>{
          allTeacherSubscribed.push(teacher.teacherId)
        })
        let teacherSubscription: TeacherSubscription ={
          allTeacherSubscribed: allTeacherSubscribed
        }
        return teacherSubscription
      })
    )
  }

  deleteEntryFromStudentTeacherSubscriptionCollection(subscriberUserId: string, teacherIdToDelete: string | undefined) : Observable<any>{
    const docRef = doc(this.firestore, `StudentTeacherSubscriptionDetails/${subscriberUserId}/allTeacherSubscribed/${teacherIdToDelete}`)
    return from(deleteDoc(docRef));
  }

}
