const validator = require('validator');
const db = require('../db');

/**
 * Memvalidasi payload pembuatan user baru
 * @param {Object} data - { name, phone, email }
 * @returns {Promise<Object>} { isValid: boolean, message: string|null, statusCode: number|null }
 */
async function validateUserData({ name, phone, email }) {
  if (!name || !phone) {
    return {
      isValid: false,
      statusCode: 400,
      message: 'Nama dan nomor telepon wajib diisi!'
    };
  }

  if (!validator.isMobilePhone(phone, 'any')) {
    return {
      isValid: false,
      statusCode: 400,
      message: 'Format nomor HP tidak valid!'
    };
  }

  if (email && !validator.isEmail(email)) {
    return {
      isValid: false,
      statusCode: 400,
      message: 'Format email tidak valid!'
    };
  }

  const existingUser = await db.findUserByPhone(phone);
  if (existingUser) {
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