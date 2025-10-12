const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Going to login page...');
  await page.goto('http://localhost:3002/login', { waitUntil: 'networkidle0' });

  // Take screenshot of login page
  await page.screenshot({ path: '/tmp/01-login-page.png' });
  console.log('Screenshot saved: /tmp/01-login-page.png');

  // Fill in login form
  console.log('Filling in login form...');
  await page.type('input[name="email"]', 'test@test.com');
  await page.type('input[name="password"]', 'password123');

  // Click sign in
  console.log('Clicking sign in...');
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {
    console.log('Navigation timeout - checking current URL...');
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('Current URL:', page.url());

  // Take screenshot after login
  await page.screenshot({ path: '/tmp/02-after-login.png', fullPage: true });
  console.log('Screenshot saved: /tmp/02-after-login.png');

  // Get page content
  const content = await page.content();
  console.log('Page HTML length:', content.length);

  // Check for errors in console
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  await new Promise(resolve => setTimeout(resolve, 5000));

  await browser.close();
})();
