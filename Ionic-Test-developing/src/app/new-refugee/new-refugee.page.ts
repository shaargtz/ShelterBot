import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostPictureService } from '../post-picture';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserdataService } from '../userdata.service';

@Component({
  selector: 'app-new-refugee',
  templateUrl: './new-refugee.page.html',
  styleUrls: ['./new-refugee.page.scss'],
})
export class NewRefugeePage implements OnInit {
  public newRefugee : FormGroup;
  image: string;

  constructor(
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    public gallery: PostPictureService,
    public afDatabase: AngularFireDatabase,
    public UserData: UserdataService,
    public alertCtrl: AlertController,
    ) { 
    this.newRefugee = this.formBuilder.group({
      name: [''],
    })
  }

  openGallery() {
    this.gallery.openGallery().then((image: any) => {
      this.image = image;
    });
  }
  newRefugeeForm(){
    var prodVal = this.newRefugee.value
    var name = prodVal.name
    
    //if one field is empty we tell the user its empty
    if (!name.replace(/\s/g, '').length || prodVal.quantity == "") {
      this.presentAlert("One or more field is empty")
    }else{
      //post the image on the storage folders
      this.gallery.postPicture(this.image, 'Refugees').then((url: string) => {
        this.image = url;
      });
      //adds the product to the database
      this.afDatabase.database.ref(`RefugeeData/InShelter/${this.UserData.user.orgName}`).push({
        "Image": this.image,
        "Name": name,
      })

      this.dismiss()
    }
  }
  dismiss() {
    this.modalCtrl.dismiss({
      "dismissed": true
    })
  }
  ngOnInit() {
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
