import React, { useState, useEffect, useRef } from "react";
import { buildWhereClause } from "./lib/buildWhereClause";
import { generateMapQueryUrl } from "./lib/generateMapQueryUrl";
import { fetchTotalCount } from "./lib/fetchTotalCount";



export default function DownloadGeoJesonByRegion() {
  // الإعدادات العامة
  const [useProxy, setUseProxy] = useState(!false);
  // const [fileType, setFileType] = useState("geoJSON");
  const [selectLayer, setSelectLayer] = useState("28");
  const [lastObjectId, setLastObjectId] = useState(0);
  const [lastRegonId, setLastRegonId] = useState("");
  const [lastCityId, setLastCityId] = useState("");

  const [additionalWhere, setAdditionalWhere] = useState("");
  const [whereRegionIds, setWhereRegionIds] = useState("");
  const [whereCityIds, setWhereCityIds] = useState("");


  const [typefile, setTypefile] = useState("geoJson");
  const [objectIdOperator, setObjectIdOperator] = useState(">");
  const [selectServer, setselectServer] = useState<"Umaps_Identify_Satatistics" | "Umaps_Click" | "UMaps_AdministrativeData"| "UMaps_AdditionalLayers" >("UMaps_AdditionalLayers");

  const [resultRecordCount, setResultRecordCount] = useState(selectServer === "Umaps_Identify_Satatistics" ? 20000 :2000);
  const [baseUrl, setBaseUrl] = useState("");

  // إعدادات التنزيل التلقائي
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [minDelay, setMinDelay] = useState(5); // بالثواني
  const [maxDelay, setMaxDelay] = useState(15); // بالثواني
  const [waitingTime, setWaitingTime] = useState(0);


  const [downloadedCount, setDownloadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);


  // قائمة المعرّفات التي تم تنزيلها لمنع التكرار
  const [downloadedIds, setDownloadedIds] = useState<number[]>([]);

  // مرجع لتحديث lastObjectId داخل الدوال
  const lastObjectIdRef = useRef(lastObjectId);
  const lastRegonIdRef = useRef(lastRegonId);
  const lastCityIdRef = useRef(lastCityId);
  const autoAdvanceRef = useRef(autoAdvance);
  

  useEffect(() => {
    lastObjectIdRef.current = lastObjectId;
    lastRegonIdRef.current = lastRegonId;
    lastCityIdRef.current = lastCityId;
    autoAdvanceRef.current = autoAdvance;
  }, [lastObjectId , lastRegonId , lastCityId , autoAdvance]);

  // تحديث الرابط الأساسي بناءً على الإعدادات وخيار البروكسي
  useEffect(() => {
    // أولاً نقوم ببناء شرط البحث باستخدام الدالة buildWhereClause الخاصة بك
    const whereClause = buildWhereClause(
      whereRegionIds,
      whereCityIds,
      lastObjectIdRef.current,
      objectIdOperator,
      additionalWhere
    );
    
    // ثم نستخدم الدالة generateMapQueryUrl لتوليد الرابط النهائي
    const url = generateMapQueryUrl({
      selectLayer,           // الطبقة المطلوبة
      selectServer,
      resultRecordCount,     // عدد السجلات المطلوب إرجاعها
      whereClause,           // شرط البحث الذي قمنا ببنائه
      useProxy,              // هل نستخدم البروكسي أم لا
      f:typefile,

    });
    
    // تعيين الرابط على الحالة المستخدمة في التطبيق
    setBaseUrl(url);
    console.log("آخر تحديث للرابط:", url);
  }, [selectLayer, lastObjectId, objectIdOperator, resultRecordCount, useProxy]);
  
  const GetCountByWhereClause = ()=>{
    const whereClause = buildWhereClause(
      whereRegionIds,
      whereCityIds,
      lastObjectIdRef.current,
      objectIdOperator,
      additionalWhere
    );
    fetchTotalCount(setTotalCount , selectLayer  , useProxy , selectServer , whereClause )

  }

  const processDownload = async () => {
    // التأكد من أن الطلب جديد ولم يتم طلبه مسبقاً
    if (downloadedIds.includes(lastObjectIdRef.current)) {
      console.log("⚠️ تم تنزيل البيانات مسبقاً لهذا المعرف:", lastObjectIdRef.current);
      const newId = window.prompt("أدخل معرف جديد:");
      if (newId) {
        setLastObjectId(Number(newId));
      }
      return null;
    }
  
    // بناء شرط البحث باستخدام الدالة buildWhereClause الخاصة بك
    const whereClause = buildWhereClause(
      whereRegionIds,
      whereCityIds,
      lastObjectIdRef.current,
      objectIdOperator,
      additionalWhere
    );
  
    // استخدام الدالة generateMapQueryUrl لتجميع الرابط النهائي
    const url = generateMapQueryUrl({
      selectLayer,           // الطبقة المطلوبة
      selectServer,
      resultRecordCount,     // عدد السجلات المطلوب إرجاعها
      whereClause,           // شرط البحث (سيتم ترميزه داخليًا عبر URLSearchParams)
      useProxy,              // استخدام البروكسي أم لا
      f:typefile,
    });
  
    // تعيين الرابط المُجمّع كعنوان أساسي في الحالة
    setBaseUrl(url);
    console.log("🚀 تم إرسال الطلب:", url);
    // if(autoAdvance){
    //   console.log("close")
    //   return null
    // }
    // إرسال الطلب باستخدام fetch
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`❌ فشل الاتصال بالملف، رمز الحالة: ${response.status}`);
    }
    const data = await response.json();
  
    if (data.features && data.features.length > 0) {
      const features = data.features;
      const firstFeature = features[0];
      const lastFeature = features[features.length - 1];
      setDownloadedCount((prev) => prev + features.length);
      setRequestCount((prev) => prev + 1);

  
      console.log(
        `✅ layer_${selectLayer}_Regon_${lastRegonIdRef.current}_City_${lastCityIdRef.current}_LastObjectid_${lastObjectIdRef.current}.geojson - نجح جلب البيانات`
      );
      console.log("أول عنصر:", firstFeature);
      console.log("آخر عنصر:", lastFeature);
  
      // تحديث رقم آخر عنصر بناءً على بيانات آخر عنصر من المجموعة
      let newLastId = lastFeature.id || lastFeature.properties?.OBJECTID;
      let newLastRegonId = lastFeature.properties?.REGION_ID;
      let newLastCityId = lastFeature.properties?.CITY_ID;
      if (newLastId && newLastId !== lastObjectIdRef.current) {
        setLastObjectId(newLastId);
        setLastRegonId(newLastRegonId);
        setLastCityId(newLastCityId);
      }
  
      // تحميل الملف بعد نجاح استرجاع البيانات
      downloadGeoJSONFile(data);
    } 

    if (!data || !data.features || data.features.length === 0) {
      console.log("⚠️ لم يتم العثور على عناصر جديدة. إيقاف التنزيل التلقائي.");
      setAutoAdvance(false);
      location.reload()
      return;
    }
  
    // تحديث قائمة المعرفات التي تم تنزيلها
    if (!downloadedIds.includes(lastObjectIdRef.current)) {
      setDownloadedIds((prevIds) => [...prevIds, lastObjectIdRef.current]);
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

  // بدء التنزيل التلقائي عند تفعيل الخيار
  useEffect(() => {
    if (autoAdvance) {
      autoDownload();
    }
  }, [autoAdvance]);

  // إعادة تعيين مؤقت العد التنازلي عند إيقاف التنزيل التلقائي
  useEffect(() => {
    if (!autoAdvance) {
      setWaitingTime(0);
    }
  }, [autoAdvance]);


  // دالة تحميل ملف GeoJSON
const downloadGeoJSONFile = (data:any) => {
  // تحويل البيانات إلى سلسلة JSON
  const jsonString = JSON.stringify(data, null, 2);
  // إنشاء Blob من السلسلة مع تحديد نوع الملف
  const blob = new Blob([jsonString], { type: 'application/geo+json' });
  // إنشاء عنوان URL مؤقت للـ Blob
  const url = window.URL.createObjectURL(blob);
  // إنشاء عنصر رابط (anchor)
  const a = document.createElement('a');
  a.href = url;
  // تعيين اسم الملف (يمكنك تعديل الاسم حسب الحاجة)
  a.download = `layer_${selectLayer}_LastObjectid_${lastObjectIdRef.current}_Regon_${lastRegonIdRef.current}_City_${lastCityIdRef.current}.geojson`;
  // إضافته إلى الصفحة (مطلوب لبعض المتصفحات)
  document.body.appendChild(a);
  // تفعيل النقر لتحميل الملف
  a.click();
  // إزالة العنصر بعد النقر وتنظيف الرابط المؤقت
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};


  return (
    <div dir={"ltr"} className="py-2 px-4 w-full h-full text-dis">
        <div dir={"ltr"} className=" shadow border rounded">
          <label className="block mb-1"> select server</label>
          <select
            value={selectServer}
            onChange={(e) => setselectServer(e.target.value as any)}
            className="p-2 w-full border"
          >
            <option value="Umaps_Identify_Satatistics">server1 53 layers</option>
            <option value="Umaps_Click">server click 63 layers</option>
            <option value="UMaps_AdministrativeData">server AdministrativeData 7layers</option>
            <option value="UMaps_AdditionalLayers">server 4 more 72 layers</option>
          </select>
        </div>

        <div dir={"ltr"} className=" shadow border rounded">
          <label className="block mb-1"> select type file</label>
          <select
            value={typefile}
            onChange={(e) => setTypefile(e.target.value as any)}
            className="p-2 w-full border"
          >
            <option value="geoJSON">geoJSON</option>
            <option value="json">json</option>
            <option value="pbf">pbf</option>
            <option value="html">html</option>
            <option value="html">html</option>
          </select>
        </div>

        {/* الحقول الأساسية */}
        <div dir={"ltr"} className=" p-2">
          <label className="block mb-1">select layer</label>
          <input
            type="text"
            value={selectLayer}
            onChange={(e) => setSelectLayer(e.target.value)}
            placeholder="layers ===> 28 , 26 , 29 , 30 ....."
            className="p-2 w-full border"
            dir={"ltr"}
          />
        </div>

        <div dir={"ltr"} className=" shadow border rounded">
          <label className="block mb-1">lastRegonId use == file name</label>
          <input
            type="text"
            value={lastRegonId}
            onChange={(e) => setLastRegonId(e.target.value)}
            placeholder="001"
            className="p-2 w-full border"
          />
        </div>

        <div dir={"ltr"} className=" shadow border rounded">
          <label className="block mb-1">lastCityId use == file name</label>
          <input
            type="text"
            value={lastCityId}
            onChange={(e) => setLastCityId(e.target.value)}
            placeholder="00300001"
            className="p-2 w-full border"
          />
        </div>

        <div dir={"ltr"} className=" shadow border rounded">
          <label className="block mb-1">where by REGION_ID/REGION_IDs</label>
          <input
            type="text"
            value={whereRegionIds}
            onChange={(e) => setWhereRegionIds(e.target.value)}
            placeholder="001 / 002 ,005"
            className="p-2 w-full border"
          />
        </div>


        <div dir={"ltr"} className=" shadow border rounded">
          <label className="block mb-1">where by CITY_ID/CITY_IDs</label>
          <input
            type="text"
            value={whereCityIds}
            onChange={(e) => setWhereCityIds(e.target.value)}
            placeholder="001 / 002 ,005"
            className="p-2 w-full border"
          />
        </div>

        <div dir={"ltr"} className=" shadow border rounded">
        <label className="block mb-1">
          Add More Where 
        </label>
        <input
          type="text"
          value={additionalWhere}
          onChange={(e) => setAdditionalWhere(e.target.value)}
          placeholder='مثال: OBJECTID >= 1000, CITY_ID <> 00050'
          className="p-2 border w-full"
        />
      </div>

        <div>
          <label className="block mb-1">add OBJECTID  </label>
          <input
            type="number"
            value={lastObjectId}
            onChange={(e) => setLastObjectId(Number(e.target.value))}
            placeholder="أدخل رقم آخر عنصر"
            className="p-2 w-full border"
          />
        </div>

        <div dir={"ltr"} className=" shadow border rounded">
          <label className="block mb-1"> operator with OBJECTID</label>
          <select
            value={objectIdOperator}
            onChange={(e) => setObjectIdOperator(e.target.value)}
            className="p-2 w-full border"
          >
            <option value=">">أكبر من</option>
            <option value=">=">أكبر من أو يساوي</option>
            <option value="<">أقل من</option>
            <option value="<=">أقل من أو يساوي</option>
            <option value="=">يساوي (=)</option>
            <option value="!=">لا يساوي (!=)</option>
            <option value="between">بين</option>
            <option value="not between">ليس بين</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            عدد السجلات (resultRecordCount)
          </label>
          <input
            type="number"
            value={resultRecordCount}
            onChange={(e) => setResultRecordCount(Number(e.target.value))}
            placeholder="أدخل عدد السجلات"
            className="p-2 w-full border"
          />
        </div>

        <div>
          <label className="block mb-1">الرابط الأساسي</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="الرابط يتم توليده تلقائياً"
            className="p-2 w-full border bg-gray-200"
            readOnly
          />
        </div>

        {/* إعدادات التنزيل التلقائي */}
        <div className="border p-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={useProxy}
              onChange={(e) => setUseProxy(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-dis">إضافة بروكسي إلى الرابط</span>
          </div>

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance((prev:boolean)=> !prev)}
              className="mr-2"
            />
            <span>تفعيل التنزيل التلقائي</span>
          </div>

          <div className="mt-2">
            <label className="block mb-1">الحد الأدنى للتأخير (ثواني)</label>
            <input
              type="number"
              value={minDelay}
              onChange={(e) => setMinDelay(Number(e.target.value))}
              placeholder="أدخل الحد الأدنى للتأخير"
              className="p-2 w-full border"
            />
          </div>
          <div className="mt-2">
            <label className="block mb-1">الحد الأقصى للتأخير (ثواني)</label>
            <input
              type="number"
              value={maxDelay}
              onChange={(e) => setMaxDelay(Number(e.target.value))}
              placeholder="أدخل الحد الأقصى للتأخير"
              className="p-2 w-full border"
            />
          </div>
          {autoAdvance && waitingTime > 0 && (
            <div className="mt-2 text-center text-sm text-blue-600">
              الانتظار: {waitingTime} ثانية...
            </div>
          )}

     <div className="border p-2 block">
        <p>إجمالي عدد العناصر في الطبقة: {totalCount}</p>
        <p>عدد العناصر المحملة: {downloadedCount}</p>
        <p>العناصر المتبقية: {totalCount - downloadedCount}</p>
        <p>عدد الطلبات: {totalCount / resultRecordCount}</p>
        <p>عدد الطلبات الناجحه: {requestCount}</p>
        <p>عدد الطلبات المتبقيه : {totalCount / resultRecordCount - requestCount}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="mt-4 w-1/2 p-2 bg-or rounded">
          <button
            onClick={processDownload}
            className="text-white"
          >
            start
          </button>
        </div>

        <div className="mt-4 w-1/2 bg-bl p-2 rounded">
          <button
            onClick={GetCountByWhereClause}
            className=" text-white"
          >
            get info
          </button>
        </div>
      </div>      

      
        </div>
    </div>
  );
}

