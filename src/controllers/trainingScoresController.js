const { fetchTrainingScores } = require('../services/trainingScoresService');
require('dotenv').config(); // Để sử dụng biến môi trường từ file .env

const trainingScoreController = async (req, res) => {
  const username = process.env.ACCOUNT || req.body.username;
  const password = process.env.PASSWORD || req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin đăng nhập (username hoặc password)',
    });
  }

  try {
    const trainingScores = await fetchTrainingScores(username, password);
    res.status(200).json({ success: true, data: trainingScores });
  } catch (error) {
    console.error('Lỗi khi cào dữ liệu điểm rèn luyện:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể cào dữ liệu điểm rèn luyện',
      error: error.message,
    });
  }
};

module.exports = { trainingScoreController };