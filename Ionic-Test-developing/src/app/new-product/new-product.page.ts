import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { PostPictureService } from '../post-picture';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserdataService } from '../userdata.service';
@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.page.html',
  styleUrls: ['./new-product.page.scss'],
})
export class NewProductPage implements OnInit {
  public newProd: FormGroup;
  image: string;
  constructor(
    public formBuilder: FormBuilder,
    public gallery: PostPictureService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public afDatabase: AngularFireDatabase,
    public UserData: UserdataService
    ) {
    this.newProd = this.formBuilder.group({
      name: ['']
    })
  };


  openGallery() {
    this.gallery.openGallery().then((image: any) => {
      this.image = image;
    });
  }
  dismiss() {
    this.modalCtrl.dismiss({
      "dismissed": true
    })
  }
  async newProdForm(){
    var prodVal = this.newProd.value
    var name = prodVal.name
    
    //if one field is empty we tell the user its empty
    if (!name.replace(/\s/g, '').length) {
      this.presentAlert("One field is empty")
    }else{
      //post the image on the storage folders (IDK if it works)
      this.gallery.postPicture(this.image, 'Inventory').then((url: string) => {
        this.image = url;
      }).catch(err =>{
        this.image = ""
      })
      //adds the product to the database
      this.afDatabase.database.ref(`ShelterInventory/${this.UserData.user.orgName}/ItemList`).child(name).set({
        "Name": name,
        "Image": this.image,
        "Stock": 0
      })
      this.dismiss()
    }
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
