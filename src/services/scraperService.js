const puppeteer = require('puppeteer');

const scrapeData = async (username, password) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Điều hướng đến trang đăng nhập
    console.log('Đang điều hướng đến trang đăng nhập...');
    await page.goto('https://cas.hou.edu.vn/cas/login?service=https://sinhvien.hou.edu.vn/login.aspx', {
      waitUntil: 'networkidle2',
    });

    // Nhập thông tin đăng nhập
    console.log('Đang nhập thông tin đăng nhập...');
    await page.type('#username', username);
    await page.type('#password', password);

    // Đợi nút đăng nhập xuất hiện
    console.log('Đang đợi nút đăng nhập xuất hiện...');
    await page.waitForSelector('input.btn.btn-submit.btn-block', { visible: true });

    // Loại bỏ thuộc tính "disabled" của nút đăng nhập
    console.log('Đang kích hoạt nút đăng nhập...');
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
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Cào dữ liệu
    console.log('Đang cào dữ liệu...');
    const data = await page.evaluate(() => {
      const userInfo = document.querySelector('#HeaderSV1_lblHo_ten')?.innerText || 'Không tìm thấy thông tin người dùng';
      const additionalData = document.querySelector('#HeaderSV1_lblMa_sv')?.innerText || 'Không tìm thấy dữ liệu bổ sung';
      return { userInfo, additionalData };
    });

    console.log('Cào dữ liệu thành công:', data);
    return data;
  } catch (error) {
    console.error('Lỗi khi cào dữ liệu:', error);
    throw new Error('Không thể cào dữ liệu từ trang web');
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeData };