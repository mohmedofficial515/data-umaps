import React, { useState } from "react";

export default function DownloadJeson() {
  const [baseUrl, setBaseUrl] = useState("");
  const [useProxy, setUseProxy] = useState(false);
  const url = useProxy
    ? `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${baseUrl}`
    : baseUrl;
    // https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query?where=CITY_ID%3D%2700100001%27%20AND%20OBJECTID%3E32512208&outFields=*&resultOffset=0&resultRecordCount=2000&f=geoJSON
   
    // https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query?where=CITY_ID%3D%2700100001%27%20AND%20OBJECTID%3E32511982&outFields=*&resultOffset=0&resultRecordCount=2000&f=geoJSON
    // https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query?where=CITY_ID%3D'00100001'%20AND%20OBJECTID%3E32512208&outFields=*&resultOffset=0&resultRecordCount=2000&f=geoJSON
  const downloadAndConvert = async () => {
    if (!baseUrl) {
      console.error("❌ يرجى إدخال رابط صالح");
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`❌ فشل الاتصال بالملف، رمز الحالة: ${response.status}`);
      }

      // if (contentType ) {
        const data = await response.json();
        console.log("✅ تم استلام البيانات:", data);

        // تحويل البيانات إلى Blob بصيغة JSON
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        // إنشاء رابط تنزيل
        const link = document.createElement("a");
        link.href = URL.createObjectURL(jsonBlob);
        link.download = "output.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      
    } catch (error) {
      console.error("❌ حدث خطأ أثناء التحميل:", error);
    }
  };

  return (
    <div className="py-2 px-4 bg-gray-100 border text-dis p-4 shadow-lg w-full h-full ">
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={useProxy}
          onChange={(e) => setUseProxy(e.target.checked)}
          className="mr-2"
        />
        <span className="p-2 text-white">إضافة بروكسي إلى الرابط</span>
      </div>
      <input
        type="text"
        value={baseUrl}
        onChange={(e) => setBaseUrl(e.target.value)}
        placeholder="أدخل الرابط هنا"
        className="mb-2 p-2 w-full"
      />

      <input
        type="text"
        value={baseUrl}
        onChange={(e) => setBaseUrl(e.target.value)}
        placeholder="%3E%3D"
        className="mb-2 p-2 w-full"
      />


 




      <button onClick={downloadAndConvert} className="bg-bl text-white p-2">
        تحميل وتنزيل ملف GeoJSON
      </button>
    </div>
  );
}

