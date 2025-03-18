import React, { useEffect, useState } from 'react';

interface NetworkRequest {
  url: string;
  method: string;
  statusCode: number;
  timestamp: string;
  type: string;
}

const Popup: React.FC = () => {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);

  useEffect(() => {
    // Load initial requests
    chrome.runtime.sendMessage({ type: 'GET_REQUESTS' }, (response) => {
      setRequests(response || []);
    });

    // Listen for new requests
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'NEW_REQUEST') {
        setRequests(prev => [...prev, message.request]);
      }
    });
  }, []);

  return (
    <div className="p-4 w-[600px]">
      <h1 className="text-xl font-bold mb-4">Network Requests</h1>
      <div className="overflow-auto max-h-[400px]">
        {requests.map((request, index) => (
          <div key={index} className="mb-2 p-2 border rounded">
            <div><strong>URL:</strong> {request.url}</div>
            <div><strong>Method:</strong> {request.method}</div>
            <div><strong>Status:</strong> {request.statusCode}</div>
            <div><strong>Time:</strong> {request.timestamp}</div>
            <div><strong>Type:</strong> {request.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;