export const SERVICE_ID = 0xffe5;
export const CHARACTERISTIC_ID = 0xffe9;
export const BULB_COLORS = 'bulbColors';

export function getColorValue(red: number, green: number, blue: number, warmWhite: number) {
  return new Uint8Array([0x56, red, green, blue, warmWhite, 0xf0, 0xaa]);
}
