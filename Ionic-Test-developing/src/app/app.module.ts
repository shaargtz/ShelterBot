import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Camera } from '@ionic-native/camera/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserdataService } from './userdata.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NewProductPageModule } from './new-product/new-product.module';
import { PostPictureService } from './post-picture';
import { NewRefugeePageModule } from './new-refugee/new-refugee.module';

const firebase = {
  apiKey: "apikey",
  authDomain: "ibm-challenge-78f32.firebaseapp.com",
  databaseURL: "https://ibm-challenge-78f32.firebaseio.com",
  projectId: "ibm-challenge-78f32",
  storageBucket: "ibm-challenge-78f32.appspot.com",
  messagingSenderId: "728851283827",
  appId: "1:728851283827:web:ee93d22f33d1ecc1"
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule, FormsModule,
    NewProductPageModule,
    NewRefugeePageModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    BarcodeScanner,
    ImagePicker,
    UserdataService,
    PostPictureService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
