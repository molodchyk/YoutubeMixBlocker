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

/* Extract playlist ID (RDxxxx) */
function extractMixId(url) {
  const match = url.match(/[?&]list=(RD[^&]+)/);
  return match ? match[1] : null;
}

/* Strongest container resolution (data-bound identity) */
function findContainerById(mixId) {
  if (!mixId) return null;
  return document.querySelector(`.content-id-${mixId}`);
}

/* Structural fallback — avoid hardcoding component names */
function findCardContainer(link) {
  let el = link;

  while (el && el !== document.body) {
    const hasImage = el.querySelector && el.querySelector("img");
    const linkCount = el.querySelectorAll ? el.querySelectorAll("a[href]").length : 0;

    if (hasImage && linkCount > 1) {
      return el;
    }

    el = el.parentElement;
  }

  return null;
}

function hideElement(el, debugURL) {
  if (!el || el.hasAttribute("data-mix-blocked")) return;

  el.style.display = "none";
  el.setAttribute("data-mix-blocked", "true");

  console.log("Mix blocked:", debugURL);
}

function hideContainerFromLink(link) {
  const mixId = extractMixId(link.href);

  /* Prefer stable ID-based resolution */
  const idContainer = findContainerById(mixId);
  if (idContainer) {
    hideElement(idContainer, link.href);
    return;
  }

  /* Fallback to structural detection */
  const heuristicContainer = findCardContainer(link);
  hideElement(heuristicContainer, link.href);
}

/* Scan any subtree */
function scanForMixes(root = document) {
  const links = root.querySelectorAll("a[href]");

  links.forEach(link => {
    if (isMixURL(link.href)) {
      hideContainerFromLink(link);
    }
  });
}

/* SPA-safe observer */
const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        scanForMixes(node);
      }
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

/* Initial execution */
scanForMixes();
