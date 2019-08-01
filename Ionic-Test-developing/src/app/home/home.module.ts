import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'home/camera',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomePage,
        children: [
          {path: 'inventory', loadChildren: '../inventory/inventory.module#InventoryPageModule'},
          {path: 'camera', loadChildren: '../camera/camera.module#CameraPageModule'},
          {path: 'user', loadChildren: '../user/user.module#UserPageModule'},
        ]
      },
      
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
