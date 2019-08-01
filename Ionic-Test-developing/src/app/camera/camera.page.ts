import { Component, OnInit } from '@angular/core';
//import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController, PickerController } from '@ionic/angular';

import { UserdataService } from '../userdata.service';
import { ContentProviderService } from '../content-provider.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PickerOptions, PickerButton } from '@ionic/core';
import { AngularFireDatabase } from '@angular/fire/database';



@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})

export class CameraPage implements OnInit {
  products$: Observable<any[]>;
  refugeeSelected: any;
  object$: Observable<any>;
  item: string;
  encodeData: any;
  isOpen: boolean;
  framework: string;
  resultant: any;
  path: string

  //agregamos la fecha
  dateObj = new Date();
  month: string = this.dateObj.getMonth().toString()
  day: string = this.dateObj.getDay().toString()
  year = this.dateObj.getFullYear()
  todaysDate: string

  constructor(public toastController: ToastController,
    public barcodeScanner: BarcodeScanner,
    private userData: UserdataService,
    private contentLoader: ContentProviderService,
    private pickerCtrl: PickerController,
    public afDatabase: AngularFireDatabase) {
    this.isOpen = false;
    this.todaysDate = this.month + "-" + this.year
  }

  ngOnInit() {

  }

  // Scan -> Select who you gave the item to -> Update Ledger
  scanCodeV3(){
    this.barcodeScanner.scan().then(barcodeData =>{
      if (barcodeData.text == undefined) {
        return;
      }
      const location = `ShelterInventory/${this.userData.user.orgName}/AllItems`
      this.afDatabase.database.ref(location).child(barcodeData.text).once("value").then(snapshot =>{
        let product = snapshot.val()
        this.presentToast(product.Available)
        if(product.Available == 0) {
          //do something for the first time
        } else {
          //do something for the other times
        }
      })
    })
  }
  async presentToast(text){
    const toast =  await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }
  scanCodeV2() {
    this.barcodeScanner.scan().then(barcodeData => {
      if (barcodeData.text == undefined) {
        return;
      }
      this.isOpen = true;
      const location = `Organization/${this.userData.user.orgName}/Refugees`;
      this.item = barcodeData.text; 
      this.object$ = this.contentLoader.getObject<any>(`ShelterInventory/${this.userData.user.orgName}/AllItems/${this.item}`)
      this.products$ = this.contentLoader.getList<any>(location).pipe(map(v => v.map((ref: any) => {
        return { isChecked: false, ...ref };
      })));
    })
  }

  async assign(item) {
    console.log(this.item + ' data ' + this.refugeeSelected)
    const usedBy = this.refugeeSelected;
    const itemKey = this.item;
    if (usedBy == undefined) {
      const toast =  await this.toastController.create({
        message: 'Please select a refugee first.',
        duration: 2000
      });
      toast.present();
      return;
    }
    const promise1  = this.contentLoader.pushData(`ShelterInventory/${this.userData.user.orgName}/AllItems/${this.item}/Uses`, {
      'Scan': 1,
      'UsedBy' : usedBy,
      'Timestamp': Date.now()
    })
    console.log(item);
    const promise3 = this.contentLoader.updateData(`ShelterInventory/${this.userData.user.orgName}/AllItems/${this.item}`,
    {
      'Consumed': ++item.Consumed,
      'Available' : --item.Available
    })
    const promise2  = this.contentLoader.updateData(`RefugeeData/RefugeeItemHistory/${this.userData.user.orgName}/${usedBy}`, {
      [itemKey] : {
        'Uses': 1,
        'Timestamp': Date.now()
      }
    })

    Promise.all([promise1, promise2, promise3]).then(() => {
      this.item = "";
      this.refugeeSelected = "";
      this.isOpen = false;
    }).catch((e) => {
      console.log(e);
    })
  }



  selected(key) {
    this.refugeeSelected = key;
  }


  //escanear codigo
  /*
  scanCode() {
    console.log("scanner open")
    var hourObj = new Date()
    var hour = hourObj.getHours().toString() + ":" + hourObj.getMinutes().toString() + ":" + hourObj.getSeconds().toString()
    this.barcodeScanner.scan().then(barcodeData => {
      //entrar a la referencia (productos) de la database y entrando al hijo (lo escaneado)
      this.path = "Users/" + this.userData.uID + "/Products"
      var databaseRefChild = this.firebase.database.ref(this.path).child(barcodeData.text)

      //para entrar al valor
      databaseRefChild.once('value').then((snapshot) => {
        let product = snapshot.val();
        this.amount = product.Quantity;
        if (this.amount > 0) {
          this.amount--;
          //actualizar
          databaseRefChild.update({
            "Quantity": this.amount,
          })
        }

        //para sacar el url de la imagen
        this.imgURL = snapshot.val().Image;
        //pone el nombre del producto en la variable que se pone en el html 
        this.nameProduct = snapshot.val().Name;
        //para activar el div
        this.isOpen = true;

        //actualizar
        var updates = {}
        this.firebase.database.ref(`Tickets/${this.todaysDate}/${this.userData.uID}`).child(barcodeData.text).once('value').then((snapshot) => {
          let scanValue = snapshot.val().Scan;

          console.log("Success: " + scanValue);
          scanValue++;
          updates = {
            [this.todaysDate]: {
              [this.userData.uID]: {
                [barcodeData.text]: {
                  Scan: scanValue,
                  Timestamp: hour
                }
              }
            }
          }
          this.firebase.database.ref("Tickets").update(updates);
        }).catch(() => {
          console.log("ERROR");
          updates = {
            [this.todaysDate]: {
              [this.userData.uID]: {
                [barcodeData.text]: {
                  Scan: 1,
                  Timestamp: hour
                }
              }
            }
          }
          this.firebase.database.ref("Tickets").update(updates);
        })


      })
    }).catch(err => {
      console.log('Error', err);
    });

  }*/

  // updateAmount(id){
  //   var databaseRefChild = this.firebase.database.ref("Productos").child(id);
  //   this.resultant = this.framework
  //   if(this.amount - this.resultant >0){
  //     //actualizar
  //     this.amount = this.amount - this.resultant
  //     databaseRefChild.update({
  //       "Cantidad": this.amount,
  //     })
  //   }else{
  //     this.showError();
  //   }

  // }





  // regresar la cantidad para eliminar
  async showBasicPicker() {
    let opts: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Done'
        }
      ],
      columns: [
        {
          name: 'framework',
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2 },
            { text: '3', value: 3 },
            { text: '4', value: 4 },
            { text: '5', value: 5 },
            { text: '6', value: 6 },
            { text: '7', value: 7 },
            { text: '8', value: 8 },
            { text: '9', value: 9 },
            { text: '10', value: 10 },
          ]
        }
      ]
    };
    let picker = await this.pickerCtrl.create(opts);
    picker.present();
    picker.onDidDismiss().then(async data => {
      let col = await picker.getColumn('framework');
      this.framework = col.options[col.selectedIndex].text;
    });
  }
}
