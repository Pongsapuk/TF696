import { useEffect } from 'react'

/** Gestures that mean the visitor has taken the viewport over themselves. */
const USER_INTENT = ['wheel', 'touchstart', 'keydown', 'pointerdown']

/**
 * Re-applies a fragment deep link once React has rendered.
 *
 * The problem (measured in Phase 6 §23.5): opening
 * `https://pongsapuk.github.io/TF696/#recruitment` cold leaves the page at the
 * top. The browser looks for `#recruitment` while parsing the HTML, and at that
 * moment the document is `<div id="root"></div>` — the section does not exist
 * yet. By the time React renders it, the browser has already given up. In-page
 * navigation is unaffected, because there the target is already in the DOM.
 *
 * The fix is deliberately not a router: there is one document and one set of
 * in-page anchors, and nothing else about the page wants routing. This just
 * re-does what the browser would have done, at the first moment it can.
 *
 * Behaviour it is careful about:
 *  - It never touches focus. Moving focus on load would relocate a keyboard
 *    user's starting point silently and re-announce content in a screen reader.
 *  - It uses `behavior: 'instant'`, not `'auto'`. `'auto'` defers to the CSS
 *    `scroll-behavior: smooth` on `html`, which would animate the whole
 *    document height on what is supposed to be a direct arrival — and would
 *    hand motion to reduced-motion users who did not ask for it. `'instant'`
 *    is the same jump the browser itself performs for a warm fragment load.
 *  - `scrollIntoView` honours `scroll-margin-top`, so the 5rem offset that
 *    keeps a target clear of the fixed header applies here too.
 *  - It does not write to `location.hash`, so no history entry is added and the
 *    URL the visitor was given is the URL they keep.
 *
 * **Why it scrolls twice.** The web fonts almost always finish loading after
 * mount, and the fallback and loaded metrics differ enough to move the lower
 * sections a long way: measured on this page, `#recruitment` sits 416 px lower
 * at 1440 px and 42 px lower at 375 px while the fallback stack is painting.
 * Scrolling only at mount therefore lands on stale coordinates. So the scroll
 * is applied a second time when `document.fonts.ready` settles.
 *
 * That second application is abandoned if any of `USER_INTENT` has fired first
 * — nobody should have the page yanked out from under them. It deliberately
 * does *not* test the scroll position instead: Chrome's scroll anchoring moves
 * the document by itself during the font reflow (measured: 7,507 → 7,195 with
 * 7,091 correct), so a position check reads that as the visitor scrolling and
 * skips the correction that is still 104 px short.
 *
 * After the correction there is nothing further to do, so the listeners are
 * torn down and the page is left alone for the rest of its life.
 */
export default function useInitialHashScroll() {
  useEffect(() => {
    const hash = window.location.hash
    if (hash.length < 2) return

    let id
    try {
      id = decodeURIComponent(hash.slice(1))
    } catch {
      // A malformed percent-escape is not worth throwing over.
      id = hash.slice(1)
    }

    const target = document.getElementById(id)
    if (!target) return

    const apply = () => target.scrollIntoView({ behavior: 'instant', block: 'start' })
    apply()

    const controller = new AbortController()
    const { signal } = controller
    for (const type of USER_INTENT) {
      window.addEventListener(type, () => controller.abort(), {
        once: true,
        passive: true,
        capture: true,
        signal,
      })
    }

    document.fonts?.ready.then(() => {
      if (signal.aborted) return
      apply()
      controller.abort()
    })

    return () => controller.abort()
  }, [])
}
