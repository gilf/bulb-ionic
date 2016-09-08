import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {BLE} from 'ionic-native';
import {DEVICE_ID, SERVICE_ID, CHARACTERISTICS_ID} from '../../common/consts';

@Component({
  templateUrl: 'build/pages/device/device.html'
})
export class DevicePage {
  private device;
  private connecting: boolean = false;
  private characteristics = [];
  private writeStr = '';

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
    this.device = this.navParams.get('device');
    this.connecting = true;
    this.connect(this.device.id);
  }

  connect(deviceId:string) {
    this.characteristics.length = 0;

    BLE.connect(deviceId).subscribe((peripheralData) => {
        console.log(peripheralData.characteristics);
        this.characteristics = peripheralData.characteristics;
        this.connecting = false;
      },
      peripheralData => {
        console.log('disconnected');
      });
  }

  write(deviceId: string) {
    BLE.connect(deviceId).subscribe((device) => {
        let writeValue = new Uint8Array([ 0xff, 0x0, 0xff, 0x00, 0xf0, 0xaa ]);

        device.writeWithoutResponse(deviceId, SERVICE_ID, CHARACTERISTICS_ID , writeValue.buffer).then(() => {
          BLE.disconnect(deviceId);
        });
    });
  }
}
