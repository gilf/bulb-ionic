/// <reference types="web-bluetooth-typings" />

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DevicePage } from '../device/device';
import { SERVICE_ID } from '../../common/consts';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  webBluetoothSupported = typeof navigator.bluetooth !== 'undefined';

  constructor(private navCtrl: NavController, private alertCtrl: AlertController) {
  }

  startScanning() {
    if (!this.webBluetoothSupported) {
      let alert = this.alertCtrl.create({
        title: 'No Web Bluetooth',
        subTitle: 'Your browser does not seems to support Web Bluetooth :-(',
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE_ID] }]
    }).then(device => this.redirectToDevicePage(device));
  }

  redirectToDevicePage(device) {
    this.navCtrl.push(DevicePage, {
      device: device
    });
  }
}
