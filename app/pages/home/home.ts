import {Component} from '@angular/core';
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

  constructor(private navCtrl: NavController) {
  }

  startScanningDevices() {
    console.log('Scanning started!');
    this.devices.length = 0;
    this.isScanning = true;
    BLE.startScan([SERVICE_ID]).subscribe(device => {
      this.devices.push(device);
    });

    setTimeout(() => {
      BLE.stopScan().then(() => {
        console.log('Scanning has stopped!');
        console.log(JSON.stringify(this.devices));
        this.isScanning = false;
      });
    }, 3000);
  }

  redirectToDevicePage(device) {
    console.log('Chosen device:', JSON.stringify(device));
    this.navCtrl.push(DevicePage, {
      device: device
    });
  }
}
