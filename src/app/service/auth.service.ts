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
import { from, map, merge, Observable, switchMap, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MockTest} from '../interface/mockTest';
import { Firestore, addDoc, collectionData, collection, doc, docData, setDoc, updateDoc, arrayUnion, getDocs } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { uploadBytes } from 'firebase/storage';
import { TestReportData } from '../interface/testReportData';
import { arrayRemove, collectionGroup, deleteDoc, FieldValue, getDoc, query, where } from 'firebase/firestore';
import { ProfileService } from './profile.service';
import { ContactRequest } from '../interface/contact-request';
import { DiscussionQuestion } from '../interface/discussion-question';
import { UserToTestIdMapping } from '../interface/user-to-test-id-mapping';
import { NewDiscussionQuestion } from '../interface/new-discussion-question';
import { DiscussionAnswer } from '../interface/discussion-answer';
import { TeacherCodeRequestI } from '../interface/teacher-code-request-i';

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

  updateDiscussionQuestion(questionId: string| undefined ,discussionQuestionData: NewDiscussionQuestion){
    const docRef = doc(this.firestore, `DiscussionQuestionsTesting/${questionId}`);
    return from(setDoc(docRef, discussionQuestionData, {merge: true}))
  }

  readDiscussionQuestionsAskedByAUser(userId: string| undefined): Observable<any>{
    const collectionList = collection(this.firestore, 'DiscussionQuestionsTesting');
    const q = query(collectionList, where("questionAskedBy","==", userId))
      return collectionData(q, {idField: 'id'})
  }


  addDiscussionQuestionTest(discussionQuestionData: NewDiscussionQuestion){
    const docRef = collection(this.firestore, 'DiscussionQuestionsTesting'); 
    return from(addDoc(docRef, discussionQuestionData));
  }

  getExistingTeacherCode(teacherCodeRequestData: TeacherCodeRequestI):Observable<any>{
    const collectionRef = collection(this.firestore, 'TeacherCodeRequests'); 
    const q = query(collectionRef, where("email","==",teacherCodeRequestData.email))
    return collectionData(q, {idField:'id'});
  }

  createTeacherCodeRequest(teacherCodeRequestData: TeacherCodeRequestI):Observable<any>{
    const docRef = collection(this.firestore, 'TeacherCodeRequests'); 
    return from(addDoc(docRef, teacherCodeRequestData));
  }

  getTeacherCodeInfo(teacherCode: string|undefined){
    const docRef = doc(this.firestore, `TeacherCodeRequests/${teacherCode}`)
    return docData(docRef) as Observable<TeacherCodeRequestI>;
  }

  updateTeacherCodeInfo(teacherCode: string| undefined, teacherCodeStatus: boolean):Observable<any>{
    const docRef = doc(this.firestore, `TeacherCodeRequests/${teacherCode}`)
    return from(setDoc(docRef, {isVerified: teacherCodeStatus},{merge: true}))
  }

  readDiscussionQuestionsTest():Observable<any>{
    const docRef = collection(this.firestore, `DiscussionQuestionsTesting`);
    return collectionData(docRef,{idField:'id'})
  }

  fetchUpVotedByOfAQuestion(questionId: string| undefined):Observable<any>{
    const docRef = collection(this.firestore, `DiscussionQuestionsTesting/${questionId}/upVotedBy`);
    return collectionData(docRef,{idField:'id'})
  }

  fetchDownVotedByOfAQuestion(questionId: string| undefined):Observable<any>{
    const docRef = collection(this.firestore, `DiscussionQuestionsTesting/${questionId}/downVotedBy`);
    return collectionData(docRef,{idField:'id'})
  }

  increaseUpVoteCount(questionId:string| undefined,  userId: string | undefined){
    const docRef = doc(this.firestore, `DiscussionQuestionsTesting/${questionId}/upVotedBy/${userId}`);
    return from(setDoc(docRef, {userId: userId}))
  }

  decreaseUpVoteCount(questionId: string| undefined,  userId: string | undefined){
    const docRef = doc(this.firestore, `DiscussionQuestionsTesting/${questionId}/upVotedBy/${userId}`);
    return from(deleteDoc(docRef))
  }

  increaseDownVoteCount(questionId:string| undefined, userId: string | undefined){
    const docRef = doc(this.firestore, `DiscussionQuestionsTesting/${questionId}/downVotedBy/${userId}`);
    return from(setDoc(docRef, {userId: userId}))
  }

  decreaseDownVoteCount(questionId: string| undefined, userId: string | undefined){
    const docRef = doc(this.firestore, `DiscussionQuestionsTesting/${questionId}/downVotedBy/${userId}`);
    return from(deleteDoc(docRef))
  }

  addAnswer(questionId: string | undefined, data: DiscussionAnswer):Observable<any>{
    const docRef = collection(this.firestore, `DiscussionQuestionsTesting/${questionId}/allAnswers`);
    return from(addDoc(docRef, data))
  }

  fetchAllAnswersOfAQuestion(questionId: string| undefined):Observable<any>{
    const docRef = collection(this.firestore, `DiscussionQuestionsTesting/${questionId}/allAnswers`);
    return collectionData(docRef,{idField:'id'})
  }

  fetchUpVotedByOfAnAnswer(questionId: string| undefined, answerId: string|undefined):Observable<any>{
    const docRef = collection(this.firestore, `DiscussionQuestionsTesting/${questionId}/allAnswers/${answerId}/upVotedBy`);
    return collectionData(docRef,{idField:'id'})
  }

  fetchDownVotedByOfAnAnswer(questionId: string| undefined, answerId: string|undefined):Observable<any>{
    const docRef = collection(this.firestore, `DiscussionQuestionsTesting/${questionId}/allAnswers/${answerId}/downVotedBy`);
    return collectionData(docRef,{idField:'id'})
  }

  increaseUpVoteCountOfAnAnswer(questionId:string| undefined, answerId: string|undefined, userId: string | undefined){
    const docRef = doc(this.firestore, `DiscussionQuestionsTesting/${questionId}/allAnswers/${answerId}/upVotedBy/${userId}`);
    return from(setDoc(docRef, {userId: userId}))
  }

  decreaseUpVoteCountOfAnAnswer(questionId: string| undefined, answerId: string|undefined, userId: string | undefined){
    const docRef = doc(this.firestore, `DiscussionQuestionsTesting/${questionId}/allAnswers/${answerId}/upVotedBy/${userId}`);
    return from(deleteDoc(docRef))
  }

  increaseDownVoteCountOfAnAnswer(questionId:string| undefined, answerId: string|undefined, userId: string | undefined){
    const docRef = doc(this.firestore, `DiscussionQuestionsTesting/${questionId}/allAnswers/${answerId}/downVotedBy/${userId}`);
    return from(setDoc(docRef, {userId: userId}))
  }

  decreaseDownVoteCountOfAnAnswer(questionId: string| undefined, answerId: string|undefined, userId: string | undefined){
    const docRef = doc(this.firestore, `DiscussionQuestionsTesting/${questionId}/allAnswers/${answerId}/downVotedBy/${userId}`);
    return from(deleteDoc(docRef))
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

  //Create sub collection for a user which contains all test history given by the user
  addStudentIdToTestIdMapping(userId: string | undefined, testId: string | undefined){
    const docRef = collection(this.firestore, `UserToTestIdMapping`);
    addDoc(docRef, {userId: userId, testId: testId})
  }

  readStudentIdToTestIdMapping(testId: string| undefined):Observable<any>{
    const collectionList = collection(this.firestore, 'UserToTestIdMapping');
    const q = query(collectionList, where("testId","==", testId))
    return collectionData(q)
  }

  //Create sub collection for a user which contains all test history given by the user
  addATestGivenByTheUser(userId: string | undefined, data: any){
    const docRef = collection(this.firestore, `IndividualUserTests/${userId}/allTests`);
    addDoc(docRef, data)
  }
  
  // This method fetches all tests given by a student
  getAllMockTestsGivenByAUser(id: string | undefined) : Observable<TestReportData>{
    const docRef = collection(this.firestore, `IndividualUserTests/${id}/allTests`);
    return collectionData(docRef).pipe(
      map(result => {
        let testReportData = <TestReportData>{
          allTests: result
        }
        return testReportData
      })
    )
  }

  // addAQuestion(){
  //   const docRef = collection(this.firestore, `DiscussionQuestionsTesting`);
  //   return from(addDoc(docRef, {question: "Test Question"}));
  // }

  

  // This method fetches all tests given by a student
  getAllHistoryOfAMockTestGivenByAUserForTeacherAnalysis(id: string | undefined, testId: string) : Observable<TestReportData>{
    const docRef = collection(this.firestore, `IndividualUserTests/${id}/allTests`);
    const q = query(docRef, where("testId","==", testId))
    return collectionData(q).pipe(
      map(result => {
        let testReportData = <TestReportData>{
          allTests: result
        }
        return testReportData
      })
    )
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

  //gets user details based on account type ex: teacher or student
  getAllUserDetails():Observable<any>{
    const collectionList = collection(this.firestore, 'UserDetails');
    return collectionData(collectionList,{idField: 'id'})
  }


  //fetches all tests bought by the student
  fetchAllTestsBoughtByThisStudent(studentId: string | undefined):Observable<any>{
    const docRef = doc(this.firestore, `TestSubscriptionDetails/${studentId}`);
    return docData(docRef)
  }

  checkIfStudentHasBoughtThisTest(studentId: string| undefined, testId: string|undefined): Observable<any>{
    const docRef = doc(this.firestore, `TestSubscriptionDetails/${studentId}/allSubscribedTests/${testId}`);
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

  fetchTestsList(): Observable<any>{
    const collectionList = collection(this.firestore, 'MockTests');
    return collectionData(collectionList,{idField: 'id'})
  }

  getAllContactRequests():Observable<any>{
    const collectionList = collection(this.firestore, 'ContactRequests');
    return collectionData(collectionList,{idField: 'id'})
  }

  updateContactRequestInfo(contactRequestCode: string| undefined, status: string):Observable<any>{
    const docRef = doc(this.firestore, `ContactRequests/${contactRequestCode}`)
    return from(setDoc(docRef, {status: status},{merge: true}))
  }
}
