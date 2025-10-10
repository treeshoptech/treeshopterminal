const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3002';
const SCREENSHOT_DIR = '/tmp/treeshop-screenshots';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const pages = [
  { name: 'homepage', url: '/' },
  { name: 'equipment', url: '/equipment' },
  { name: 'employees', url: '/employees' },
  { name: 'loadouts', url: '/loadouts' },
  { name: 'projects', url: '/projects' }
];

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'desktop', width: 1920, height: 1080 }
];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureScreenshot(page, name) {
  const filepath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`✓ Saved: ${name}.png`);
}

async function testPage(browser, pageName, url, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);

  const viewportName = viewport.width === 375 ? 'mobile' : 'desktop';
  console.log(`\n=== Testing ${pageName} on ${viewportName} (${viewport.width}x${viewport.height}) ===`);

  try {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle2', timeout: 10000 });
    await delay(1000); // Let animations settle

    // Take initial screenshot
    await captureScreenshot(page, `${pageName}-${viewportName}-initial`);

    // Check for overlapping elements and layout issues
    const layoutIssues = await page.evaluate(() => {
      const issues = [];

      // Check for horizontal overflow
      if (document.body.scrollWidth > window.innerWidth) {
        issues.push(`Horizontal overflow detected: ${document.body.scrollWidth}px > ${window.innerWidth}px`);
      }

      // Check for elements outside viewport
      const allElements = Array.from(document.querySelectorAll('*'));
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          const tag = el.tagName.toLowerCase();
          const id = el.id ? `#${el.id}` : '';
          const classes = el.className ? `.${el.className.split(' ').join('.')}` : '';
          issues.push(`Element extends beyond viewport: ${tag}${id}${classes}`);
        }
      });

      // Check for very small text
      const textElements = Array.from(document.querySelectorAll('p, span, div, label, button'));
      textElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const fontSize = parseFloat(styles.fontSize);
        if (fontSize < 12 && el.textContent.trim().length > 0) {
          issues.push(`Small text detected (${fontSize}px): "${el.textContent.trim().substring(0, 30)}..."`);
        }
      });

      // Check for invisible/hidden elements that might be broken
      const forms = Array.from(document.querySelectorAll('form'));
      const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
      const buttons = Array.from(document.querySelectorAll('button'));

      return {
        issues: issues.slice(0, 10), // Limit to first 10 issues
        stats: {
          forms: forms.length,
          inputs: inputs.length,
          buttons: buttons.length
        }
      };
    });

    console.log(`  Forms: ${layoutIssues.stats.forms}, Inputs: ${layoutIssues.stats.inputs}, Buttons: ${layoutIssues.stats.buttons}`);
    if (layoutIssues.issues.length > 0) {
      console.log('  Layout Issues:');
      layoutIssues.issues.forEach(issue => console.log(`    - ${issue}`));
    }

    // Test interactive elements based on page type
    if (pageName === 'equipment') {
      console.log('  Testing equipment form...');

      // Try to click "Add Equipment" or similar button
      const addButton = await page.$('button');
      if (addButton) {
        await addButton.click();
        await delay(500);
        await captureScreenshot(page, `${pageName}-${viewportName}-form-opened`);

        // Check if form inputs are visible and clickable
        const formTest = await page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"], select'));
          return {
            inputsFound: inputs.length,
            inputsVisible: inputs.filter(i => {
              const rect = i.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0;
            }).length
          };
        });
        console.log(`    Inputs found: ${formTest.inputsFound}, Visible: ${formTest.inputsVisible}`);
      }
    }

    if (pageName === 'employees') {
      console.log('  Testing employees form...');
      const addButton = await page.$('button');
      if (addButton) {
        await addButton.click();
        await delay(500);
        await captureScreenshot(page, `${pageName}-${viewportName}-form-opened`);
      }
    }

    if (pageName === 'loadouts') {
      console.log('  Testing loadouts form...');
      const addButton = await page.$('button');
      if (addButton) {
        await addButton.click();
        await delay(500);
        await captureScreenshot(page, `${pageName}-${viewportName}-form-opened`);
      }
    }

    if (pageName === 'projects') {
      console.log('  Testing projects interface...');
      await delay(500);

      // Check for pricing calculator elements
      const projectElements = await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        const numberInputs = Array.from(document.querySelectorAll('input[type="number"]'));
        const textareas = Array.from(document.querySelectorAll('textarea'));

        return {
          selects: selects.length,
          numberInputs: numberInputs.length,
          textareas: textareas.length
        };
      });
      console.log(`    Selects: ${projectElements.selects}, Number Inputs: ${projectElements.numberInputs}, Textareas: ${projectElements.textareas}`);
    }

    // Test navigation
    const navLinks = await page.$$('nav a, header a');
    console.log(`  Navigation links found: ${navLinks.length}`);

    // Check for common UI problems
    const uiProblems = await page.evaluate(() => {
      const problems = [];

      // Check for buttons without visible text
      const buttons = Array.from(document.querySelectorAll('button'));
      buttons.forEach(btn => {
        if (!btn.textContent.trim() && !btn.querySelector('svg') && !btn.style.backgroundImage) {
          problems.push('Button with no visible text or icon found');
        }
      });

      // Check for forms without submit buttons
      const forms = Array.from(document.querySelectorAll('form'));
      forms.forEach(form => {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (!submitBtn) {
          problems.push('Form without submit button found');
        }
      });

      // Check for overlapping elements (basic check)
      const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.position === 'fixed' || style.position === 'absolute';
      });

      if (fixedElements.length > 10) {
        problems.push(`Many positioned elements found (${fixedElements.length}) - potential z-index issues`);
      }

      return problems;
    });

    if (uiProblems.length > 0) {
      console.log('  UI Problems:');
      uiProblems.forEach(problem => console.log(`    - ${problem}`));
    }

  } catch (error) {
    console.error(`  Error testing ${pageName}: ${error.message}`);
    await captureScreenshot(page, `${pageName}-${viewportName}-error`);
  }

  await page.close();
}

async function testUserWorkflow(browser) {
  console.log('\n=== Testing Complete User Workflow ===');

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // Step 1: Add Equipment
    console.log('Step 1: Adding equipment...');
    await page.goto(`${BASE_URL}/equipment`, { waitUntil: 'networkidle2' });
    await delay(1000);

    const addEquipmentBtn = await page.$('button');
    if (addEquipmentBtn) {
      const btnText = await page.evaluate(el => el.textContent, addEquipmentBtn);
      console.log(`  Found button: "${btnText}"`);
      await addEquipmentBtn.click();
      await delay(500);
      await captureScreenshot(page, 'workflow-01-equipment-form');

      // Try to fill form
      const fillResult = await page.evaluate(() => {
        const nameInput = document.querySelector('input[name="name"], input[placeholder*="name" i]');
        const typeSelect = document.querySelector('select[name="type"]');

        if (nameInput) {
          nameInput.value = 'Test Equipment';
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        return {
          nameInputFound: !!nameInput,
          typeSelectFound: !!typeSelect
        };
      });
      console.log(`  Form elements - Name: ${fillResult.nameInputFound}, Type: ${fillResult.typeSelectFound}`);
    }

    // Step 2: Add Employee
    console.log('Step 2: Adding employee...');
    await page.goto(`${BASE_URL}/employees`, { waitUntil: 'networkidle2' });
    await delay(1000);
    await captureScreenshot(page, 'workflow-02-employees');

    // Step 3: Create Loadout
    console.log('Step 3: Creating loadout...');
    await page.goto(`${BASE_URL}/loadouts`, { waitUntil: 'networkidle2' });
    await delay(1000);
    await captureScreenshot(page, 'workflow-03-loadouts');

    // Step 4: Price Project
    console.log('Step 4: Pricing project...');
    await page.goto(`${BASE_URL}/projects`, { waitUntil: 'networkidle2' });
    await delay(1000);
    await captureScreenshot(page, 'workflow-04-projects');

    console.log('✓ Workflow test completed');

  } catch (error) {
    console.error(`Error in workflow test: ${error.message}`);
  }

  await page.close();
}

async function main() {
  console.log('Starting TreeShop Terminal UI Analysis...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Screenshots will be saved to: ${SCREENSHOT_DIR}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Test each page on each viewport
  for (const viewport of viewports) {
    for (const pageInfo of pages) {
      await testPage(browser, pageInfo.name, pageInfo.url, viewport);
    }
  }

  // Test complete workflow
  await testUserWorkflow(browser);

  await browser.close();

  console.log('\n=== Analysis Complete ===');
  console.log(`All screenshots saved to: ${SCREENSHOT_DIR}`);
}

main().catch(console.error);
