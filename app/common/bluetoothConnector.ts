'use strict';

export default class bluetoothConnector {
  private device: any;

  connect(services: Array<any>) {
    let self = this,
      promise = new Promise<any>((resolve, reject)=> {
        if (this.device && !this.device.gatt.connected) {
          resolve(this.device.gatt.connect());
        }

        navigator.bluetooth.requestDevice({
          filters: [{
            services: services
          }]
        })
          .then(device => {
            let server = device.gatt.connect();
            this.device = device;
            resolve(server);
          })
          .catch(error => {
            reject(error);
          });
      });

    return promise;
  }

  disconnect() {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
  }
}
