export function getFormattedAddress(address) {
  let text = "";
  if (address) {
    if (address.line1) {
      text += address.line1 + " "
    }
    if (address.line2) {
      text += address.line2;
    }
    text +=
      (address.city ? ", " + address.city : "") +
      (address.region ? ", " + address.region : "") +
      (address.postal_code ? ", " + address.postal_code : "");
  }
  return text;
}
