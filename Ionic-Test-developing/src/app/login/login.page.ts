import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserdataService } from '../userdata.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  public login: FormGroup;
  notValid : boolean = false;

  constructor(public formBuilder: FormBuilder, public userData: UserdataService, public afAuth: AngularFireAuth, public alertCtrl: AlertController, private navCtrl: NavController) { 
    this.login = this.formBuilder.group({
      mail: ['', Validators.required],
      password:['']
    })
    this.userData.uID = "";
  }
  subscribers : Subscription;

  ionViewDidEnter() {
    this.subscribers = this.afAuth.authState.subscribe(async (data) => {
      if (data != null && data.emailVerified) {
        console.log('login');
        this.userData.uID = data.uid; 
        this.userData.isAuth = data.emailVerified;
        await this.userData.loadUserData();
        this.navCtrl.navigateForward("home");
      }
    })
  }


  ionViewWillDisapear() {
    this.subscribers.unsubscribe();
  }
  async logForm(){
    //revisar si el mail es valido
    if(this.isEmailValid(this.login.value.mail) == true){
      var isPasswordWrong : boolean;
      
      //inicia sesion
      await this.afAuth.auth.signInWithEmailAndPassword(this.login.value.mail, this.login.value.password).then((ref)=>{
        if(ref.user.emailVerified == true){
          this.navCtrl.navigateForward("home")
          this.userData.uID = ref.user.uid; 
          this.userData.isAuth = ref.user.emailVerified;
        }else{
          this.presentAlert("Confirm you email")
        }
      }).catch((err)=>{
        console.log(err)
        //email y contraseña mal
        isPasswordWrong = false;
      })

      //si esta atentificado en userdata continuar
      if(isPasswordWrong== false){
        this.presentAlert("Email or password are wrong")
      }
    }else{
      //mail no es valido
      this.presentAlert("Your email is not valid")
      this.notValid == true
    }
  }
  isEmailValid(mail:any){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(re.test(mail) == false || mail == ""){
      return false
    }else {
      return true
    }
  }

  open(){
    this.navCtrl.navigateForward("home")
  }
  resetPass() {
    if (this.login.valid) {
      this.afAuth.auth.sendPasswordResetEmail(this.login.value).then(() => {
        this.presentAlert("Reset Email was sent");
      })
    }else {
      this.presentAlert('Please write the email you want to reset');
    }
  }
  openRegister(){
    this.navCtrl.navigateForward("register")
  }

  async presentAlert(err: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: err,
      buttons: ['OK']
    });

    await alert.present();
  }
  

}
