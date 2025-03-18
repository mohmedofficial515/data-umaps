// contentScript.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import PdfRequests from './PdfRequests';

console.log("Content script loaded");

const main = async () => {
  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startInit);
    } else {
      startInit();
    }
  } catch (error) {
    console.error("Error during initialization:", error);
  }
};

const startInit = () => {
  // إنشاء العنصر الذي سيتم فيه عرض مكون React
  const appContainer = document.createElement('div');
  appContainer.id = "appContainer";
  appContainer.style.zIndex = '2147483647';
  appContainer.style.position = 'fixed';
  appContainer.style.bottom = '0';
  appContainer.style.left = '0';
  // appContainer.style.width = '40vh';
  // appContainer.style.height = '40vh';
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'networkRequest') {
        appContainer.textContent = `Request Path: ${request.path}`;
        appContainer.style.display = 'block';
        setTimeout(() => {
            appContainer.style.display = 'none';
        }, 3000);
    }
});


  if (document.body) {
    document.body.appendChild(appContainer);
  } else {
    return;
  }

  const container = document.getElementById('appContainer') as HTMLElement;
  if (!container) {
    return;
  }
  

  try {
    const root = ReactDOM.createRoot(container);
    root.render(<PdfRequests />);
  } catch (error) {
    console.error("Error during React rendering:", error);
  }
};


main();
