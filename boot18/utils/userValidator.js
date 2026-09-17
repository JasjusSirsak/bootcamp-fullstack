const validator = require('validator');
const db = require('../db');

/**
 * Memvalidasi payload pembuatan user baru
 * @param {Object} data - { nama, phone, email }
 * @returns {Object} { isValid: boolean, message: string|null, statusCode: number|null }
 */
function validateUserData({ nama, phone, email }) {
  if (!nama || !phone) {
    return {
      isValid: false,
      statusCode: 400,
      message: 'Nama dan nomor telepon wajib diisi!'
    };
  }

  if (!validator.isMobilePhone(phone, 'id-ID')) {
    return {
      isValid: false,
      statusCode: 400,
      message: 'Nomor HP tidak valid untuk wilayah Indonesia!'
    };
  }

  if (email && !validator.isEmail(email)) {
    return {
      isValid: false,
      statusCode: 400,
      message: 'Format email tidak valid!'
    };
  }

  if (db.findUserByPhone(phone)) {
    return {
      isValid: false,
      statusCode: 409,
      message: 'Nomor HP sudah terdaftar!'
    };
  }

  return { isValid: true, message: null, statusCode: null };
}

module.exports = {
  validateUserData
};