import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BLE, NativeStorage } from 'ionic-native';
import { getColorValue, getWhiteValue, SERVICE_ID, CHARACTERISTIC_ID, BULB_COLORS } from '../../common/consts';

@Component({
  templateUrl: 'device.html'
})
export class DevicePage {
  device;
  connecting: boolean = false;
  mode: 'rgb' | 'white' = 'rgb';
  red = 128;
  green = 0;
  blue = 0;
  warmWhite = 0;

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
      () => {
        this.zone.run(() => {
          this.connecting = false;
          NativeStorage.getItem(BULB_COLORS).then((data) => {
            if (data) {
              let bulb = JSON.parse(data);
              this.red = bulb.red;
              this.green = bulb.green;
              this.blue = bulb.blue;
              this.warmWhite = bulb.warmWhite;
              this.updateColor();
            }
          });
        });
      },
      error => {
        console.error('Error', error);
      });
  }

  updateColor() {
    let writeValue = getColorValue(this.red, this.green, this.blue);
    BLE.writeWithoutResponse(this.device.id,
                             SERVICE_ID.toString(16),
                             CHARACTERISTIC_ID.toString(16),
                             writeValue.buffer);
    NativeStorage.setItem(BULB_COLORS, { red: this.red, green: this.green, blue: this.blue, warmWhite: this.warmWhite});
  }

  updateWhite() {
    let writeValue = getWhiteValue(this.warmWhite);
    BLE.writeWithoutResponse(this.device.id,
                             SERVICE_ID.toString(16),
                             CHARACTERISTIC_ID.toString(16),
                             writeValue.buffer);
    NativeStorage.setItem(BULB_COLORS, { red: this.red, green: this.green, blue: this.blue, warmWhite: this.warmWhite});
  }
}
