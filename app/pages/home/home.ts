import {Component, NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DevicePage} from '../device/device';
import {SERVICE_ID} from '../../common/consts';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(private navCtrl: NavController, private zone: NgZone) {
  }

  startScanning() {
    (navigator as any).bluetooth.requestDevice({
      filters: [{ services: [SERVICE_ID] }]
    }).then(device => this.redirectToDevicePage(device));
  }

  stopScanning() {
  }

  redirectToDevicePage(device) {
    this.navCtrl.push(DevicePage, {
      device: device
    });
  }
}
