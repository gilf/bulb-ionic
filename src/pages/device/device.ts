import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BLE } from 'ionic-native';
import {
  getColorValue, getWhiteValue, serviceId, charasteristicId, notificationCharacteristicId,
  notificationServiceId, readBulbStateCommand
} from '../../common/consts';

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
          this.readBulbState();
        });
      },
      error => {
        console.error('Error', error);
      });
  }

  private sendCommand(value: Uint8Array) {
    BLE.writeWithoutResponse(this.device.id,
      serviceId.toString(16),
      charasteristicId.toString(16),
      value.buffer);

  }

  private onBulbStateReceived(data: Uint8Array) {
    if (data[0] === 0x66) {
      this.red = data[6];
      this.green = data[7];
      this.blue = data[8];
      this.warmWhite = data[9];
      this.mode = (data[3] === 0x4b) ? 'white' : 'rgb';
    }
  }

  readBulbState() {
    BLE.startNotification(this.device.id, notificationServiceId.toString(16), notificationCharacteristicId.toString(16))
      .subscribe(buffer => this.zone.run(() => this.onBulbStateReceived(new Uint8Array(buffer))));
    this.sendCommand(new Uint8Array(readBulbStateCommand));
  }

  updateColor() {
    this.sendCommand(getColorValue(this.red, this.green, this.blue));
  }

  updateWhite() {
    this.sendCommand(getWhiteValue(this.warmWhite));
  }
}
