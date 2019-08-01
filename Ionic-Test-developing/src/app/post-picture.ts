


import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as firebaseRef from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';

/*
 Generated class for the StoreServiceProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
*/
@Injectable()
export class PostPictureService {
  constructor(
    private platform: Platform,
    private camera: Camera) {

  }

  openGallery() {
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }

    return new Promise((success, reject) => {
      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        let base64Image = null
        if (this.platform.is('ios'))
          base64Image = 'data:image/jpeg;base64,' + imageData;
        else
          base64Image = imageData;
        return success(base64Image);
      }).catch((err) => {
      });
    })
  };


  postPicture(url, path) {
    let imageURL = "profile_pic.jpg" + Date.now();
    return new Promise((resolve, reject) => {
      let storageRef = firebaseRef.storage().ref().child(path).child(imageURL);
      if (this.platform.is('ios')) {
        let parseUpload = storageRef.putString(url, firebaseRef.storage.StringFormat.DATA_URL);
        parseUpload.then(() => {
          return resolve(storageRef.getDownloadURL());
        }).catch((error) => {
          return reject(error);
        });
      } else {
        let parseUpload = storageRef.putString(url, 'base64', { contentType: 'image/jpeg' });
        parseUpload.then(() => {
          return resolve(storageRef.getDownloadURL());
        }).catch((error) => {
          return reject(error);
        });
      }
    });
  }
}