# Visual Regression Testing Quick Start Guide

## What is Visual Regression Testing?

Visual regression testing automatically captures screenshots of your application and compares them against baseline images to detect unintended visual changes. This is crucial for maintaining the futuristic UI design of the AIVA platform.

## Quick Start

### 1. First Time Setup (Already Done ✅)
```bash
# Dependencies are already installed
# Playwright browsers are already installed
```

### 2. Create Baseline Screenshots
**Important**: Run this command first to create your baseline images:
```bash
npm run test:visual:update
```

This will:
- Start the dev server automatically
- Navigate through all test pages
- Capture screenshots in both dark and light modes
- Save baseline images for future comparisons

**Note**: This may take 2-3 minutes to complete.

### 3. Run Visual Regression Tests
After making UI changes, run:
```bash
npm run test:visual
```

This will:
- Compare current UI against baselines
- Report any visual differences
- Generate an HTML report with side-by-side comparisons

### 4. Review Test Results
```bash
npx playwright show-report
```

This opens an interactive HTML report showing:
- ✅ Passed tests (no visual changes)
- ❌ Failed tests (visual differences detected)
- Side-by-side comparison of expected vs actual
- Diff highlighting showing exactly what changed

## Common Workflows

### Before Committing Code
```bash
# Run visual tests
npm run test:visual

# If tests fail, review the report
npx playwright show-report

# If changes are intentional, update baselines
npm run test:visual:update
```

### After Updating Components
```bash
# Update baselines for intentional changes
npm run test:visual:update

# Commit the new baseline screenshots
git add tests/**/*.png
git commit -m "Update visual regression baselines"
```

### Interactive Testing
```bash
# Run tests with UI mode for debugging
npm run test:visual:ui
```

## What Gets Tested?

### Views:
- ✅ HomeView (dark & light modes)
- ✅ ProductsView (dark & light modes)
- ✅ KeynoteView (dark & light modes)

### Responsive Design:
- ✅ Desktop (1920x1080)
- ✅ Mobile (375x667 - iPhone SE)
- ✅ Tablet (768x1024 - iPad)

### Components:
- ✅ Navbar
- ✅ Glassmorphic cards
- ✅ Product cards
- ✅ Buttons and inputs

## Understanding Test Results

### ✅ Test Passed
No visual changes detected. Your UI matches the baseline.

### ❌ Test Failed
Visual differences detected. This could mean:
1. **Intentional change**: You updated the design → Update baselines
2. **Unintended change**: Something broke → Fix the issue
3. **False positive**: Minor rendering difference → Adjust maxDiffPixels threshold

### Reviewing Failures
1. Open the HTML report: `npx playwright show-report`
2. Click on failed test
3. Review the diff image (red = removed, green = added)
4. Decide: Fix code or update baseline

## Tips & Best Practices

### ✅ DO:
- Run tests before committing UI changes
- Review diffs carefully before updating baselines
- Commit baseline screenshots to version control
- Run tests in CI/CD pipeline

### ❌ DON'T:
- Blindly update baselines without reviewing changes
- Ignore test failures
- Delete baseline screenshots
- Run tests while actively developing (too many changes)

## Troubleshooting

### Tests are slow
- First run creates baselines (slower)
- Subsequent runs are faster
- Consider running specific tests: `npx playwright test tests/visual-regression.spec.ts:39`

### Screenshots don't match
- Check the HTML report for details
- Small differences (anti-aliasing) are expected
- Update baselines if changes are intentional

### Server won't start
- Ensure port 3000 is available
- Check that `npm run dev` works independently
- Playwright will start the server automatically

## Advanced Usage

### Run Specific Tests
```bash
# Run only HomeView tests
npx playwright test -g "HomeView"

# Run only dark mode tests
npx playwright test -g "dark mode"

# Run only responsive tests
npx playwright test -g "Responsive"
```

### Debug Mode
```bash
# Run with headed browser (see what's happening)
npx playwright test --headed

# Run with debug mode
npx playwright test --debug
```

### Update Specific Baselines
```bash
# Update only HomeView baselines
npx playwright test -g "HomeView" --update-snapshots
```

## Integration with CI/CD

Add to your CI pipeline:
```yaml
- name: Run Visual Regression Tests
  run: npm run test:visual
  
- name: Upload Test Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Need Help?

- 📖 Full documentation: `tests/README.md`
- 🔧 Configuration: `playwright.config.ts`
- 🧪 Test file: `tests/visual-regression.spec.ts`
- 📊 Playwright docs: https://playwright.dev/docs/test-snapshots

---

**Ready to start?** Run `npm run test:visual:update` to create your first baselines! 🚀
