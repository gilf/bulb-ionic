import { Component, NgZone } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DevicePage } from '../device/device';
import { BLE } from 'ionic-native';
import { SERVICE_ID } from '../../common/consts';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  devices = [];
  isScanning: boolean = false;

  private isAndroid: boolean;

  constructor(private navCtrl: NavController, private zone: NgZone,
    platform: Platform) {
    this.isAndroid = platform.is('android');
  }

  startScanning() {
    this.devices.length = 0;
    this.isScanning = true;
    this.enableBLE().then(() => {
      BLE.startScan([SERVICE_ID.toString(16)]).subscribe(device => {
        this.zone.run(() => {
          this.devices.push(device);
        });
      });
    }).catch(err => {
      console.error('Failed to enable BLE', err);
      this.isScanning = false;
    });
  }

  private enableBLE() {
    if (this.isAndroid) {
      return BLE.enable();
    } else {
      // BLE.enable doesn't work on iOS
      return Promise.resolve();
    }
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
