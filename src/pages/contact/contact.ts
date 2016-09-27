import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'contact.html'
})
export class ContactPage {
  constructor(private navCtrl: NavController) {
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
