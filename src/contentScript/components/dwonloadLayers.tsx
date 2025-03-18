import React, { useState } from 'react';

export default function DownloadLayers() {
  const [layer, setLayer] = useState('0');
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(2000);
  const [filter, setFilter] = useState('1=1');
  const [increaseAmount, setIncreaseAmount] = useState(2000);
  const [isAutoDownloading, setIsAutoDownloading] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);

  // دالة الانتظار
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // دالة العد التنازلي للانتظار (تحديث الواجهة بعدد الثواني المتبقية)
  const countdownSleep = async (seconds: number) => {
    for (let i = seconds; i > 0; i--) {
      setRetryCountdown(i);
      await sleep(1000);
    }
    setRetryCountdown(0);
  };


  const getbycity = "https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query?where=CITY_ID%3D%2700100001%27&outFields=*&resultOffset=44000&resultRecordCount=2000&f=json"

  // دالة تحميل البيانات
  const handleDownload = async (): Promise<boolean> => {
    const resultOffset = from;
    const count = to - from;
    const encodedFilter = encodeURIComponent(filter);
    const baseUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/UMaps_AdministrativeData/MapServer/${layer}/query`;
    const queryParams = `?f=json&resultOffset=${resultOffset}&resultRecordCount=${count}&where=${encodedFilter}&objectIds=&orderByFields=&outFields=*&returnGeometry=true`;
    const urlLayer28 = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query`;
    const url = `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${layer === '28' ? urlLayer28 : baseUrl}${queryParams}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('حدث خطأ أثناء جلب البيانات');
      }
      const data = await response.json();

      // إنشاء ملف JSON وتنزيله
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const fileName = `layer-${layer}_from-${from}_to-${to}_count-${count}.json`;
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      console.log(`تم تنزيل الملف: ${fileName}`);
      return true;
    } catch (error) {
      console.error('Error downloading data:', error);
      return false;
    }
  };

  // تعديل الإزاحة يدويًا
  const handleIncrease = () => {
    setTo((prev) => prev + increaseAmount);
    setFrom((prev) => prev + increaseAmount);
  };

  const handleDecrease = () => {
    setTo((prev) => prev - increaseAmount);
    setFrom((prev) => prev - increaseAmount);
  };

  // دالة التنزيل التلقائي مع إعادة المحاولة
  const autoDownload = async () => {
    while (isAutoDownloading) {
      const success = await handleDownload();
      if (success) {
        // في حالة النجاح، زيادة الإزاحة لإرسال طلب جديد برابط معدل
        setFrom((prev) => prev + increaseAmount);
        setTo((prev) => prev + increaseAmount);
        console.log("تم تنزيل الملف بنجاح، جاري تعديل الرابط وإرسال الطلب الجديد...");
      } else {
        console.log("فشل التنزيل، سيتم إعادة المحاولة بعد 30 ثانية...");
      }
      // الانتظار نصف دقيقة قبل المحاولة التالية
      await countdownSleep(30);
    }
  };

  const handlePlay = () => {
    if (!isAutoDownloading) {
      setIsAutoDownloading(true);
      autoDownload();
    }
  };

  const handleStop = () => {
    setIsAutoDownloading(false);
  };

  return (
    <div className="bg-white p-2 rounded-lg">
      <h2 className="text-xl text-dis font-bold mb-4 text-center">تنزيل بيانات الطبقات</h2>
      <div className="grid grid-cols-1 gap-4 w-full">
        <div>
          <label className="block text-gray-400 font-bold mb-2" htmlFor="layer">
            اختر الطبقة:
          </label>
          <select
            id="layer"
            value={layer}
            onChange={(e) => setLayer(e.target.value)}
            className="block w-full px-4 py-2 text-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
          >
            <option className="text-dis" value="0">الطبقة 0</option>
            <option className="text-dis" value="1">الطبقة 1</option>
            <option className="text-dis" value="2">الطبقة 2</option>
            <option className="text-dis" value="3">الطبقة 3</option>
            <option className="text-dis" value="4">الطبقة 4</option>
            <option className="text-dis" value="5">الطبقة 5</option>
            <option className="text-dis" value="6">الطبقة 6</option>
            <option className="text-dis" value="7">الطبقة 7</option>
            <option className="text-dis" value="8">الطبقة 8</option>
            <option className="text-dis" value="9">الطبقة 9</option>
            <option className="text-dis" value="10">الطبقة 10</option>
            <option className="text-dis" value="11">الطبقة 11</option>
            <option className="text-dis" value="12">الطبقة 12</option>
            <option className="text-dis" value="13">الطبقة 13</option>
            <option className="text-dis" value="14">الطبقة 14</option>
            <option className="text-dis" value="15">الطبقة 15</option>
            <option className="text-dis" value="16">الطبقة 16</option>
            <option className="text-dis" value="17">الطبقة 17</option>
            <option className="text-dis" value="18">الطبقة 18</option>
            <option className="text-dis" value="19">الطبقة 19</option>
            <option className="text-dis" value="20">الطبقة 20</option>
            <option className="text-dis" value="21">الطبقة 21</option>
            <option className="text-dis" value="22">الطبقة 22</option>
            <option className="text-dis" value="23">الطبقة 23</option>
            <option className="text-dis" value="24">الطبقة 24</option>
            <option className="text-dis" value="25">الطبقة 25</option>
            <option className="text-dis" value="26">الطبقة 26</option>
            <option className="text-dis" value="27">الطبقة 27</option>
            <option className="text-dis" value="28">الطبقة 28</option>
            <option className="text-dis" value="29">الطبقة 29</option>
            <option className="text-dis" value="30">الطبقة 30</option>
          </select>
        </div>

        <div className="flex justify-between items-center gap-2">
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="from">
              من:
            </label>
            <input
              type="number"
              id="from"
              value={from}
              onChange={(e) => setFrom(parseInt(e.target.value, 10))}
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="to">
              إلى:
            </label>
            <input
              type="number"
              id="to"
              value={to}
              onChange={(e) => setTo(parseInt(e.target.value, 10))}
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2" htmlFor="increaseAmount">
            مقدار الزيادة:
          </label>
          <input
            type="number"
            id="increaseAmount"
            value={increaseAmount}
            onChange={(e) => setIncreaseAmount(parseInt(e.target.value, 10))}
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
          />
        </div>

        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handleDecrease}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            نقصان {increaseAmount}
          </button>
          <button
            onClick={handleIncrease}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            زيادة {increaseAmount}
          </button>
        </div>

        <div className="flex justify-between items-center gap-2">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="filter">
            شرط التصفية (selected):
          </label>
          <input
            type="text"
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
          />
        </div>
      </div>

      {retryCountdown > 0 && (
        <div className="text-center text-red-500 font-bold mt-4">
          المحاولة التالية خلال: {retryCountdown} ثانية
        </div>
      )}

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex gap-4">
          <button
            onClick={isAutoDownloading ? handleStop : handlePlay}
            className={`flex-1 ${isAutoDownloading ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center`}
          >
            {isAutoDownloading ? '■ إيقاف' : '▶️ تشغيل تلقائي'}
          </button>
        </div>

        <button
          onClick={handleDownload}
          className="bg-bl hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg w-full"
        >
          تنزيل بصيغة JSON
        </button>
      </div>
    </div>
  );
}
















// import React, { useState, useCallback, useRef } from 'react';
// import axios from 'axios';

// export default function DownloadLayers() {
//   const [layer, setLayer] = useState('0');
//   const [from, setFrom] = useState(0);
//   const [to, setTo] = useState(2000);
//   const [filter, setFilter] = useState('1=1');
//   const [increaseAmount, setIncreaseAmount] = useState(2000);
//   const [isAutoDownloading, setIsAutoDownloading] = useState(false);
//   const [retryCountdown, setRetryCountdown] = useState(0);
//   const [progress, setProgress] = useState(0);

//   // حقل الترتيب (إن أردت ترتيب النتائج بحسب حقل معيّن)
//   const [orderByField, setOrderByField] = useState(''); // مثلاً: 'OBJECTID'

//   // مرجع لإلغاء الطلب
//   const cancelSourceRef = useRef<any>(null);

//   // دالة للتأخير
//   const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//   // دالة العد التنازلي لإظهار تأخير قبل المحاولة التالية
//   const countdownSleep = async (seconds: number) => {
//     for (let i = seconds; i > 0; i--) {
//       setRetryCountdown(i);
//       await sleep(1000);
//     }
//     setRetryCountdown(0);
//   };

//   // دالة لجلب البيانات مع آلية إعادة المحاولة (Exponential Backoff)
//   const fetchDataWithRetry = async (url: string, retries = 3, delay = 1000) => {
//     for (let i = 0; i < retries; i++) {
//       try {
//         cancelSourceRef.current = axios.CancelToken.source();

//         const response = await axios.get(url, {
//           cancelToken: cancelSourceRef.current.token,
//           onDownloadProgress: (progressEvent) => {
//             if (progressEvent.total) {
//               const percentCompleted = Math.round(
//                 (progressEvent.loaded * 100) / progressEvent.total
//               );
//               setProgress(percentCompleted);
//             }
//           },

//         });
//         return response.data;
//       } catch (error) {
//         if (axios.isCancel(error)) {
//           console.log("تم إلغاء الطلب:", error.message);
//           throw error; // نلقي الخطأ لإيقاف العملية
//         }
//         // إعادة المحاولة مع تأخير متزايد
//         if (i < retries - 1) {
//           await sleep(delay * Math.pow(2, i));
//         } else {
//           throw error;
//         }
//       }
//     }
//   };

//   // دالة التنزيل الرئيسية - تنزل الملف بصيغة JSON عادي
//   const handleDownload = useCallback(async () => {
//     const resultOffset = from;
//     const count = to - from;
//     const encodedFilter = encodeURIComponent(filter);

//     // بناء رابط الطلب
//     const baseUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/UMaps_AdministrativeData/MapServer/${layer}/query`;
//     let queryParams = `?f=json&resultOffset=${resultOffset}&resultRecordCount=${count}&where=${encodedFilter}&outFields=*&returnGeometry=true`;

//     // إن أردت الترتيب بحقل معيّن
//     if (orderByField) {
//       queryParams += `&orderByFields=${orderByField} ASC`;
//     }

//     const urlLayer28 = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query`;
//     const url = `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${
//       layer === '28' ? urlLayer28 : baseUrl
//     }${queryParams}`;

//     try {
//       // جلب البيانات باستخدام آلية إعادة المحاولة
//       const data = await fetchDataWithRetry(url, 3, 1000);

//       // إعادة تعيين مؤشر التحميل
//       setProgress(0);

//       // تحويل البيانات إلى نص JSON
//       const jsonData = JSON.stringify(data, null, 2);

//       // إنشاء Blob بصيغة JSON
//       const blob = new Blob([jsonData], { type: 'application/json' });

//       // تحديد اسم الملف
//       const fileName = `layer-${layer}_from-${from}_to-${to}_count-${count}.json`;

//       // إنشاء رابط وتحميل الملف
//       const link = document.createElement('a');
//       link.href = window.URL.createObjectURL(blob);
//       link.download = fileName;
//       link.click();

//       console.log(`تم تنزيل الملف: ${fileName}`);
//       return true;
//     } catch (error) {
//       console.error('خطأ في تنزيل البيانات:', error);
//       return false;
//     }
//   }, [layer, from, to, filter, orderByField]);

//   // زيادة قيم from/to
//   const handleIncrease = useCallback(() => {
//     setTo((prev) => prev + increaseAmount);
//     setFrom((prev) => prev + increaseAmount);
//   }, [increaseAmount]);

//   // إنقاص قيم from/to
//   const handleDecrease = useCallback(() => {
//     setTo((prev) => prev - increaseAmount);
//     setFrom((prev) => prev - increaseAmount);
//   }, [increaseAmount]);

//   // التحميل التلقائي المتتابع
//   const autoDownload = useCallback(async () => {
//     while (isAutoDownloading) {
//       const success = await handleDownload();
//       if (success) {
//         setFrom((prev) => prev + increaseAmount);
//         setTo((prev) => prev + increaseAmount);
//       }
//       // تأخير قبل الطلب التالي
//       await countdownSleep(30);
//     }
//   }, [isAutoDownloading, handleDownload, increaseAmount]);

//   // تشغيل التحميل التلقائي
//   const handlePlay = useCallback(() => {
//     if (!isAutoDownloading) {
//       setIsAutoDownloading(true);
//       autoDownload();
//     }
//   }, [isAutoDownloading, autoDownload]);

//   // إيقاف التحميل التلقائي وإلغاء الطلب الجاري
//   const handleStop = useCallback(() => {
//     setIsAutoDownloading(false);
//     if (cancelSourceRef.current) {
//       cancelSourceRef.current.cancel('تم إلغاء العملية من قبل المستخدم.');
//     }
//   }, []);

//   return (
//     <div className="bg-white p-2 rounded-lg">
//       <h2 className="text-xl text-dis font-bold mb-4 text-center">تنزيل بيانات الطبقات</h2>

//       <div className="grid grid-cols-1 gap-4 w-full">
//         {/* اختيار الطبقة */}
//         <div>
//           <label className="block text-gray-400 font-bold mb-2" htmlFor="layer">
//             اختر الطبقة:
//           </label>
//           <select
//             id="layer"
//             value={layer}
//             onChange={(e) => setLayer(e.target.value)}
//             className="block w-full px-4 py-2 text-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//           >
//             {[...Array(31).keys()].map((i) => (
//               <option key={i} className="text-dis" value={i}>
//                 الطبقة {i}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* اختيار من/إلى */}
//         <div className="flex justify-between items-center gap-2">
//           <div>
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="from">
//               من:
//             </label>
//             <input
//               type="number"
//               id="from"
//               value={from}
//               onChange={(e) => setFrom(parseInt(e.target.value, 10))}
//               className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="to">
//               إلى:
//             </label>
//             <input
//               type="number"
//               id="to"
//               value={to}
//               onChange={(e) => setTo(parseInt(e.target.value, 10))}
//               className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//             />
//           </div>
//         </div>

//         {/* مقدار الزيادة */}
//         <div>
//           <label className="block text-gray-700 font-bold mb-2" htmlFor="increaseAmount">
//             مقدار الزيادة:
//           </label>
//           <input
//             type="number"
//             id="increaseAmount"
//             value={increaseAmount}
//             onChange={(e) => setIncreaseAmount(parseInt(e.target.value, 10))}
//             className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//           />
//         </div>

//         {/* أزرار الزيادة والنقصان */}
//         <div className="flex justify-center items-center gap-4">
//           <button
//             onClick={handleDecrease}
//             className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
//           >
//             نقصان {increaseAmount}
//           </button>
//           <button
//             onClick={handleIncrease}
//             className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
//           >
//             زيادة {increaseAmount}
//           </button>
//         </div>

//         {/* حقل التصفية وحقل الترتيب */}
//         <div className="flex flex-col gap-2">
//           <div>
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="filter">
//               شرط التصفية (selected):
//             </label>
//             <input
//               type="text"
//               id="filter"
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//             />
//           </div>

//           {/* اختيار حقل الترتيب (اختياري) */}
//           <div>
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="orderByField">
//               حقل الترتيب (اختياري):
//             </label>
//             <input
//               type="text"
//               id="orderByField"
//               value={orderByField}
//               onChange={(e) => setOrderByField(e.target.value)}
//               placeholder="مثلاً OBJECTID"
//               className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//             />
//           </div>
//         </div>
//       </div>

//       {/* عداد المحاولة التالية */}
//       {retryCountdown > 0 && (
//         <div className="text-center text-red-500 font-bold mt-4">
//           المحاولة التالية خلال: {retryCountdown} ثانية
//         </div>
//       )}

//       {/* نسبة التقدم في التحميل */}
//       {progress > 0 && progress < 100 && (
//         <div className="text-center text-blue-500 font-bold mt-4">
//           جاري التحميل: {progress}%
//         </div>
//       )}

//       <div className="flex flex-col gap-4 mt-4">
//         {/* تشغيل/إيقاف التحميل التلقائي */}
//         <div className="flex gap-4">
//           <button
//             onClick={isAutoDownloading ? handleStop : handlePlay}
//             className={`flex-1 ${
//               isAutoDownloading ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
//             } text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center`}
//           >
//             {isAutoDownloading ? '■ إيقاف' : '▶️ تشغيل تلقائي'}
//           </button>
//         </div>

//         {/* زر التحميل اليدوي لمرة واحدة */}
//         <button
//           onClick={handleDownload}
//           className="bg-bl hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg w-full"
//         >
//           تنزيل بصيغة JSON
//         </button>
//       </div>
//     </div>
//   );
// }





// import React, { useState } from 'react';

// export default function DownloadLayers() {
//   const [layer, setLayer] = useState('0');
//   const [from, setFrom] = useState(0);
//   const [to, setTo] = useState(2000);
//   const [filter, setFilter] = useState('1=1');
//   const [increaseAmount, setIncreaseAmount] = useState(2000);
//   const [isAutoDownloading, setIsAutoDownloading] = useState(!false);
//   const [retryCountdown, setRetryCountdown] = useState(0);

//   const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

//   const countdownSleep = async (seconds: any) => {
//     for (let i = seconds; i > 0; i--) {
//       setRetryCountdown(i);
//       await sleep(1000);
//     }
//     setRetryCountdown(0);
//   };
//   const handleDownload = async () => {
//     const resultOffset = from;
//     const count = to - from;
//     const encodedFilter = encodeURIComponent(filter);
//     const baseUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/UMaps_AdministrativeData/MapServer/${layer}/query`;
//     const queryParams = `?f=json&resultOffset=${resultOffset}&resultRecordCount=${count}&where=${encodedFilter}&objectIds=&orderByFields=&outFields=*&returnGeometry=true`;
//     const urlLayer28 = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query`;
//     const url = `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${layer === '28' ? urlLayer28 : baseUrl}${queryParams}`;

//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error('حدث خطأ أثناء جلب البيانات');
//       }
//       const data = await response.json();
//       const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//       const fileName = `layer-${layer}_from-${from}_to-${to}_count-${count}.json`;
//       const link = document.createElement('a');
//       link.href = window.URL.createObjectURL(blob);
//       link.download = fileName;
//       link.click();
//       console.log(`تم تنزيل الملف: ${fileName}`);
//       return true;
//     } catch (error) {
//       console.error('Error downloading data:', error);
//       return false;
//     }
//   };

//   const handleIncrease = () => {
//     setTo((prev) => prev + increaseAmount);
//     setFrom((prev) => prev + increaseAmount);
//   };

//   const handleDecrease = () => {
//     setTo((prev) => prev - increaseAmount);
//     setFrom((prev) => prev - increaseAmount);
//   };

//   const autoDownload = async () => {
//     while (true) {
//       if (!isAutoDownloading) break;

//       const success = await handleDownload();
//       if (success) {
//         setFrom((prev) => prev + increaseAmount);
//         setTo((prev) => prev + increaseAmount);
//         await countdownSleep(30);
//       } else {
//         await countdownSleep(30);
//       }
//     }
//   };

//   const handlePlay = () => {
//     if (!isAutoDownloading) {
//       setIsAutoDownloading(true);
//       autoDownload();
//     }
//   };

//   const handleStop = () => {
//     setIsAutoDownloading(false);
//   };

//   return (
//     <div className="bg-white p-2 rounded-lg">
//       <h2 className="text-xl text-dis font-bold mb-4 text-center">تنزيل بيانات الطبقات</h2>
//       <div className="grid grid-cols-1 gap-4 w-full">
//         <div>
//           <label className="block text-gray-400 font-bold mb-2" htmlFor="layer">
//             اختر الطبقة:
//           </label>
//           <select
//             id="layer"
//             value={layer}
//             onChange={(e) => setLayer(e.target.value)}
//             className="block w-full px-4 py-2 text-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//           >
//             <option className="text-dis" value="0">الطبقة 0</option>
//             <option className="text-dis" value="1">الطبقة 1</option>
//             <option className="text-dis" value="2">الطبقة 2</option>
//             <option className="text-dis" value="3">الطبقة 3</option>
//             <option className="text-dis" value="4">الطبقة 4</option>
//             <option className="text-dis" value="5">الطبقة 5</option>
//             <option className="text-dis" value="6">الطبقة 6</option>
//             <option className="text-dis" value="7">الطبقة 7</option>
//             <option className="text-dis" value="8">الطبقة 8</option>
//             <option className="text-dis" value="9">الطبقة 9</option>
//             <option className="text-dis" value="10">الطبقة 10</option>
//             <option className="text-dis" value="11">الطبقة 11</option>
//             <option className="text-dis" value="12">الطبقة 12</option>
//             <option className="text-dis" value="13">الطبقة 13</option>
//             <option className="text-dis" value="14">الطبقة 14</option>
//             <option className="text-dis" value="15">الطبقة 15</option>
//             <option className="text-dis" value="16">الطبقة 16</option>
//             <option className="text-dis" value="17">الطبقة 17</option>
//             <option className="text-dis" value="18">الطبقة 18</option>
//             <option className="text-dis" value="19">الطبقة 19</option>
//             <option className="text-dis" value="20">الطبقة 20</option>
//             <option className="text-dis" value="21">الطبقة 21</option>
//             <option className="text-dis" value="22">الطبقة 22</option>
//             <option className="text-dis" value="23">الطبقة 23</option>
//             <option className="text-dis" value="24">الطبقة 24</option>
//             <option className="text-dis" value="25">الطبقة 25</option>
//             <option className="text-dis" value="26">الطبقة 26</option>
//             <option className="text-dis" value="27">الطبقة 27</option>
//             <option className="text-dis" value="28">الطبقة 28</option>
//             <option className="text-dis" value="29">الطبقة 29</option>
//             <option className="text-dis" value="30">الطبقة 30</option>
//           </select>
//         </div>

//         <div className="flex justify-between items-center gap-2">
//           <div>
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="from">
//               من:
//             </label>
//             <input
//               type="number"
//               id="from"
//               value={from}
//               onChange={(e) => setFrom(parseInt(e.target.value, 10))}
//               className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="to">
//               إلى:
//             </label>
//             <input
//               type="number"
//               id="to"
//               value={to}
//               onChange={(e) => setTo(parseInt(e.target.value, 10))}
//               className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-gray-700 font-bold mb-2" htmlFor="increaseAmount">
//             مقدار الزيادة:
//           </label>
//           <input
//             type="number"
//             id="increaseAmount"
//             value={increaseAmount}
//             onChange={(e) => setIncreaseAmount(parseInt(e.target.value, 10))}
//             className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//           />
//         </div>

//         <div className="flex justify-center items-center gap-4">
//           <button
//             onClick={handleDecrease}
//             className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
//           >
//             نقصان {increaseAmount}
//           </button>
//           <button
//             onClick={handleIncrease}
//             className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
//           >
//             زيادة {increaseAmount}
//           </button>
//         </div>

//         <div className="flex justify-between items-center gap-2">
//           <label className="block text-gray-700 font-bold mb-2" htmlFor="filter">
//             شرط التصفية (selected):
//           </label>
//           <input
//             type="text"
//             id="filter"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//           />
//         </div>
//       </div>

//       {retryCountdown > 0 && (
//         <div className="text-center text-red-500 font-bold mt-4">
//           المحاولة التالية خلال: {retryCountdown} ثانية
//         </div>
//       )}

//       <div className="flex flex-col gap-4 mt-4">
//         <div className="flex gap-4">
//           <button
//             onClick={isAutoDownloading ? handleStop : handlePlay}
//             className={`flex-1 ${isAutoDownloading ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
//               } text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center`}
//           >
//             {isAutoDownloading ? '■ إيقاف' : '▶️ تشغيل تلقائي'}
//           </button>
//         </div>


//         <button
//           onClick={handleDownload}
//           className="bg-bl hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg w-full"
//         >
//           تنزيل بصيغة JSON
//         </button>

//       </div>
//     </div>
//   );
// }















// import React, { useState } from 'react';

// export default function DownloadLayers() {
//   const [layer, setLayer] = useState('0');
//   const [from, setFrom] = useState(0);
//   const [to, setTo] = useState(2000);
//   const [filter, setFilter] = useState('1=1');

//   const handleIncrease = () => {
//     setTo(prev => prev + 2000);
//     setFrom(prev => prev + 2000);
//   };

//   const handleDecrease = () => {
//     setTo(prev => prev - 2000);
//     setFrom(prev => prev - 2000);
//   };

//   const handleDownload = async () => {
//     const resultOffset = from;
//     const count = to - from;
//     const encodedFilter = encodeURIComponent(filter);
//     const baseUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/UMaps_AdministrativeData/MapServer/${layer}/query`;
//     const queryParams = `?f=json&resultOffset=${resultOffset}&resultRecordCount=${count}&where=${encodedFilter}&objectIds=&orderByFields=&outFields=*&returnGeometry=true`;
//     const urlLayer28 = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query`;
//     const url = `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${layer === '28' ? urlLayer28 : baseUrl}${queryParams}`;

//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error('حدث خطأ أثناء جلب البيانات');
//       }
//       const data = await response.json();
//       const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//       const fileName = `layer-${layer}_from-${from}_to-${to}_count-${count}.json`;
//       const link = document.createElement('a');
//       link.href = window.URL.createObjectURL(blob);
//       link.download = fileName;
//       link.click();
//     } catch (error) {
//       console.error('Error downloading data:', error);
//     }
//   };

//   return (
//     <div className="bg-white p-2 rounded-lg">
//       <h2 className="text-xl text-dis font-bold mb-4 text-center">تنزيل بيانات الطبقات</h2>
//       <div className="grid grid-cols-1 gap-4 w-full">
//         <div>
//           <label className="block text-gray-400 font-bold mb-2" htmlFor="layer">
//             اختر الطبقة:
//           </label>
//           <select
//             id="layer"
//             value={layer}
//             onChange={(e) => setLayer(e.target.value)}
//             className="block w-full px-4 py-2 text-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//           >
//             <option className='text-dis' value="0">الطبقة 0</option>
//             <option className='text-dis' value="1">الطبقة 1</option>
//             <option className='text-dis' value="2">الطبقة 2</option>
//             <option className='text-dis' value="3">الطبقة 3</option>
//             <option className='text-dis' value="4">الطبقة 4</option>
//             <option className='text-dis' value="5">الطبقة 5</option>
//             <option className='text-dis' value="6">الطبقة 6</option>
//             <option className='text-dis' value="7">الطبقة 7</option>
//             <option className='text-dis' value="8">الطبقة 8</option>
//             <option className='text-dis' value="9">الطبقة 9</option>
//             <option className='text-dis' value="10">الطبقة 10</option>
//             <option className='text-dis' value="11">الطبقة 11</option>
//             <option className='text-dis' value="12">الطبقة 12</option>
//             <option className='text-dis' value="13">الطبقة 13</option>
//             <option className='text-dis' value="14">الطبقة 14</option>
//             <option className='text-dis' value="15">الطبقة 15</option>
//             <option className='text-dis' value="16">الطبقة 16</option>
//             <option className='text-dis' value="17">الطبقة 17</option>
//             <option className='text-dis' value="18">الطبقة 18</option>
//             <option className='text-dis' value="19">الطبقة 19</option>
//             <option className='text-dis' value="20">الطبقة 20</option>
//             <option className='text-dis' value="21">الطبقة 21</option>
//             <option className='text-dis' value="22">الطبقة 22</option>
//             <option className='text-dis' value="23">الطبقة 23</option>
//             <option className='text-dis' value="24">الطبقة 24</option>
//             <option className='text-dis' value="25">الطبقة 25</option>
//             <option className='text-dis' value="26">الطبقة 26</option>
//             <option className='text-dis' value="27">الطبقة 27</option>
//             <option className='text-dis' value="28">الطبقة 28</option>
//             <option className='text-dis' value="29">الطبقة 29</option>
//             <option className='text-dis' value="30">الطبقة 30</option>
//           </select>
//         </div>

//         <div className='flex justify-between items-center gap-2'>
//           <div>
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="from">
//               من:
//             </label>
//             <input
//               type="number"
//               id="from"
//               value={from}
//               onChange={(e) => setFrom(parseInt(e.target.value, 10))}
//               className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="to">
//               إلى:
//             </label>
//             <input
//               type="number"
//               id="to"
//               value={to}
//               onChange={(e) => setTo(parseInt(e.target.value, 10))}
//               className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//             />
//           </div>
//         </div>

//         {/* أزرار زيادة ونقصان قيمة "إلى" بمقدار 2000 */}
//         <div className='flex justify-center items-center gap-4'>
//           <button
//             onClick={handleDecrease}
//             className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
//           >
//             نقصان 2000
//           </button>
//           <button
//             onClick={handleIncrease}
//             className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
//           >
//             زيادة 2000
//           </button>
//         </div>

//         <div className='flex justify-between items-center gap-2'>
//           <label className="block text-gray-700 font-bold mb-2" htmlFor="filter">
//             شرط التصفية (selected):
//           </label>
//           <input
//             type="text"
//             id="filter"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//           />
//         </div>
//       </div>
//       <button
//         onClick={handleDownload}
//         className="bg-bl hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg mt-4 w-full"
//       >
//         تنزيل بصيغة JSON
//       </button>
//     </div>
//   );
// }













// import React, { useState } from 'react';

// export default function DownloadLayers() {
//   const [layer, setLayer] = useState('0');
//   const [from, setFrom] = useState(0);
//   const [to, setTo] = useState(2000);
//   const [filter, setFilter] = useState('1=1');

//   const handleDownload = async () => {
//     // حساب عدد السجلات المطلوب جلبها
//     const resultOffset = from;
//     const count = to - from;
//     // ترميز شرط التصفية
//     const encodedFilter = encodeURIComponent(filter);
//     // بناء الرابط الأساسي للخدمة مع رقم الطبقة المحدد
//     const baseUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/UMaps_AdministrativeData/MapServer/${layer}/query`;
//     // إعداد معلمات الاستعلام
//     const queryParams = `?f=json&resultOffset=${resultOffset}&resultRecordCount=${count}&where=${encodedFilter}&objectIds=&orderByFields=&outFields=*&returnGeometry=true`;
//     const urlLayer28 = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query`;
//     // استخدام البروكسي لتجاوز القيود أو التوجيه
//     const url = `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${layer === '28' ? urlLayer28 : baseUrl}${queryParams}`;

//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//          throw new Error('حدث خطأ أثناء جلب البيانات');
//       }
//       const data = await response.json();
//       // إنشاء ملف Blob بصيغة JSON
//       const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//       // إنشاء اسم الملف بناءً على الطبقة والقيم المُدخلة
//       const fileName = `layer-${layer}_from-${from}_to-${to}_count-${count}.json`;
//       // إنشاء رابط مؤقت للتنزيل
//       const link = document.createElement('a');
//       link.href = window.URL.createObjectURL(blob);
//       link.download = fileName;
//       link.click();
//     } catch (error) {
//       console.error('Error downloading data:', error);
//     }
//   };

//   return (
//     <div className="bg-white p-2 rounded-lg">
//       <h2 className="text-xl text-dis font-bold mb-4 text-center">تنزيل بيانات الطبقات</h2>
//       <div className="grid grid-cols-1 gap-4 w-full">
//         <div>
//           <label className="block text-gray-400 font-bold mb-2" htmlFor="layer">
//             اختر الطبقة:
//           </label>
//           <select
//             id="layer"
//             value={layer}
//             onChange={(e) => setLayer(e.target.value)}
//             className="block w-full px-4 py-2 text-gray-400 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//           >
//           <option className='text-dis ' value="0">الطبقة 0</option>
//             <option className='text-dis ' value="1">الطبقة 1</option>
//             <option className='text-dis ' value="2">الطبقة 2</option>
//             <option className='text-dis ' value="3">الطبقة 3</option>
//             <option className='text-dis ' value="4">الطبقة 4</option>
//             <option className='text-dis ' value="5">الطبقة 5</option>
//             <option className='text-dis ' value="6">الطبقة 6</option>
//             <option className='text-dis ' value="7">الطبقة 7</option>
//             <option className='text-dis ' value="8">الطبقة 8</option>
//             <option className='text-dis ' value="9">الطبقة 9</option>
//             <option className='text-dis ' value="10">الطبقة 10</option>
//             <option className='text-dis ' value="11">الطبقة 11</option>
//             <option className='text-dis ' value="12">الطبقة 12</option>
//             <option className='text-dis ' value="13">الطبقة 13</option>
//             <option className='text-dis ' value="14">الطبقة 14</option>
//             <option className='text-dis ' value="15">الطبقة 15</option>
//             <option className='text-dis ' value="16">الطبقة 16</option>
//             <option className='text-dis ' value="17">الطبقة 17</option>
//             <option className='text-dis ' value="18">الطبقة 18</option>
//             <option className='text-dis ' value="19">الطبقة 19</option>
//             <option className='text-dis ' value="20">الطبقة 20</option>
//             <option className='text-dis ' value="21">الطبقة 21</option>
//             <option className='text-dis ' value="22">الطبقة 22</option>
//             <option className='text-dis ' value="23">الطبقة 23</option>
//             <option className='text-dis ' value="24">الطبقة 24</option>
//             <option className='text-dis ' value="25">الطبقة 25</option>
//             <option className='text-dis ' value="26">الطبقة 26</option>
//             <option className='text-dis ' value="27">الطبقة 27</option>
//             <option className='text-dis ' value="28">الطبقة 28</option>
//             <option className='text-dis ' value="29">الطبقة 29</option>
//             <option className='text-dis ' value="30">الطبقة 30</option>
//           </select>
//         </div>

//         <div className='flex justify-between items-center gap-2'>
//             <div>
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="from">
//                 من:
//             </label>
//             <input
//                 type="number"
//                 id="from"
//                 value={from}
//                 onChange={(e) => setFrom(parseInt(e.target.value, 10))}
//                 className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//             />
//             </div>
//             <div>
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="to">
//                 إلى:
//             </label>
//             <input
//                 type="number"
//                 id="to"
//                 value={to}
//                 onChange={(e) => setTo(parseInt(e.target.value, 10))}
//                 className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//             />
//             </div>
//         </div>

//         <div className='flex justify-between items-center gap-2'>
//           <label className="block text-gray-700 font-bold mb-2" htmlFor="filter">
//             شرط التصفية (selected):
//           </label>
//           <input
//             type="text"
//             id="filter"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bl focus:border-bl"
//           />
//         </div>

//       </div>
//       <button
//         onClick={handleDownload}
//         className="bg-bl hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg mt-4 w-full"
//       >
//         تنزيل بصيغة JSON
//       </button>
//     </div>
//   );
// }
