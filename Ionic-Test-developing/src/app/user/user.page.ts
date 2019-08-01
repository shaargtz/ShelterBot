import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import { UserdataService } from "../../app/userdata.service"
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  userId: any;
  userPath: any;
  name: any;
  organization: string;
  location : string;
  image : any;


  constructor(private navController: NavController, public userData: UserdataService) { 
  }
  
  ngOnInit() {

  }
  signOut() {
    this.userData.signOut().then(() => {
      this.navController.navigateForward('login');
    })
  }
}
