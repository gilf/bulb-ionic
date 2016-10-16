export const serviceId = 0xffe5;
export const charasteristicId = 0xffe9;
export const notificationServiceId = 0xffe0;
export const notificationCharacteristicId = 0xffe4;

export const readBulbStateCommand = new Uint8Array([0xef, 0x01, 0x77]);

export function getColorValue(red: number, green: number, blue: number) {
  return new Uint8Array([0x56, red, green, blue, 0, 0xf0, 0xaa]);
}

export function getWhiteValue(warmWhite: number) {
  return new Uint8Array([0x56, 0, 0, 0, warmWhite, 0x0f, 0xaa]);
}
