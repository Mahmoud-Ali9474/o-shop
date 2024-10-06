import firebase from 'firebase/compat/app';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { AppUser } from '../models/app-user';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore) { }


  save(user: firebase.User) {
    this.db.doc(`users/${user.uid}`).update({
      name: user.displayName,
      email: user.email
    });
  }

  get(uid: string) {
    //getDoc()
    return this.db.doc<AppUser>(`users/${uid}`).valueChanges();
  }
}
