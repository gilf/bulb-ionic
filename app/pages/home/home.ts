import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DevicePage} from '../device/device';
import {BLE} from 'ionic-native';
import {DEVICE_ID, SERVICE_ID, CHARACTERISTICS_ID} from '../../common/consts';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private devices = [];
  private isScanning: boolean = false;

  constructor(private navCtrl: NavController) {


    // BLE.connect(DEVICE_ID).subscribe((device) => {
    //     let writeValue = new Uint8Array([ 0xff, 0x0, 0xff, 0x00, 0xf0, 0xaa ]);
    //
    //     device.writeWithoutResponse(DEVICE_ID, SERVICE_ID, CHARACTERISTICS_ID , writeValue.buffer).then(() => {
    //       BLE.disconnect(DEVICE_ID);
    //     });
    // });
  }

  startScanningDevices() {
    console.log("Scanning Started");
    this.devices.length = 0;
    this.isScanning = true;
    BLE.startScan([]).subscribe(device => {
      this.devices.push(device);
    });

    setTimeout(() => {
      BLE.stopScan().then(() => {
        console.log("Scanning has stopped!");
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
