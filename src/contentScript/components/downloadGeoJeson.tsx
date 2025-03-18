import React, { useState, useEffect, useRef } from "react";

export default function DownloadGeoJson() {
  // إعدادات البيانات الأساسية
  const [useProxy, setUseProxy] = useState(true);
  const [fileType, setFileType] = useState("json"); // نستخدم json للطلب
  const [layer, setLayer] = useState("00100001");
  const [cityName, setCityName] = useState("المدينة");
  // عدد العناصر التي سيتم جلبها في كل طلب
  const [resultRecordCount, setResultRecordCount] = useState(1500);
  const [baseUrl, setBaseUrl] = useState("");

  // حالة الشروط الإضافية للاستثناءات
  const [additionalWhere, setAdditionalWhere] = useState("");

  // إعدادات التأخير والتحميل التلقائي
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [minDelay, setMinDelay] = useState(5);
  const [maxDelay, setMaxDelay] = useState(100);
  const [waitingTime, setWaitingTime] = useState(0);

  // استخدام useRef لتخزين رقم الصفحة الحالي بشكل متزامن
  const pageRef = useRef(0);
  // لتتبع عدد العناصر المحملة وإجماليها وعدد الطلبات
  const [downloadedCount, setDownloadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  // دالة تُنشئ جملة where بناءً على الشروط الأساسية والاستثناءات
  const buildWhereClause = () => {
    const baseClause = "1=1";
    // إذا وُجدت شروط إضافية يتم دمجها مع قاعدة الاستعلام
    return additionalWhere ? `${baseClause} AND ${additionalWhere}` : baseClause;
  };

  // جلب العدد الإجمالي للعناصر في الطبقة 28 مع أخذ الاستثناءات في الاعتبار
  const fetchTotalCount = async () => {
    try {
      const varl= "1%3D1%20AND%20CITY_ID%20%3C%3E%20'00100001'%20AND%20CITY_ID%20%3C%3E%20'00700001'%20AND%20CITY_ID%20%3C%3E%20'00800001'%20AND%20REGION_ID%20%3C%3E%20'005'%20AND%20REGION_ID%20%3C%3E%20'001'%20AND%20REGION_ID%20%3C%3E%20'002'"
      const whereClause = encodeURIComponent(buildWhereClause()) ? encodeURIComponent(buildWhereClause()): varl;
      const queryUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/${layer}/query?where=1%3D1%20AND%20CITY_ID%20%3C%3E%20'00100001'%20AND%20CITY_ID%20%3C%3E%20'00700001'%20AND%20CITY_ID%20%3C%3E%20'00800001'%20AND%20REGION_ID%20%3C%3E%20'005'%20AND%20REGION_ID%20%3C%3E%20'001'%20AND%20REGION_ID%20%3C%3E%20'002'%20AND%20OBJECTID%20%3E%3D%2024565155&returnCountOnly=true&f=json`;
      const url = useProxy
        ? `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${queryUrl}`
        : queryUrl;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`خطأ في جلب العدد: ${response.status}`);
      }
      const data = await response.json();
      if (data.count !== undefined) {
        setTotalCount(data.count);
      }
    } catch (error) {
      console.error("خطأ في جلب العدد الإجمالي:", error);
    }
  };

  // تحديث العدد الإجمالي عند بداية التشغيل أو عند تغيير الإعدادات أو الاستثناءات
  useEffect(() => {
    fetchTotalCount();
  }, [layer, useProxy, additionalWhere]);

  // تحديث الرابط الأساسي باستخدام resultOffset المستند على رقم الصفحة من pageRef
  useEffect(() => {
    const offset = pageRef.current * resultRecordCount;
    const varl= "1%3D1%20AND%20CITY_ID%20%3C%3E%20'00100001'%20AND%20CITY_ID%20%3C%3E%20'00700001'%20AND%20CITY_ID%20%3C%3E%20'00800001'%20AND%20REGION_ID%20%3C%3E%20'005'%20AND%20REGION_ID%20%3C%3E%20'001'%20AND%20REGION_ID%20%3C%3E%20'002'"
    const whereClause = encodeURIComponent(buildWhereClause()) ? encodeURIComponent(buildWhereClause()): varl;
    const queryUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/${layer}/query?outFields=*&resultOffset=${offset}&resultRecordCount=${resultRecordCount}&f=${fileType}&where=1%3D1%20AND%20CITY_ID%20%3C%3E%20'00100001'%20AND%20CITY_ID%20%3C%3E%20'00700001'%20AND%20CITY_ID%20%3C%3E%20'00800001'%20AND%20REGION_ID%20%3C%3E%20'005'%20AND%20REGION_ID%20%3C%3E%20'001'%20AND%20REGION_ID%20%3C%3E%20'002'%20AND%20OBJECTID%20%3E%3D%2024565155`;
    const url = useProxy
      ? `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${queryUrl}`
      : queryUrl;
    setBaseUrl(url);
    console.log("الرابط الأساسي:", url);
  }, [layer, resultRecordCount, fileType, useProxy, additionalWhere]);
   
  // دالة لتحميل دفعة من العناصر بناءً على رقم الصفحة من pageRef
  const processDownload = async () => {
    const currentPage = pageRef.current;
    const offset = currentPage * resultRecordCount;
    const varl= "1%3D1%20AND%20CITY_ID%20%3C%3E%20'00100001'%20AND%20CITY_ID%20%3C%3E%20'00700001'%20AND%20CITY_ID%20%3C%3E%20'00800001'%20AND%20REGION_ID%20%3C%3E%20'005'%20AND%20REGION_ID%20%3C%3E%20'001'%20AND%20REGION_ID%20%3C%3E%20'002'"
    const whereClause = encodeURIComponent(buildWhereClause()) ? encodeURIComponent(buildWhereClause()): varl;
    const queryUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/${layer}/query?outFields=*&resultOffset=${offset}&resultRecordCount=${resultRecordCount}&f=${fileType}&where=1%3D1%20AND%20CITY_ID%20%3C%3E%20'00100001'%20AND%20CITY_ID%20%3C%3E%20'00700001'%20AND%20CITY_ID%20%3C%3E%20'00800001'%20AND%20REGION_ID%20%3C%3E%20'005'%20AND%20REGION_ID%20%3C%3E%20'001'%20AND%20REGION_ID%20%3C%3E%20'002'%20AND%20OBJECTID%20%3E%3D%2024565155`;
    const url = useProxy
      ? `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${queryUrl}`
      : queryUrl;
    setBaseUrl(url);

    const response = await fetch(url);
    console.log("تحميل البيانات من:", url);
    if (!response.ok) {
      throw new Error(`حدث خطأ أثناء التحميل: ${response.status}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const features = data.features;
      console.log(
        `${cityName} - تحميل دفعة من العناصر في الصفحة ${currentPage + 1}`
      );
      
      // تنزيل الملف للدفعة الحالية باستخدام currentPage
      downloadGeoJSONFile(data, currentPage, requestCount + 1);

      // تحديث العدد المحمل وعدد الطلبات
      setDownloadedCount((prev) => prev + features.length);
      setRequestCount((prev) => prev + 1);

      // تحديث رقم الصفحة مباشرةً عبر المرجع
      pageRef.current = currentPage + 1;
    } else {
      console.log("لا توجد عناصر لتحميلها في هذه الدفعة.");
    }

    return data;
  };

  // دالة للحصول على تأخير عشوائي بين minDelay و maxDelay (بالثواني)
  const getRandomDelay = (min:number, max:number) => {
    const minMs = min * 1000;
    const maxMs = max * 1000;
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  };

  // تحميل تلقائي مع تأخير بين الدفعات
  const autoDownload = async () => {
    try {
      const data = await processDownload();
      if (data === null) {
        if (autoAdvance) {
          const delay = getRandomDelay(minDelay, maxDelay);
          startCountdownAndRetry(delay);
        }
        return;
      }
    } catch (error) {
      console.error("حدث خطأ أثناء التحميل التلقائي:", error);
      if (autoAdvance) {
        const delay = getRandomDelay(minDelay, maxDelay);
        startCountdownAndRetry(delay);
      }
      return;
    }
    if (autoAdvance) {
      const delay = getRandomDelay(minDelay, maxDelay);
      startCountdownAndRetry(delay);
    }
  };

  // بدء العد التنازلي للتأخير ثم المحاولة مرة أخرى
  const startCountdownAndRetry = (delayMs:any) => {
    let secondsLeft = Math.floor(delayMs / 1000);
    setWaitingTime(secondsLeft);
    const countdown = setInterval(() => {
      if (!autoAdvance) {
        clearInterval(countdown);
        setWaitingTime(0);
        return;
      }
      secondsLeft--;
      setWaitingTime(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(countdown);
        autoDownload();
      }
    }, 1000);
  };

  useEffect(() => {
    if (autoAdvance) {
      autoDownload();
    }
  }, [autoAdvance]);

  useEffect(() => {
    if (!autoAdvance) {
      setWaitingTime(0);
    }
  }, [autoAdvance]);

  // دالة تنزيل الملف بصيغة GeoJSON مع إضافة رقم الطلب ورقم الصفحة في اسم الملف
  const downloadGeoJSONFile = (data:any, currentPage:any, currentRequest:any) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/geo+json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // استخدام currentPage و currentRequest لضمان تطابق بيانات الملف مع الصفحة الحالية
    a.download = `${cityName}_request${currentRequest}_page${currentPage + 1}.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="py-2 px-4 bg-gray-100 border shadow-lg w-full h-full pt-44">
      {/* إدخال البيانات الأساسية */}
      <div>
        <label className="block mb-1">كود المدينة</label>
        <input
          type="text"
          value={layer}
          onChange={(e) => setLayer(e.target.value)}
          placeholder="أدخل كود المدينة"
          className="p-2 w-full border"
        />
      </div>

      <div>
        <label className="block mb-1">اسم المدينة</label>
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="أدخل اسم المدينة"
          className="p-2 w-full border"
        />
      </div>

      {/* حقل لإضافة استثناءات أو شروط إضافية للاستعلام */}
      <div>
        <label className="block mb-1">شروط إضافية (استثناءات)</label>
        <input
          type="text"
          value={additionalWhere}
          onChange={(e) => setAdditionalWhere(e.target.value)}
          placeholder="مثال: OBJECTID > 1000"
          className="p-2 w-full border"
        />
      </div>

      <div>
        <label className="block mb-1">نوع الملف</label>
        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="p-2 w-full border"
        >
          <option value="json">JSON</option>
          <option value="geoJSON">GeoJSON</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">
          عدد العناصر في كل طلب (resultRecordCount)
        </label>
        <input
          type="number"
          value={resultRecordCount}
          onChange={(e) => setResultRecordCount(Number(e.target.value))}
          placeholder="أدخل عدد العناصر في كل طلب"
          className="p-2 w-full border"
        />
      </div>

      <div>
        <label className="block mb-1">الرابط الأساسي</label>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="الرابط الأساسي"
          className="p-2 w-full border bg-gray-200"
          readOnly
        />
      </div>

      {/* إعدادات إضافية */}
      <div className="border p-2 my-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={useProxy}
            onChange={(e) => setUseProxy(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">استخدام البروكسي</span>
        </div>

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
            className="mr-2"
          />
          <span>تحميل تلقائي مع تأخير</span>
        </div>

        <div className="mt-2">
          <label className="block mb-1">التأخير الأدنى (ثواني)</label>
          <input
            type="number"
            value={minDelay}
            onChange={(e) => setMinDelay(Number(e.target.value))}
            placeholder="أدخل التأخير الأدنى"
            className="p-2 w-full border"
          />
        </div>
        <div className="mt-2">
          <label className="block mb-1">التأخير الأقصى (ثواني)</label>
          <input
            type="number"
            value={maxDelay}
            onChange={(e) => setMaxDelay(Number(e.target.value))}
            placeholder="أدخل التأخير الأقصى"
            className="p-2 w-full border"
          />
        </div>
        {autoAdvance && waitingTime > 0 && (
          <div className="mt-2 text-center text-sm text-blue-600">
            الانتظار: {waitingTime} ثواني...
          </div>
        )}

     <div className="border p-2 block">
        <p>إجمالي عدد العناصر في الطبقة: {totalCount}</p>
        <p>عدد العناصر المحملة: {downloadedCount}</p>
        <p>العناصر المتبقية: {totalCount - downloadedCount}</p>
        <p>عدد الطلبات: {requestCount}</p>
      </div>

      {/* زر التحميل اليدوي */}
      <div className="mt-4">
        <button
          onClick={processDownload}
          className="bg-blue-500 text-white p-2 rounded"
        >
          تحميل دفعة
        </button>
      </div>
      </div>

      {/* عرض معلومات التحميل */}

    </div>
  );
}
