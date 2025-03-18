chrome.webRequest.onCompleted.addListener(
   function(details) {
       // Send the request path to the content script
       console.log('Request completed:', details.url   );
       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
           chrome.tabs.sendMessage(tabs[0].id as number, {requestPath: details.url});
       });
   },
   {urls: ["<all_urls>"]}
);

console.log('Background script loaded');

export {};


