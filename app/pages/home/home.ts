import {Component, NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DevicePage} from '../device/device';
import {BLE} from 'ionic-native';
import {SERVICE_ID} from '../../common/consts';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private devices = [];
  private isScanning: boolean = false;

  constructor(private navCtrl: NavController, private zone: NgZone) {
  }

  startScanning() {
    this.devices.length = 0;
    this.isScanning = true;
    BLE.enable().then(() => {
      BLE.startScan([SERVICE_ID]).subscribe(device => {
        this.zone.run(() => {
          this.devices.push(device);
        });
      });
    }).catch(err => {
      console.error('Failed to enable BLE', err);
      this.isScanning = false;
    });
  }

  stopScanning() {
    BLE.stopScan().then(() => {
      this.zone.run(() => {
        this.isScanning = false;
      });
    });
  }

  redirectToDevicePage(device) {
    if (this.isScanning) {
      this.stopScanning();
    }
    this.navCtrl.push(DevicePage, {
      device: device
    });
  }
}
