const { scrapeData } = require('../services/scraperService');
require('dotenv').config(); // Để sử dụng biến môi trường từ file .env

const scrapeController = async (req, res) => {
  try {
    const username = process.env.ACCOUNT || req.body.username;
    const password = process.env.PASSWORD || req.body.password;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin đăng nhập (username hoặc password)',
      });
    }

    const data = await scrapeData(username, password);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cào dữ liệu thất bại',
      error: error.message,
    });
  }
};

module.exports = { scrapeController };