import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-display',
  templateUrl: './display.page.html',
  styleUrls: ['./display.page.scss'],
})
export class DisplayPage implements OnInit {

  nombreProd: any;
  availableProd: any;
  imgURLProd: any;
  tipoProd: any;


  constructor(private route: ActivatedRoute, private router: Router) { 
    this.route.queryParams.subscribe(params => {
      if (params && params.product) {
        this.nombreProd = params.product.Name;
        this.imgURLProd = params.product.Image;
        if(params.product.Stock)
          this.availableProd = `Stock: ${params.product.Stock}`;
      }
    });
  }

  ngOnInit() {
  }

}
