const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:3002';

async function testMobileIssues() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });

  const issues = [];

  // Test Equipment Form on Mobile
  console.log('Testing Equipment Form on Mobile...');
  await page.goto(`${BASE_URL}/equipment`);
  await page.waitForSelector('button');

  const buttons = await page.$$('button');
  await buttons[0].click();
  await new Promise(r => setTimeout(r, 500));

  // Check if form is scrollable
  const scrollTest = await page.evaluate(() => {
    const form = document.querySelector('form') || document.querySelector('[role="dialog"]');
    if (!form) return { hasForm: false };

    const formRect = form.getBoundingClientRect();
    const isOverflowing = form.scrollHeight > window.innerHeight;
    const hasScrollbar = form.scrollHeight > form.clientHeight;

    // Check if inputs are visible
    const inputs = Array.from(document.querySelectorAll('input, select'));
    const hiddenInputs = inputs.filter(input => {
      const rect = input.getBoundingClientRect();
      return rect.bottom > window.innerHeight || rect.top < 0;
    });

    // Check for overlapping labels/inputs
    const labels = Array.from(document.querySelectorAll('label'));
    const overlaps = [];
    labels.forEach(label => {
      const labelRect = label.getBoundingClientRect();
      inputs.forEach(input => {
        const inputRect = input.getBoundingClientRect();
        if (labelRect.bottom > inputRect.top && labelRect.top < inputRect.bottom &&
            labelRect.right > inputRect.left && labelRect.left < inputRect.right) {
          overlaps.push({ label: label.textContent, overlapping: true });
        }
      });
    });

    return {
      hasForm: true,
      formHeight: form.scrollHeight,
      viewportHeight: window.innerHeight,
      isOverflowing,
      hasScrollbar,
      totalInputs: inputs.length,
      hiddenInputs: hiddenInputs.length,
      overlaps: overlaps.length,
      canSeeSubmitButton: (() => {
        const submitBtn = document.querySelector('button[type="submit"]') ||
                         Array.from(document.querySelectorAll('button')).find(b =>
                           b.textContent.toLowerCase().includes('save'));
        if (!submitBtn) return false;
        const rect = submitBtn.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      })()
    };
  });

  console.log('Equipment Form Mobile Results:', scrollTest);

  if (scrollTest.hiddenInputs > 0) {
    issues.push(`Mobile Equipment Form: ${scrollTest.hiddenInputs} inputs not visible in viewport`);
  }
  if (!scrollTest.canSeeSubmitButton) {
    issues.push('Mobile Equipment Form: Submit button not visible without scrolling');
  }

  await page.screenshot({ path: '/tmp/treeshop-screenshots/mobile-equipment-scroll-test.png', fullPage: true });

  // Test Employee Form on Mobile
  console.log('\nTesting Employee Form on Mobile...');
  await page.goto(`${BASE_URL}/employees`);
  await page.waitForSelector('button');
  const empButtons = await page.$$('button');
  await empButtons[0].click();
  await new Promise(r => setTimeout(r, 500));

  const empFormTest = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, select'));
    const submitBtn = document.querySelector('button[type="submit"]') ||
                     Array.from(document.querySelectorAll('button')).find(b =>
                       b.textContent.toLowerCase().includes('save'));

    return {
      totalInputs: inputs.length,
      submitVisible: submitBtn ? submitBtn.getBoundingClientRect().top < window.innerHeight : false,
      formHeight: document.body.scrollHeight
    };
  });

  console.log('Employee Form Mobile Results:', empFormTest);
  await page.screenshot({ path: '/tmp/treeshop-screenshots/mobile-employee-scroll-test.png', fullPage: true });

  // Test Loadout Form on Mobile
  console.log('\nTesting Loadout Form on Mobile...');
  await page.goto(`${BASE_URL}/loadouts`);
  await page.waitForSelector('button');
  const loadButtons = await page.$$('button');
  await loadButtons[0].click();
  await new Promise(r => setTimeout(r, 500));

  const loadoutFormTest = await page.evaluate(() => {
    const equipmentCards = Array.from(document.querySelectorAll('[class*="card"], [class*="equipment"]'));
    const crewCards = Array.from(document.querySelectorAll('[class*="crew"], [class*="employee"]'));

    return {
      equipmentSelectable: equipmentCards.length,
      crewSelectable: crewCards.length,
      formHeight: document.body.scrollHeight,
      viewportHeight: window.innerHeight,
      needsScroll: document.body.scrollHeight > window.innerHeight * 2
    };
  });

  console.log('Loadout Form Mobile Results:', loadoutFormTest);
  await page.screenshot({ path: '/tmp/treeshop-screenshots/mobile-loadout-scroll-test.png', fullPage: true });

  if (loadoutFormTest.needsScroll) {
    issues.push('Mobile Loadout Form: Very tall form requires extensive scrolling');
  }

  await browser.close();

  return issues;
}

async function testDesktopIssues() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const issues = [];

  console.log('\nTesting Desktop Layout Issues...');

  // Test Equipment Page Desktop
  await page.goto(`${BASE_URL}/equipment`);

  const desktopEquipment = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[class*="card"]'));
    const buttons = Array.from(document.querySelectorAll('button'));
    const addButton = buttons.find(b => b.textContent.includes('Add'));

    return {
      cardCount: cards.length,
      addButtonPosition: addButton ? {
        top: addButton.getBoundingClientRect().top,
        right: addButton.getBoundingClientRect().right,
        fixed: window.getComputedStyle(addButton).position === 'fixed'
      } : null,
      wideEnoughForCards: cards.every(card => {
        const width = card.getBoundingClientRect().width;
        return width > 200 && width < 600;
      })
    };
  });

  console.log('Desktop Equipment Layout:', desktopEquipment);

  // Test navigation structure
  await page.goto(`${BASE_URL}/`);

  const navTest = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const navLinks = links.filter(l =>
      l.href.includes('/equipment') ||
      l.href.includes('/employees') ||
      l.href.includes('/loadouts') ||
      l.href.includes('/projects')
    );

    return {
      totalLinks: links.length,
      navLinks: navLinks.length,
      hasNavBar: !!document.querySelector('nav'),
      hasHeader: !!document.querySelector('header')
    };
  });

  console.log('Navigation Test:', navTest);

  if (navTest.navLinks === 0 && !navTest.hasNavBar) {
    issues.push('Desktop: No persistent navigation bar found');
  }

  await browser.close();

  return issues;
}

async function testFormFunctionality() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const issues = [];

  console.log('\nTesting Form Functionality...');

  // Can we actually fill and submit equipment form?
  await page.goto(`${BASE_URL}/equipment`);
  const buttons = await page.$$('button');
  await buttons[0].click();
  await new Promise(r => setTimeout(r, 500));

  try {
    await page.type('input[name="name"]', 'Test Truck', { delay: 50 });
    console.log('✓ Can type in name field');
  } catch (e) {
    issues.push('Equipment Form: Cannot find or type in name input');
    console.log('✗ Cannot type in name field');
  }

  // Check if form validates before submit
  const validationTest = await page.evaluate(() => {
    const form = document.querySelector('form');
    const inputs = Array.from(document.querySelectorAll('input[required]'));
    return {
      hasForm: !!form,
      requiredFields: inputs.length,
      hasValidation: inputs.some(i => i.hasAttribute('required'))
    };
  });

  console.log('Form Validation:', validationTest);

  await page.screenshot({ path: '/tmp/treeshop-screenshots/form-filled-test.png' });

  await browser.close();

  return issues;
}

async function main() {
  console.log('=== Starting Detailed UI Analysis ===\n');

  const mobileIssues = await testMobileIssues();
  const desktopIssues = await testDesktopIssues();
  const formIssues = await testFormFunctionality();

  const allIssues = [...mobileIssues, ...desktopIssues, ...formIssues];

  console.log('\n=== SUMMARY OF ISSUES FOUND ===');
  if (allIssues.length === 0) {
    console.log('No major issues detected!');
  } else {
    allIssues.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue}`);
    });
  }

  // Write detailed report
  const report = {
    timestamp: new Date().toISOString(),
    mobile: mobileIssues,
    desktop: desktopIssues,
    forms: formIssues,
    totalIssues: allIssues.length
  };

  fs.writeFileSync('/tmp/treeshop-screenshots/report.json', JSON.stringify(report, null, 2));
  console.log('\nDetailed report saved to: /tmp/treeshop-screenshots/report.json');
}

main().catch(console.error);
