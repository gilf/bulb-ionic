/// <reference types="web-bluetooth-typings" />

import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DevicePage} from '../device/device';
import {SERVICE_ID} from '../../common/consts';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(private navCtrl: NavController) {
  }

  startScanning() {
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
