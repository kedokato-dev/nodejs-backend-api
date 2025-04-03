const puppeteer = require('puppeteer');

const fetchUserInfo = async (username, password) => {
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
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Điều hướng đến trang hồ sơ sinh viên
    console.log('Đang điều hướng đến trang hồ sơ sinh viên...');
    await page.goto('https://sinhvien.hou.edu.vn/wfrmHoSoSinhVien.aspx', {
      waitUntil: 'networkidle2',
    });

    // Cào dữ liệu từ trang hồ sơ sinh viên
    console.log('Đang cào dữ liệu từ trang hồ sơ sinh viên...');
    const profileData = await page.evaluate(() => {
      const getValue = (selector) => document.querySelector(selector)?.value || 'Không tìm thấy dữ liệu';

      return {
        fullName: getValue('#txtHo_ten'),
        studentId: getValue('#txtMa_sv'),
        birthDate: getValue('#txtNgay_sinh'),
        sex: getValue('#txtGioi_tinh'),
        birthPlace: getValue('#txtNoi_sinh'),
        address: getValue('#txtNoi_o_hien_nay'),
        phoneUser: getValue('#txtDien_thoai_cn'),
        phoneParent: getValue('#txtDien_thoai_nr'),
        email: getValue('#txtEmail'),
      };
    });

    console.log('Cào dữ liệu thành công:', profileData);
    return profileData;
  } catch (error) {
    console.error('Lỗi khi cào dữ liệu hồ sơ sinh viên:', error);
    throw new Error('Không thể cào dữ liệu hồ sơ sinh viên');
  } finally {
    await browser.close();
  }
};

module.exports = { fetchUserInfo };