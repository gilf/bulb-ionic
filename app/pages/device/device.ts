import {Component, NgZone} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {BLE} from 'ionic-native';
import {getColorValue, SERVICE_ID, CHARACTERISTIC_ID} from '../../common/consts';

@Component({
  templateUrl: 'build/pages/device/device.html'
})
export class DevicePage {
  private device;
  private connecting: boolean = false;
  private red = 128;
  private green = 0;
  private blue = 0;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone
  ) {
    this.device = this.navParams.get('device');
    this.connecting = true;
    this.connect(this.device.id);
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
    BLE.connect(this.device.id).subscribe((device) => {
      let writeValue = getColorValue(this.red, this.green, this.blue);

      BLE.writeWithoutResponse(this.device.id, SERVICE_ID, CHARACTERISTIC_ID, writeValue.buffer).then(() => {
        BLE.disconnect(this.device.id);
      });
    });
  }
}
