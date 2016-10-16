import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { getColorValue, getWhiteValue, serviceId, charasteristicId, notificationCharacteristicId,
  notificationServiceId, readBulbStateCommand } from '../../common/consts';

@Component({
  templateUrl: 'device.html'
})
export class DevicePage {
  device: BluetoothDevice;
  gattServer: BluetoothRemoteGATTServer;
  characteristic: BluetoothRemoteGATTCharacteristic;
  connecting: boolean = false;
  mode: 'rgb' | 'white' = 'rgb';
  red = 128;
  green = 0;
  blue = 0;
  warmWhite = 0;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams
  ) {
    this.device = this.navParams.get('device');
  }

  ionViewWillEnter() {
    this.connecting = true;
    this.device.gatt.connect()
      .then(server => {
        this.gattServer = server;
        return server.getPrimaryService(serviceId);
      })
      .then(service => service.getCharacteristic(charasteristicId))
      .then(characteristic => {
        this.characteristic = characteristic;
        this.connecting = false;
        this.readBulbState();
      })
      .catch(err => {
        console.error('BLE Connection failed!', err);
        this.connecting = false;
      });
  }

  ionViewWillLeave() {
    this.device.gatt.disconnect();
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
    this.gattServer.getPrimaryService(notificationServiceId)
      .then(service => service.getCharacteristic(notificationCharacteristicId))
      .then(notifyCharacteristic => {
        notifyCharacteristic.addEventListener('characteristicvaluechanged', event => {
          this.onBulbStateReceived(new Uint8Array(notifyCharacteristic.value.buffer));
        });
        return notifyCharacteristic.startNotifications();
      })
      .then(() => {
        this.characteristic.writeValue(new Uint8Array(readBulbStateCommand));
      })
      .catch(err => console.error('failed to listen for bulb notifications', err));
  }

 updateColor() {
    let writeValue = getColorValue(this.red, this.green, this.blue);
    this.characteristic.writeValue(writeValue);
  }

  updateWhite() {
    let writeValue = getWhiteValue(this.warmWhite);
    this.characteristic.writeValue(writeValue);
  }
}
