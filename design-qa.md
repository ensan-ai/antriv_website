# Design QA — ANTRIV Production Site

## Evidence

- Hero source visual: `/workspace/scratch/41f8b021e561/generated_images/exec-49c7f2e5-7fd8-4a95-8d51-68ed2fcf3e21.png`
- Selected post-hero direction: `/workspace/scratch/41f8b021e561/generated_images/exec-808eee86-e56e-4720-b039-4b1b2c5f7cf5.png`.
- Implementation: cloud-browser inspection at `http://terminal.local:4173/`.
- Viewport: 1363 × 936 desktop.
- Same-viewport comparison: the selected graphite/copper direction was cropped to 1363 × 936 and displayed together with the implemented operational-problem section at 1363 × 936.
- Additional visual checks: operational-problem section, workflow transformation section after selecting Report, and open workflow-audit dialog.

## Visual comparison

The finished hero preserves the original corridor direction. From the operational-problem section downward, the selected matte graphite/mineral atmosphere now continues the architectural language with controlled copper light, translucent dark surfaces, and sparse dust. The implementation is intentionally darker than the generated concept so body copy and controls retain production contrast, while the composition, palette, texture direction, and information hierarchy remain aligned.

## Findings and correction history

1. The original proof relied on WebGL and could fail before the interface rendered when the browser had no WebGL context.
   - Correction: retained the Three.js implementation for capable browsers and added an image-backed fallback.
2. Adding production sections initially allowed document-wide scroll position to drive the corridor after the hero had ended.
   - Correction: progress is now calculated only across the hero scroll track.
3. The workflow selector initially used incomplete tab semantics.
   - Correction: it now uses ordinary buttons with `aria-pressed`, while the changing comparison is announced with `aria-live`.
4. The opening hero briefly appeared in its final animation state after a scripted scroll reset during QA.
   - Verification: using the real `#top` navigation reset the state to 0%, hid the final message, and restored the intended opening composition. This was a test-state issue, not a production defect.
5. Final comparison found no visible clipping, accidental overflow, broken hierarchy, missing contact links, or source-direction mismatch in the stable desktop states.
6. The first implementation pass made the background too close to flat black.
   - Correction: raised the generated texture's opacity and brightness, reduced the opaque section tint, and shifted the moving crop toward the copper-lit region.
7. Lossy compression suppressed the smallest dust motes.
   - Correction: retained the optimized WebP for the large mineral background, but used the higher-fidelity PNG for the sparse dust layer.

## Browser and interaction checks

- Header navigation reaches the production sections with the fixed header offset preserved.
- The operational-problem section is readable and aligned in a balanced two-column card grid.
- The workflow selector changes the comparison; selecting Report sets `aria-pressed="true"` and displays the Report copy.
- Motion hover states write `translateY(-4px) scale(1.035)` to the primary navigation and add balanced copper side-light; major CTAs and workflow buttons use the same spring language.
- Computed dust-layer background position changed during a timed check, confirming the ambient drift is active; reduced-motion preferences disable nonessential motion.
- Eyebrows, navigation labels, card indices, supporting copy, workflow labels, footer labels, and other micro-type were enlarged without changing display-headline sizing.
- Begin audit opens the labeled native dialog; Close returns focus and hides it.
- The audit dialog exposes five form controls and clearly states that submission opens the visitor's email application and stores no form data on the site.
- Email, call, and WhatsApp links resolve to `me.dxb.ae@gmail.com`, `+971545670668`, and the matching WhatsApp number.
- No form submission or external message was sent during QA.
- Console inspection found no application-origin errors. The only logged errors were browser-extension metadata messages outside the site.
- Production build completed successfully with Motion 13.1.0.
- Sites worker tests: 4 passed, 0 failed.

## Final result

passed
