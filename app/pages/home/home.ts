import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import bluetoothService from '../../common/bluetoothService';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private bluetoothSrv: bluetoothService;

  constructor(private navCtrl: NavController) {
    this.bluetoothSrv = new bluetoothService();
    this.bluetoothSrv.connect(0xF7345BF8CCEF).then(() => {
      let writeValue = new Uint8Array([ 0xff, 0x0, 0xff, 0x00, 0xf0, 0xaa ]);

      this.bluetoothSrv.write(0xffe9, writeValue);

      this.bluetoothSrv.disconnect();
    }).catch((error) => {
      console.log(error);
    });
  }
}
