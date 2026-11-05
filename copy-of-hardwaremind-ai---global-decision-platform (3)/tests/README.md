# Visual Regression Testing

This directory contains visual regression tests for the AIVA platform using Playwright.

## Overview

Visual regression testing helps detect unintended visual changes by comparing screenshots of the application against baseline images. These tests ensure that UI updates don't break existing designs.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install chromium
```

## Running Tests

### Create/Update Baseline Screenshots

On first run or when you want to update baselines:
```bash
npm run test:visual:update
```

### Run Visual Regression Tests

Compare current UI against baselines:
```bash
npm run test:visual
```

### Run Tests with UI Mode

Interactive test runner with visual feedback:
```bash
npm run test:visual:ui
```

## Test Coverage

The visual regression tests cover:

- **HomeView**: Hero section, glassmorphic cards, startup radar, news feed
- **ProductsView**: Product grid, filter panel, product cards
- **KeynoteView**: Video player, playlist, controls
- **Responsive Design**: Mobile and tablet viewports
- **Component States**: Navbar, modals, buttons
- **Theme Modes**: Both dark and light themes

## Best Practices

1. **Run tests before committing**: Ensure no unintended visual changes
2. **Update baselines intentionally**: Only update when design changes are intentional
3. **Review diffs carefully**: Check the HTML report for visual differences
4. **Test in CI**: Run visual tests in continuous integration
5. **Keep baselines in version control**: Track visual changes over time

## Troubleshooting

### Tests are slow
- Visual regression tests take time to render and capture screenshots
- First run is slower as it creates baselines
- Consider running specific tests: `npx playwright test tests/visual-regression.spec.ts:39`

### Screenshots don't match
- Check the HTML report: `npx playwright show-report`
- Review actual vs expected images
- Update baselines if changes are intentional: `npm run test:visual:update`

### Server not starting
- Ensure port 3000 is available
- Check that `npm run dev` works independently
- Playwright config will start the dev server automatically

## Configuration

See `playwright.config.ts` for configuration options:
- Viewport sizes
- Browser settings
- Screenshot comparison thresholds
- Timeout settings

## Requirements Validation

These tests validate:
- **需求 1-10**: Overall visual consistency and futuristic design
- **需求 6**: Glassmorphic effects, holographic buttons, dynamic inputs
- **需求 7**: Animation system and transitions
- **需求 8**: Responsive design across devices
