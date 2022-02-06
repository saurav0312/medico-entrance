import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, addDoc, collectionData, collection, doc, docData, setDoc, updateDoc, arrayUnion, getDocs } from '@angular/fire/firestore';
import { TestSubscription } from '../interface/test-subscription';

@Injectable({
  providedIn: 'root'
})
export class TestsubscriptionService {

  constructor(
    private firestore: Firestore,
  ) { }

  subscribeToTest(userId : string | undefined, data : TestSubscription | undefined, isFirstSubscription: boolean):void{
    const docRef = doc(this.firestore, `TestSubscriptionDetails/${userId}`);
    if(isFirstSubscription){
      setDoc(docRef, data, {merge: true})
    }
    else{
      updateDoc(docRef, {allSubscribedTests : arrayUnion(data?.allSubscribedTests[0])} )    
    }
  }

  getAllSubscribedTestsByAUser(userId: string | undefined) : Observable<TestSubscription>{
    const bookRef = doc(this.firestore, `TestSubscriptionDetails/${userId}`);
    return docData(bookRef) as Observable<TestSubscription>;
  }
}
