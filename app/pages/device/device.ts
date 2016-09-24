import {Component, NgZone} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
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
  private characteristic;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone
  ) {
    this.device = this.navParams.get('device');
  }

  onPageWillEnter() {
    this.connecting = true;
    this.device.gatt.connect()
      .then(server => server.getPrimaryService(SERVICE_ID))
      .then(service => service.getCharacteristic(CHARACTERISTIC_ID))
      .then(characteristic => {
        this.characteristic = characteristic;
        this.connecting = false;
      });
  }

  onPageWillLeave() {
    this.device.gatt.disconnect();
  }

  updateColor() {
    let writeValue = getColorValue(this.red, this.green, this.blue);
    this.characteristic.writeValue(writeValue);
  }
}
