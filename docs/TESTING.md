# Artifact Display Feature - Testing Checklist

## Desktop Testing (>768px)

### Panel Behavior
- [ ] Click document thumbnail → panel slides in from right
- [ ] Click code thumbnail → panel slides in with code
- [ ] Click chart thumbnail → panel slides in with chart
- [ ] Click X button → panel slides out
- [ ] Press ESC key → panel closes
- [ ] Panel width is 500px
- [ ] Panel doesn't block chat interaction

### Artifact List
- [ ] Click "Artifacts (3)" → dropdown toggles open/closed
- [ ] All 3 artifacts shown in list
- [ ] Correct icons for each type (code, document, chart)
- [ ] Active artifact highlighted in list
- [ ] Click list item → switches artifact
- [ ] Dropdown closes after selection

### Content Rendering
- [ ] **Document:** Markdown rendered correctly (headings, lists, bold)
- [ ] **Code:** Syntax highlighting active (Python keywords colored)
- [ ] **Code:** Line numbers displayed
- [ ] **Chart:** Bar chart renders with correct data
- [ ] **Chart:** Legend shows "Revenue" and "Target"
- [ ] All content scrollable if needed

### Copy Functionality
- [ ] Click copy button → content copied to clipboard
- [ ] Paste works in external editor
- [ ] Button shows checkmark briefly
- [ ] Green background appears for 2 seconds

## Mobile Testing (<768px)

### Panel Behavior
- [ ] Panel opens as fullscreen overlay
- [ ] Backdrop (dark overlay) appears behind panel
- [ ] Click backdrop → panel closes
- [ ] Panel takes full viewport width/height
- [ ] Content readable and scrollable

### Responsive Adjustments
- [ ] Thumbnails stack vertically in chat
- [ ] "Open" button full width on thumbnails
- [ ] Font sizes readable on small screens
- [ ] Code blocks scroll horizontally
- [ ] Chart fits within viewport

## Cross-Browser Testing

### Chrome/Edge
- [ ] All features work
- [ ] Prism.js highlights correctly
- [ ] Chart.js renders properly

### Firefox
- [ ] All features work
- [ ] Syntax highlighting active
- [ ] Chart displays correctly

### Safari
- [ ] All features work
- [ ] No layout issues
- [ ] Libraries load correctly

## Performance

- [ ] Panel animations smooth (no jank)
- [ ] Chart rendering under 1 second
- [ ] No console errors
- [ ] Libraries load successfully (check Network tab)

## Accessibility

- [ ] Keyboard navigation works (Tab, ESC)
- [ ] Buttons have visible focus states
- [ ] Color contrast sufficient for text
- [ ] Screen reader friendly (test title attributes)

## Edge Cases

- [ ] Switch artifacts rapidly → no errors
- [ ] Open panel, close, reopen → works correctly
- [ ] Copy empty artifact → handles gracefully
- [ ] Resize window with panel open → stays functional

---

**Tested by:** _____________
**Date:** _____________
**Browser/Device:** _____________
**Result:** PASS / FAIL
**Notes:**
