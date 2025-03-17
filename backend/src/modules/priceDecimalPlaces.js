const priceDecimalPlaces = (price) => {
  let displayPrice = price.toString();

  function countDecimalPlaces(price) {
    const numberAsString = price.toString();
    if (numberAsString.includes(".")) {
      return numberAsString.split(".")[1].length;
    } else {
      return 0;
    }
  }

  const decimalPlaces = countDecimalPlaces(price);

  if (decimalPlaces == 0) {
    displayPrice = displayPrice + ".00";
  } else if (decimalPlaces == 1) {
    displayPrice = displayPrice + "0";
  } else {
    displayPrice = displayPrice;
  }
//   console.log(displayPrice);
  return displayPrice;
};

module.exports = priceDecimalPlaces;
