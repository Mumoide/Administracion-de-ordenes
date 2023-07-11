function validarRut(rut) {

    const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
  
    if (!rutRegex.test(rut)) {
      return false;
    }
  
    const rutDigits = rut.split('-');
    const rutNumber = parseInt(rutDigits[0], 10);
    const verificationDigit = rutDigits[1].toLowerCase();
  
    let sum = 0;
    let multiplier = 2;
  
    for (let i = rutNumber.toString().length - 1; i >= 0; i--) {
      sum += parseInt(rutNumber.toString().charAt(i), 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
  
    const expectedDigit = 11 - (sum % 11);
    const calculatedDigit = expectedDigit === 11 ? '0' : expectedDigit === 10 ? 'k' : expectedDigit.toString();
  
    return verificationDigit === calculatedDigit;
  }

  module.exports = validarRut;
  