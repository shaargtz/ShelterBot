import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';


interface iUser {
  name: string,
  location: string,
  email: string
}

class User implements iUser {
  name: string;
  location: string;
  email: string;
  orgName: string;

  constructor(){
    this.name = '';
    this.location = '';
    this.email = '';
    this.orgName = '';
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserdataService {
  uID: any = "";
  isAuth: boolean = false;
  user: User;
  constructor(
    public afAuth: AngularFireAuth,
    public database: AngularFireDatabase,
    public alertController: AlertController) {
    afAuth.authState.subscribe((data) => {
      console.log(JSON.stringify(data));
      if (data != null) {
        //una vez que ya haya iniciado sesion guarda el user ID
        this.uID = data.uid;
        this.isAuth = true;
        this.loadUserData();
      }
    })
  }

  async loadUserData() {
    await this.database.database.ref('Users/').child(this.uID).on("value", (value) => {
      console.log(value.val());
      this.user = value.exportVal();
    })
  }

  signOut() {
    return this.afAuth.auth.signOut();
  }

}
