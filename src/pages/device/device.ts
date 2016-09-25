import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BLE } from 'ionic-native';
import { getColorValue, SERVICE_ID, CHARACTERISTIC_ID } from '../../common/consts';

@Component({
  templateUrl: 'device.html'
})
export class DevicePage {
  device;
  connecting: boolean = false;
  red = 128;
  green = 0;
  blue = 0;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone
  ) {
    this.device = this.navParams.get('device');
  }

  ionViewWillEnter() {
    this.connecting = true;
    this.connect(this.device.id);
  }

  ionViewWillLeave() {
    BLE.disconnect(this.device.id);
  }

  connect(deviceId: string) {
    BLE.connect(deviceId).subscribe(
      (peripheralData) => {
        this.zone.run(() => {
          this.connecting = false;
        });
      },
      error => {
        console.error('Error', error);
      });
  }

  updateColor() {
    let writeValue = getColorValue(this.red, this.green, this.blue);
    BLE.writeWithoutResponse(this.device.id, SERVICE_ID, CHARACTERISTIC_ID, writeValue.buffer).then(() => {
      console.log('value written!');
    });
  }
}
