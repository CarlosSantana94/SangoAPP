import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-address-title',
  templateUrl: './address-title.page.html',
  styleUrls: ['./address-title.page.scss'],
})
export class AddressTitlePage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

 dismiss(){
   this.modalController.dismiss();
 }
}
