import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { ContentProviderService } from '../content-provider.service';
import { Observable } from 'rxjs';


interface Organization {
  name: string,
  capacity: number
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public register: FormGroup;
  public orgs: Observable<Organization[]>;
  selectedOrg: string;
  constructor(public formBuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    public content: ContentProviderService,
    public AlertCtrl: AlertController,
    public afDatabase: AngularFireDatabase) {
    this.register = this.formBuilder.group({
      mail: ['', Validators.required],
      password: [''],
      firstName: [''],
      lastName: [''],
      org: [''],
      location: [''],
    })
    this.orgs = this.content.getList<Organization>('Organization');
  }

  ngOnInit() {

  }
  async regForm() {
    var regVal = this.register.value

    if (this.register.valid == false) {
      this.presentAlert("One or more field is empty")
    }
    else {
      await this.afAuth.auth.createUserWithEmailAndPassword(this.register.value.mail, this.register.value.password)
        .then((ref) => {
          this.afAuth.auth.onAuthStateChanged((user) => {
            let uid = user.uid;
            if (user) {
              user.sendEmailVerification()
              this.presentAlertConfirmation();
              this.afDatabase.database.ref("Users/").update({
                [uid]: {
                  lastName: regVal.lastName,
                  name: regVal.firstName,
                  location: regVal.location,
                  orgName: this.selectedOrg,
                  userImage: ""
                }
              })
            } else {
            }
          })
        })
        .catch((err) => {
          // Handle Errors here.
          var errorCode = err.code;
          var errorMessage = err.message;
          if (errorCode == 'auth/weak-password') {
            this.presentAlert('The password is too weak.');
          } else if (errorCode == "auth/email-already-in-use") {
            this.presentAlert('The email is already in use.');
          } else if (errorCode == "auth/invalid-email") {
            this.presentAlert('The email is invalid.');
          } else if (errorCode == "auth/operation-not-allowed") {
            this.presentAlert('Operation not allowed');
          }
        })
    }
  }
  async presentAlert(err: string) {
    const alert = await this.AlertCtrl.create({
      header: 'Error',
      message: err,
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentAlertConfirmation() {
    const alert = await this.AlertCtrl.create({
      header: 'Email sent',
      message: "Confirm your email and you are done!",
      buttons: ['OK']
    });

    await alert.present();
  }
}
