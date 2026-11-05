# Accessibility Testing Guide

## Manual Testing Checklist

This guide provides step-by-step instructions for manually testing the accessibility features of the AIVA platform.

## Prerequisites

### Tools Needed

1. **Browser Extensions**:
   - [axe DevTools](https://www.deque.com/axe/devtools/) - Automated accessibility testing
   - [WAVE](https://wave.webaim.org/extension/) - Web accessibility evaluation tool
   - [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome DevTools

2. **Screen Readers**:
   - **macOS**: VoiceOver (built-in, Cmd+F5 to enable)
   - **Windows**: [NVDA](https://www.nvaccess.org/) (free) or JAWS (paid)
   - **Linux**: Orca (built-in)

3. **Testing Browsers**:
   - Chrome/Edge (latest)
   - Firefox (latest)
   - Safari (latest)

## 1. Keyboard Navigation Testing

### Test 1: Tab Navigation

**Steps**:
1. Open the AIVA homepage
2. Press Tab repeatedly
3. Observe focus indicators

**Expected Results**:
- ✅ Focus moves through all interactive elements in logical order
- ✅ Focus indicator is clearly visible (cyan glow in dark mode, blue in light mode)
- ✅ No elements are skipped
- ✅ No keyboard trap (except in modals)

**Test Sequence**:
```
Tab 1: Skip link (appears on focus)
Tab 2: Logo/Home link
Tab 3: Navigation item 1
Tab 4: Navigation item 2
...
Tab N: Search input
Tab N+1: Theme toggle
Tab N+2: Language toggle
Tab N+3: First product card
...
```

### Test 2: Enter/Space Activation

**Steps**:
1. Tab to a button or link
2. Press Enter or Space

**Expected Results**:
- ✅ Element activates (same as clicking)
- ✅ Appropriate action occurs (navigation, modal opens, etc.)

### Test 3: Escape Key

**Steps**:
1. Open a modal (click any product card)
2. Press Escape

**Expected Results**:
- ✅ Modal closes
- ✅ Focus returns to the element that opened the modal

### Test 4: Arrow Keys

**Steps**:
1. Navigate to a dropdown or select element
2. Use arrow keys to navigate options

**Expected Results**:
- ✅ Arrow keys navigate through options
- ✅ Selection updates visually

### Test 5: Skip Links

**Steps**:
1. Load the homepage
2. Press Tab once
3. Observe the skip link

**Expected Results**:
- ✅ "Skip to main content" link appears
- ✅ Link is styled and visible
- ✅ Pressing Enter jumps to main content
- ✅ Focus moves to main content area

## 2. Screen Reader Testing

### VoiceOver (macOS)

**Enable VoiceOver**:
- Press Cmd+F5
- Or: System Preferences > Accessibility > VoiceOver > Enable

**Basic Commands**:
- `VO` = Control + Option
- `VO + Right Arrow` = Next item
- `VO + Left Arrow` = Previous item
- `VO + Space` = Activate item
- `VO + U` = Rotor (navigate by headings, links, etc.)

### Test 1: Page Structure

**Steps**:
1. Enable VoiceOver
2. Navigate to homepage
3. Press VO+U to open rotor
4. Select "Headings"

**Expected Results**:
- ✅ One h1 per page (main title)
- ✅ Logical heading hierarchy (h1 → h2 → h3)
- ✅ Headings describe content sections

**Example Heading Structure**:
```
h1: AIVA - AI-Powered Hardware Intelligence
  h2: Recent Views
  h2: Core Values
    h3: Data-Driven Decisions
    h3: Global Perspective
  h2: Latest Products
  h2: Startup Stories
```

### Test 2: Landmarks

**Steps**:
1. Enable VoiceOver
2. Press VO+U to open rotor
3. Select "Landmarks"

**Expected Results**:
- ✅ Navigation landmark (navbar)
- ✅ Main landmark (main content)
- ✅ Banner landmark (header)
- ✅ Contentinfo landmark (footer, if present)

### Test 3: Images

**Steps**:
1. Enable VoiceOver
2. Navigate through product cards
3. Listen to image descriptions

**Expected Results**:
- ✅ All images have alt text
- ✅ Alt text is descriptive (product name)
- ✅ Decorative images are hidden (aria-hidden="true")

### Test 4: Forms

**Steps**:
1. Navigate to search input
2. Listen to label announcement

**Expected Results**:
- ✅ Input has associated label
- ✅ Label is announced before input
- ✅ Placeholder text is announced
- ✅ Error messages are announced

### Test 5: Dynamic Content

**Steps**:
1. Favorite a product
2. Listen for toast announcement

**Expected Results**:
- ✅ Toast is announced automatically
- ✅ Announcement is polite (doesn't interrupt)
- ✅ Message content is clear

## 3. Color Contrast Testing

### Using Chrome DevTools

**Steps**:
1. Open Chrome DevTools (F12)
2. Go to Elements tab
3. Select an element with text
4. Look at Styles panel
5. Click the color swatch next to color property
6. View contrast ratio

**Expected Results**:
- ✅ Normal text: 4.5:1 or higher
- ✅ Large text (18px+): 3:1 or higher
- ✅ Green checkmark in color picker

### Using axe DevTools

**Steps**:
1. Install axe DevTools extension
2. Open DevTools
3. Go to axe DevTools tab
4. Click "Scan ALL of my page"
5. Review "Color Contrast" issues

**Expected Results**:
- ✅ No critical color contrast issues
- ⚠️ Some warnings acceptable for decorative elements

### Manual Spot Checks

**Dark Mode**:
- ✅ White text on #050505: 21:1 (Excellent)
- ✅ Cyan (#00FFC6) on #050505: 15.2:1 (Excellent)
- ✅ Magenta (#FF5FD2) on #050505: 8.9:1 (Excellent)

**Light Mode**:
- ✅ Black text on #f6f7fb: 18.5:1 (Excellent)
- ⚠️ Blue (#0071e3) on #f6f7fb: 4.39:1 (Close, needs improvement)
- ❌ Purple (#bf5af2) on #f6f7fb: 3.29:1 (Fails for normal text)

## 4. Reduced Motion Testing

### Enable Reduced Motion

**macOS**:
1. System Preferences > Accessibility
2. Display > Reduce motion

**Windows**:
1. Settings > Ease of Access
2. Display > Show animations in Windows

**Browser DevTools**:
1. Chrome DevTools > Rendering tab
2. Check "Emulate CSS media feature prefers-reduced-motion"

### Test Steps

**Steps**:
1. Enable reduced motion
2. Navigate to homepage
3. Observe animations

**Expected Results**:
- ✅ Animations are simplified or disabled
- ✅ Page transitions are instant or very quick
- ✅ Hover effects are minimal
- ✅ No parallax scrolling
- ✅ Core functionality still works

## 5. Focus Management Testing

### Test 1: Modal Focus Trap

**Steps**:
1. Click a product card to open modal
2. Press Tab repeatedly
3. Try to tab outside modal

**Expected Results**:
- ✅ Focus stays within modal
- ✅ Tab cycles through modal elements
- ✅ Shift+Tab cycles backwards
- ✅ Can't tab to elements behind modal

### Test 2: Focus Restoration

**Steps**:
1. Tab to a product card
2. Press Enter to open modal
3. Press Escape to close modal
4. Observe focus

**Expected Results**:
- ✅ Focus returns to product card
- ✅ Focus indicator is visible
- ✅ Can continue tabbing from that point

### Test 3: Focus Indicators

**Steps**:
1. Tab through the page
2. Observe focus indicators on each element

**Expected Results**:
- ✅ All interactive elements have visible focus
- ✅ Focus ring is at least 2px wide
- ✅ Focus ring has sufficient contrast
- ✅ Focus ring doesn't obscure content

## 6. Mobile Accessibility Testing

### Touch Target Size

**Steps**:
1. Open site on mobile device or use DevTools mobile emulation
2. Try to tap small buttons
3. Measure button sizes

**Expected Results**:
- ✅ All buttons are at least 44x44px
- ✅ Adequate spacing between touch targets
- ✅ No accidental taps on adjacent elements

### Mobile Screen Reader

**iOS VoiceOver**:
1. Settings > Accessibility > VoiceOver
2. Enable VoiceOver
3. Navigate site with swipe gestures

**Android TalkBack**:
1. Settings > Accessibility > TalkBack
2. Enable TalkBack
3. Navigate site with swipe gestures

**Expected Results**:
- ✅ All elements are announced
- ✅ Swipe gestures work correctly
- ✅ Double-tap activates elements
- ✅ Rotor/reading controls work

## 7. Form Accessibility Testing

### Test 1: Input Labels

**Steps**:
1. Navigate to search input
2. Check for associated label
3. Test with screen reader

**Expected Results**:
- ✅ Input has visible label or placeholder
- ✅ Label is programmatically associated
- ✅ Screen reader announces label

### Test 2: Error Messages

**Steps**:
1. Submit a form with invalid data
2. Observe error messages
3. Test with screen reader

**Expected Results**:
- ✅ Error messages are visible
- ✅ Errors are announced by screen reader
- ✅ Input has aria-invalid="true"
- ✅ Error message has role="alert"

### Test 3: Required Fields

**Steps**:
1. Find required form fields
2. Check for required indicator

**Expected Results**:
- ✅ Required fields are marked visually
- ✅ Required fields have aria-required="true"
- ✅ Screen reader announces "required"

## 8. ARIA Attributes Testing

### Using Browser DevTools

**Steps**:
1. Open DevTools
2. Go to Elements tab
3. Select an element
4. Look at Accessibility panel

**Expected Results**:
- ✅ Role is appropriate
- ✅ Name is descriptive
- ✅ States are correct (expanded, selected, etc.)

### Common ARIA Patterns to Check

**Modals**:
```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Modal Title</h2>
  ...
</div>
```

**Toasts**:
```html
<div role="alert" aria-live="polite">
  Success! Item added to favorites.
</div>
```

**Buttons**:
```html
<button aria-label="Close modal">
  <X />
</button>
```

**Inputs**:
```html
<input
  aria-invalid="true"
  aria-describedby="error-message"
/>
<div id="error-message" role="alert">
  Please enter a valid email
</div>
```

## 9. Automated Testing

### Lighthouse Audit

**Steps**:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Accessibility" category
4. Click "Generate report"

**Expected Results**:
- ✅ Accessibility score: 90+
- ✅ No critical issues
- ⚠️ Some warnings acceptable

### axe DevTools Scan

**Steps**:
1. Install axe DevTools extension
2. Open DevTools
3. Go to axe DevTools tab
4. Click "Scan ALL of my page"

**Expected Results**:
- ✅ No critical issues
- ✅ No serious issues
- ⚠️ Some moderate issues acceptable
- ℹ️ Minor issues documented

### WAVE Evaluation

**Steps**:
1. Install WAVE extension
2. Click WAVE icon in toolbar
3. Review results

**Expected Results**:
- ✅ No errors
- ⚠️ Some alerts acceptable
- ℹ️ Features documented

## 10. Browser Compatibility Testing

### Test Browsers

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Test Features

**For each browser**:
1. Keyboard navigation
2. Focus indicators
3. Screen reader compatibility
4. Color contrast
5. Reduced motion

**Expected Results**:
- ✅ All features work consistently
- ✅ No browser-specific issues
- ✅ Graceful degradation where needed

## Testing Checklist

### Quick Test (15 minutes)

- [ ] Tab through homepage
- [ ] Open and close a modal with keyboard
- [ ] Test skip link
- [ ] Run Lighthouse audit
- [ ] Check color contrast in DevTools

### Comprehensive Test (1 hour)

- [ ] Full keyboard navigation test
- [ ] Screen reader test (VoiceOver/NVDA)
- [ ] Color contrast audit
- [ ] Reduced motion test
- [ ] Focus management test
- [ ] Mobile accessibility test
- [ ] ARIA attributes review
- [ ] Automated testing (Lighthouse, axe, WAVE)

### Full Audit (4 hours)

- [ ] All comprehensive tests
- [ ] Multiple browser testing
- [ ] Multiple screen reader testing
- [ ] User testing with assistive technology users
- [ ] Documentation review
- [ ] Issue tracking and prioritization

## Common Issues and Solutions

### Issue: Focus not visible
**Solution**: Add focus-visible styles with sufficient contrast

### Issue: Modal focus trap not working
**Solution**: Implement focus trap with Tab key handler

### Issue: Screen reader not announcing changes
**Solution**: Add aria-live regions for dynamic content

### Issue: Color contrast too low
**Solution**: Darken text color or lighten background

### Issue: Keyboard trap (not in modal)
**Solution**: Ensure all elements are keyboard accessible

### Issue: Missing alt text
**Solution**: Add descriptive alt attributes to all images

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Screen Readers
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome/mac)
- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)

## Reporting Issues

When reporting accessibility issues, include:

1. **Issue Description**: What's wrong?
2. **WCAG Criterion**: Which guideline does it violate?
3. **Severity**: Critical, Serious, Moderate, Minor
4. **Steps to Reproduce**: How to find the issue
5. **Expected Behavior**: What should happen
6. **Actual Behavior**: What actually happens
7. **Screenshots/Videos**: Visual evidence
8. **Assistive Technology**: Screen reader, browser, OS

## Conclusion

Regular accessibility testing ensures the AIVA platform remains usable for all users. Follow this guide for comprehensive testing, and address issues promptly to maintain WCAG 2.1 Level AA compliance.
