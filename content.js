// content.js

// Function to hide the specified element
function hideElement(element) {
  element.style.display = "none";
}

// Check if the current page is a YouTube search results page
if (window.location.href.includes("youtube.com") && window.location.href.includes("/results")) {
  // Locate and block YouTube radio renderer elements on the search page
  const radioElements = document.querySelectorAll("ytd-radio-renderer.ytd-item-section-renderer.style-scope");
  radioElements.forEach((radioElement) => {
    hideElement(radioElement); // Hide the radio renderer element
  });
}
