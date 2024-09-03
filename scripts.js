// Function to set a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie by name
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Set a cookie when the page loads
window.onload = function() {
    setCookie('myCookie', 'cookieValue', 7); // Set cookie for 7 days

    // Display the cookie value
    const cookieValue = getCookie('myCookie');
    document.getElementById('cookieDisplay').textContent = `Cookie Value: ${cookieValue}`;

    // Get elements
    const openButton = document.getElementById('openIframe');
    const closeButton = document.getElementById('closeIframe');
    const iframeContainer = document.getElementById('iframeContainer');

    // Show iframe and hide open button
    openButton.addEventListener('click', function() {
        iframeContainer.style.display = 'block';
        openButton.style.display = 'none';
        closeButton.style.display = 'inline';
    });

    // Hide iframe and show open button
    closeButton.addEventListener('click', function() {
        iframeContainer.style.display = 'none';
        openButton.style.display = 'inline';
        closeButton.style.display = 'none';
    });

    // Hide text tools in the iframe
    const iframe = document.getElementById('myIframe');
    iframe.onload = function() {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // Select and hide the tool elements by their class or role
        const emojiButton = iframeDocument.querySelector('title="Emoji"');
        const boldButton = iframeDocument.querySelector('button[aria-label="Bold"]');
        const moreOptionsButton = iframeDocument.querySelector('button[aria-label="More options"]');
        const micButton = iframeDocument.querySelector('button[aria-label="Microphone"]');
        const addButton = iframeDocument.querySelector('button[aria-label="Plus"]');

        if (emojiButton) emojiButton.style.display = 'none';
        if (boldButton) boldButton.style.display = 'none';
        if (moreOptionsButton) moreOptionsButton.style.display = 'none';
        if (micButton) micButton.style.display = 'none';
        if (addButton) addButton.style.display = 'none';
    };
};
