/*
 * YouTube Mix Blocker Extension
 *
 * file: content.js
 * 
 * This file is part of the YouTube Mix Blocker Extension.
 *
 * YouTube Mix Blocker Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * YouTube Mix Blocker Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with YouTube Mix Blocker Extension. If not, see <http://www.gnu.org/licenses/>.
 *
 * Author: Oleksandr Molodchyk
 * Copyright (C) 2023-2026 Oleksandr Molodchyk
 */

console.log("MixBlocker active", window.location.href);

/* Stable semantic rule */
function isMixURL(url) {
  return /[?&]list=RD/.test(url);
}

/* Renderer container = layout authority (prevents gaps) */
function findRendererContainer(element) {
  return element.closest(
    "ytd-rich-item-renderer, " +
    "ytd-video-renderer, " +
    "ytd-compact-video-renderer, " +
    "ytd-grid-video-renderer"
  );
}

/* Safe removal */
function removeElement(el, debugURL) {
  if (!el || el.hasAttribute("data-mix-blocked")) return;

  el.setAttribute("data-mix-blocked", "true");
  el.remove();

  console.log("Mix removed:", debugURL);
}

/* SEARCH RESULTS LOGIC (kept conceptually) */
function blockYouTubeMixes() {
  const links = document.querySelectorAll("a[href]");
  let removed = 0;

  links.forEach(link => {
    if (isMixURL(link.href)) {
      const container = findRendererContainer(link);
      if (container) {
        removeElement(container, link.href);
        removed++;
      }
    }
  });

  if (removed) {
    console.log(`Blocked ${removed} mixes on search page`);
  }
}

/* RECOMMENDATIONS / HOME LOGIC (kept conceptually) */
function blockYouTubeRecommendedMixes() {
  const links = document.querySelectorAll("a[href]");
  let removed = 0;

  links.forEach(link => {
    if (isMixURL(link.href)) {
      const container = findRendererContainer(link);
      if (container) {
        removeElement(container, link.href);
        removed++;
      }
    }
  });

  if (removed) {
    console.log(`Blocked ${removed} mixes on recommendations`);
  }
}

/* Routing logic preserved */
function runBlockingLogic() {
  if (window.location.href.includes("/results")) {
    blockYouTubeMixes();
  } else {
    blockYouTubeRecommendedMixes();
  }
}

/* SPA-safe observer (critical for YouTube) */
const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        runBlockingLogic();
        return;
      }
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

/* Initial execution */
runBlockingLogic();