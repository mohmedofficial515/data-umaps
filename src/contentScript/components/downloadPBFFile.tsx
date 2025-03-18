

"use client";

import React, { useState, ChangeEvent } from 'react';
import Pbf from 'pbf';
import { VectorTile, VectorTileLayer, VectorTileFeature } from '@mapbox/vector-tile';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface TileJson {
  [layerName: string]: any[];
}

const TileDownloader: React.FC = () => {
  // إعداد المتغيرات المدخلة مع تعريف النوع
  const [url, setUrl] = useState<string>('https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?https://umapsudp.momrah.gov.sa/server/rest/services/Hosted/UbasemapHybrid/VectorTileServer/tile/16/28129/41275.pbf');
  const [zoom, setZoom] = useState<number>(16);
  const [xCoord, setXCoord] = useState<number>(28129);
  const [yCoord, setYCoord] = useState<number>(41275);
  const [loading, setLoading] = useState<boolean>(false);

  // معالجات تغيير الإدخال مع تعريف نوع الحدث
  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value);
  };

  const handleZoomChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setZoom(Number(e.target.value));
  };

  const handleXCoordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setXCoord(Number(e.target.value));
  };

  const handleYCoordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setYCoord(Number(e.target.value));
  };

  // الدالة الخاصة بجلب البيانات وإنشاء الملف المضغوط
  const downloadTileData = async (): Promise<void> => {
    setLoading(true);
    try {
      // جلب بيانات الـ pbf كـ ArrayBuffer
      const response = await fetch(url);
      const buffer: ArrayBuffer = await response.arrayBuffer();

      // تحويل بيانات pbf إلى JSON (GeoJSON)
      const pbf = new Pbf(buffer);
      const tile: VectorTile = new VectorTile(pbf);
      const tileJson: TileJson = {};

      for (const layerName in tile.layers) {
        const layer: VectorTileLayer = tile.layers[layerName];
        tileJson[layerName] = [];
        for (let i = 0; i < layer.length; i++) {
          const feature: VectorTileFeature = layer.feature(i);
          // toGeoJSON تأخذ إحداثيات (x, y) ومعدل التقريب (zoom)
          const geoFeature = feature.toGeoJSON(xCoord, yCoord, zoom);
          tileJson[layerName].push(geoFeature);
        }
      }

      // إنشاء ملف مضغوط يحتوي على ملف pbf الأصلي وملف JSON
      const zip = new JSZip();
      zip.file('tile.pbf', buffer);
      zip.file('tile.json', JSON.stringify(tileJson, null, 2));
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'tile_data.zip');
    } catch (error) {
      console.error('حدث خطأ أثناء جلب أو معالجة بيانات الـ pbf:', error);
    }
    setLoading(false);
  };

  return (
    <div className='bg-gray-100 p-4 rounded-lg w-full h-full'>
      <h2 className='text-[10px] text-dis ' dir='ltr'> Download PBF to JSON</h2>
      <div className='mb-4 border rounded-lg p-4'>
        <label>رابط الـ Tile:</label>
        <input
          className="mb-2 p-2 w-full"
          type="text"
          value={url}
          onChange={handleUrlChange}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>مستوى التكبير (Zoom):</label>
        <input
          className="mb-2 p-2 w-full"
          type="number"
          value={zoom}
          onChange={handleZoomChange}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>الإحداثي X:</label>
        <input
          className="mb-2 p-2 w-full"
          type="number"
          value={xCoord}
          onChange={handleXCoordChange}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>الإحداثي Y:</label>
        <input
          className="mb-2 p-2 w-full"
          type="number"
          value={yCoord}
          onChange={handleYCoordChange}
        />
      </div>
      <button
        onClick={downloadTileData}
        disabled={loading}
        className='bg-bl text-white p-2 w-full'
      >
        {loading ? 'جارٍ التحميل...' : 'تنزيل البيانات'}
      </button>
    </div>
  );
};

export default TileDownloader;



// "use client";
// import React, { useState } from "react";
// import Pbf from "pbf";
// import { VectorTile } from "@mapbox/vector-tile";

// export default function DownloadPBFFile() {
//   const [urlPBF, setUrlPBF] = useState("https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?https://umapsudp.momrah.gov.sa/server/rest/services/Hosted/UbasemapHybrid/VectorTileServer/tile/16/28129/41275.pbf");

//   const downloadAndConvert = async () => {
//     if (!urlPBF) {
//       console.error("❌ يرجى إدخال رابط صالح");
//       return;
//     }

//     try {
//       const response = await fetch(urlPBF);
//       console.log("response" , response  )
//       if (!response.ok) {
//         throw new Error(`❌ فشل الاتصال بالملف، رمز الحالة: ${response.status}`);
//       }

//       const arrayBuffer = await response.arrayBuffer();
//       const pbf = new Pbf(new Uint8Array(arrayBuffer));
//       const tile = new VectorTile(pbf);

//       // فك ترميز البيانات وتحويلها إلى GeoJSON
//       const layers: Record<string, any> = {};
//       Object.keys(tile.layers).forEach((layerName) => {
//         const layer = tile.layers[layerName];
//         layers[layerName] = [];
//         for (let i = 0; i < layer.length; i++) {
//           layers[layerName].push(layer.feature(i).toGeoJSON(14062, 15, 20643));
//         }
//       });

//       console.log("✅ البيانات المفككة:", layers);

//       // تحويل البيانات إلى JSON وتنزيلها
//       const jsonBlob = new Blob([JSON.stringify(layers, null, 2)], {
//         type: "application/json",
//       });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(jsonBlob);
//       link.download = "output.json";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("❌ حدث خطأ أثناء التحميل أو التحويل:", error);
//     }
//   };

//   return (
//     <div className="py-2 px-4 bg-or text-dis p-4 shadow-lg w-full">
//       <input
//         type="text"
//         value={urlPBF}
//         onChange={(e) => setUrlPBF(e.target.value)}
//         placeholder="أدخل الرابط هنا"
//         className="mb-2 p-2 w-full"
//       />
//       <button onClick={downloadAndConvert} className="bg-bl text-white p-2">
//         تحميل وتحويل PBF إلى JSON
//       </button>
//     </div>
//   );
// }

