'use strict';

import bluetoothConnector from '../common/bluetoothConnector';

export default class bluetoothService {
  private service: any;
  private connector: bluetoothConnector;

  constructor() {
    this.connector = new bluetoothConnector();
  }

  connect(serviceName: any): Promise<any> {
    return new Promise<any>((resolve, reject)=> {
      this.connector.connect([serviceName]).then((server) => {
        this.service = server.getPrimaryService(serviceName);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }

  disconnect() {
    this.connector.disconnect();
  }

  getCharacteristic(characteristic: string)  {
    if (!this.service || !characteristic) {
      return null;
    }

    return this.service.getCharacteristic(characteristic);
  }

  getCharacteristics(characteristicUuid?: string)  {
    if (!this.service) {
      return null;
    }

    if (characteristicUuid) {
       return this.service.getCharacteristics(characteristicUuid);
    }

    return this.service.getCharacteristics();
  }

  read(characteristic: any): Promise<any> {
    return new Promise<any>((resolve, reject)=> {
      this.getCharacteristic(characteristic).then((reader) => {
        resolve(reader.readValue());
      }).catch(error => {
        reject(error);
      });
    });
  }

  write(characteristic: any, value): void {
    this.getCharacteristic(characteristic).then((writer) => {
      writer.writeValue(value);
    });
  }
}
