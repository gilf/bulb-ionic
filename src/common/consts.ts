'use strict';

export const SERVICE_ID: number = 0xffe5;
export const CHARACTERISTIC_ID: number = 0xffe9;

export function getColorValue(red: number, green: number, blue: number) {
  return new Uint8Array([0x56, red, green, blue, 0, 0xf0, 0xaa]);
}

export function getWhiteValue(warmWhite: number) {
  return new Uint8Array([0x56, 0, 0, 0, warmWhite, 0x0f, 0xaa]);
}

