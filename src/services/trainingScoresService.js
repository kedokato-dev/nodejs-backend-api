const puppeteer = require('puppeteer');

const fetchTrainingScores = async (username, password) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Xóa cookie trước khi bắt đầu
    await page.deleteCookie(...(await page.cookies()));

    // Điều hướng đến trang đăng nhập
    console.log('Đang điều hướng đến trang đăng nhập...');
    await page.goto('https://cas.hou.edu.vn/cas/login?service=https://sinhvien.hou.edu.vn/login.aspx', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Nhập thông tin đăng nhập
    console.log('Đang nhập thông tin đăng nhập...');
    await page.type('#username', username);
    await page.type('#password', password);

    // Đợi nút đăng nhập xuất hiện và kích hoạt
    console.log('Đang kích hoạt nút đăng nhập...');
    await page.waitForSelector('input.btn.btn-submit.btn-block', { visible: true });
    await page.evaluate(() => {
      const loginButton = document.querySelector('input.btn.btn-submit.btn-block');
      if (loginButton) {
        loginButton.removeAttribute('disabled');
      }
    });

    // Nhấn nút đăng nhập
    console.log('Đang nhấn nút đăng nhập...');
    await page.click('input.btn.btn-submit.btn-block');

    // Đợi điều hướng sau khi đăng nhập
    console.log('Đang đợi điều hướng sau khi đăng nhập...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });

    // Điều hướng đến trang kết quả rèn luyện
    console.log('Đang điều hướng đến trang kết quả rèn luyện...');
    await page.goto('https://sinhvien.hou.edu.vn/KetQuaRenLuyen.aspx', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Cào dữ liệu từ trang kết quả rèn luyện
    console.log('Đang cào dữ liệu từ trang kết quả rèn luyện...');
    const trainingScores = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#grdViewLopDangKy tbody tr.RowStyle, #grdViewLopDangKy tbody tr.AltRowStyle'));
      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        return {
          semester: cells[0]?.innerText.trim() || 'Không tìm thấy học kỳ',
          academicYear: cells[1]?.innerText.trim() || 'Không tìm thấy năm học',
          totalScore: cells[2]?.innerText.trim() || 'Không tìm thấy tổng điểm',
          rank: cells[3]?.innerText.trim() || 'Không tìm thấy xếp loại',
        };
      });
    });

    console.log('Cào dữ liệu thành công:', trainingScores);
    return trainingScores;
  } catch (error) {
    console.error('Lỗi khi cào dữ liệu điểm rèn luyện:', error);
    throw new Error('Không thể cào dữ liệu điểm rèn luyện');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = { fetchTrainingScores };