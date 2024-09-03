document.addEventListener('DOMContentLoaded', function () {
    // Get references to the buttons and the iframe container
    var openIframeButton = document.getElementById('openIframe');
    var closeIframeButton = document.getElementById('closeIframe');
    var iframeContainer = document.getElementById('iframeContainer');
    var iframe = document.getElementById('myIframe');

    // Function to open the chat
    openIframeButton.addEventListener('click', function () {
        iframe.src = "https://testforbot.rocket.chat/channel/Room10/?layout=embedded"; // Set the src attribute
        iframeContainer.style.display = 'block'; // Show the iframe container
        openIframeButton.style.display = 'none'; // Hide the open button
        closeIframeButton.style.display = 'inline-block'; // Show the close button
    });

    // Function to close the chat
    closeIframeButton.addEventListener('click', function () {
        iframeContainer.style.display = 'none'; // Hide the iframe container
        iframe.src = ""; // Clear the src attribute
        openIframeButton.style.display = 'inline-block'; // Show the open button
        closeIframeButton.style.display = 'none'; // Hide the close button
    });
});
