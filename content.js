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
 * Copyright (C) 2023-2024 Oleksandr Molodchyk
 */

// Function to hide the specified element
function hideElement(element) {
  element.style.display = "none";
}

// Function to log the blocking of mixes
function logBlockedMixes(count, type) {
  if (count > 0) {
    console.log(`${count} YouTube Mix(es) blocked on ${type}.`);
  }
}

// Function to block YouTube mixes on search results page
function blockYouTubeMixes() {
  const radioElements = document.querySelectorAll("ytd-radio-renderer.ytd-item-section-renderer.style-scope");
  let mixesBlockedThisRound = 0;

  radioElements.forEach(element => {
    if (!element.hasAttribute('data-mix-blocked')) {
      hideElement(element);
      element.setAttribute('data-mix-blocked', 'true');
      mixesBlockedThisRound++;
    }
  });

  logBlockedMixes(mixesBlockedThisRound, "search results");
}

// Function to block YouTube recommended mixes on the homepage
function blockYouTubeRecommendedMixes() {
  const mixElements = document.querySelectorAll("ytd-thumbnail-overlay-bottom-panel-renderer, ytd-rich-grid-media");
  let mixesBlockedThisRound = 0;

  mixElements.forEach(element => {
    if (element.innerText.includes("Mix")) {
      if (!element.hasAttribute('data-mix-blocked')) {
        hideElement(element.parentNode);
        element.setAttribute('data-mix-blocked', 'true');
        mixesBlockedThisRound++;
      }
    }
  });

  logBlockedMixes(mixesBlockedThisRound, "homepage");
}

// Initial call and setup observer based on the current page
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      if (window.location.href.includes("/results")) {
        blockYouTubeMixes();
      } else {
        blockYouTubeRecommendedMixes();
      }
    }
  });
});

// Start observing changes in the document body
observer.observe(document.body, { childList: true, subtree: true });

if (window.location.href.includes("youtube.com/results")) {
  blockYouTubeMixes();
} else {
  blockYouTubeRecommendedMixes();
}


