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

// Function to block YouTube mixes
function blockYouTubeMixes() {
  const radioElements = document.querySelectorAll("ytd-radio-renderer.ytd-item-section-renderer.style-scope");
  let mixesBlockedThisRound = 0; // Initialize a counter for mixes blocked in this function call

  radioElements.forEach((radioElement, index) => {
    if (!radioElement.hasAttribute('data-mix-blocked')) {
      hideElement(radioElement); // Hide the radio renderer element
      
      // Mark the element as blocked to prevent future logs for the same element
      radioElement.setAttribute('data-mix-blocked', 'true');
      mixesBlockedThisRound++; // Increment counter since a mix was blocked
    }
  });

  // Log only if at least one mix was blocked in this round of mutation observation
  if (mixesBlockedThisRound > 0) {
    console.log(`${mixesBlockedThisRound} YouTube Mix(es) blocked.`);
  }
}

// Check if the current page is a YouTube search results page
if (window.location.href.includes("youtube.com") && window.location.href.includes("/results")) {
  // Initial call to block radio renderer elements
  blockYouTubeMixes();
}

const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // Call the function to check and block mixes whenever DOM changes occur
      blockYouTubeMixes();
    }
  }
});

// Start observing changes in the document body
observer.observe(document.body, { childList: true, subtree: true });
