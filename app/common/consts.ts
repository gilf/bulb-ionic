'use strict';

export const DEVICE_ID: string = '0xF7345BF8CCEF';
export const SERVICE_ID: string = '0xffe5';
export const CHARACTERISTICS_ID: string = '0xffe9';

export function getColorValue(red, green, blue) {
  return new Uint8Array([0x56, red, green, blue, 0x00, 0xf0, 0xaa]);
}

