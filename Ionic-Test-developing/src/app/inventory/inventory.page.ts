import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NavController, ModalController } from '@ionic/angular';
import { UserdataService } from '../userdata.service';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { ContentProviderService } from '../content-provider.service';
import { NewProductPage } from '../new-product/new-product.page';
import { NewRefugeePage } from '../new-refugee/new-refugee.page';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss']
})
export class InventoryPage implements OnInit {
  products = [];
  products$: Observable<any[]>;
  isProd : boolean = true;
  constructor(
    private contentLoader: ContentProviderService,
    private navCtlr: NavController,
    private UserData: UserdataService,
    public modalCtrl: ModalController) {
      if (this.UserData == null) {
        return;
      }
      const location = `ShelterInventory/${this.UserData.user.orgName}/ItemList`;
      console.log(this.UserData.user.orgName);
      this.products$ = this.contentLoader.getList(location);
  }


  openDisplay(item) {
    this.navCtlr.navigateForward("/display", {
      queryParams: {
        product: item,
      }
    })
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
    if (ev.detail.value == "Refugees") {
      const location = `Organization/${this.UserData.user.orgName}/Refugees`;
      console.log(this.UserData.user.orgName);
      this.products$ = this.contentLoader.getList(location);
      this.isProd = false;
    } else {
      const location = `ShelterInventory/${this.UserData.user.orgName}/ItemList`;
      console.log(this.UserData.user.orgName);
      this.products$ = this.contentLoader.getList(location);
      this.isProd = true;
    }
  }

  openNewProduct() {
    // this.navCtlr.navigateForward("/new-product")
    if(this.isProd == true)
      this.presentModalNewPage();
    else
      this.presentModalNewRefugee();
  }

  async presentModalNewPage() {
    const modal = await this.modalCtrl.create({
      component: NewProductPage,
    })
    return await modal.present();
  }

  async presentModalNewRefugee() {
    const modal = await this.modalCtrl.create({
      component: NewRefugeePage,
    })
    return await modal.present();
  }
  ngOnInit() {

  }
}
