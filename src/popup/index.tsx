import React from "react";
import { createRoot } from "react-dom/client";
import '../assets/tailwind.css';
import Popup from "./popup";

function init() {
    try {
        const appContainer = document.createElement('div');
        document.body.appendChild(appContainer);

        if (!appContainer) {
            throw new Error("Cannot find AppContainer");
        }

        const root = createRoot(appContainer);
        console.log("App container created and attached:", appContainer);
        root.render(<Popup />);
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

init();
