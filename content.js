// content.js

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
