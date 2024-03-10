/*
 * YouTube Mix Blocker Extension
 *
 * file: content.js
 * 
 * This file is part of the YouTube Mix Blocker Extension.
 *
 * Defense YouTube Mix Blocker Extension is free software: you can redistribute it and/or modify
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
 * along with Defense Against Distractions Extension. If not, see <http://www.gnu.org/licenses/>.
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
  // Locate and block YouTube radio renderer elements on the search page
  const radioElements = document.querySelectorAll("ytd-radio-renderer.ytd-item-section-renderer.style-scope");
  radioElements.forEach((radioElement) => {
    hideElement(radioElement); // Hide the radio renderer element
  });
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
