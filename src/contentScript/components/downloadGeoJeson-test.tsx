import React, { useState, useEffect, useRef } from "react";

export interface TypeSetting {
  useProxy: boolean;
  fileType: "geoJSON" | "json" | "pbf";
  cityId: string;
  cityName: string;
  lastObjectId: number;
  startObjectId: number;
  objectIdOperator: string;
  resultRecordCount: number;
  baseUrl: string;
  autoAdvance: boolean;
  minDelay: number;
  maxDelay: number;
  waitingTime: number;
  downloadedIds: number[];
  interval: number;
}

export default function DownloadGeoJsonTest() {
  const [setting, setSetting] = useState<TypeSetting>({
    useProxy: false,
    fileType: "geoJSON",
    cityId: "00100001",
    cityName: "المدينة",
    lastObjectId: 32561134,
    startObjectId: 32561134,
    objectIdOperator: ">",
    resultRecordCount: 2000,
    baseUrl: "",
    autoAdvance: false,
    minDelay: 5,
    maxDelay: 100,
    waitingTime: 0,
    downloadedIds: [],
    interval: 1000,
  });

  // متغير للتأكد من أول تنزيل
  const [firstDownload, setFirstDownload] = useState(true);

  const {
    autoAdvance,
    minDelay,
    maxDelay,
    waitingTime,
    downloadedIds,
    useProxy,
    fileType,
    cityId,
    cityName,
    lastObjectId,
    startObjectId,
    objectIdOperator,
    resultRecordCount,
    baseUrl,
  } = setting;

  const lastObjectIdRef = useRef(lastObjectId);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;
    setSetting((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const updateState = (key: keyof TypeSetting, value: any) => {
    setSetting((prev: TypeSetting) => ({
      ...prev,
      [key]: value,
    }));
  };

  // تحديث مرجع lastObjectId داخل الدوال
  useEffect(() => {
    lastObjectIdRef.current = lastObjectId;
  }, [lastObjectId]);

  // تنظيف المؤقت عند إلغاء تركيب المكون
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // تحديث الرابط الأساسي بناءً على الإعدادات وخيار البروكسي
  useEffect(() => {
    const operatorEncoded = encodeURIComponent(objectIdOperator);
    const queryUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query?outFields=*&resultOffset=0&resultRecordCount=${resultRecordCount}&f=${fileType}&where=REGION_ID%3D'002'%20AND%20CITY_ID%3C%3E'00200001'%20AND%20OBJECTID${operatorEncoded}${lastObjectIdRef.current}`;
    // const queryUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query?outFields=*&resultOffset=0&resultRecordCount=${resultRecordCount}&f=${fileType}&where=CITY_ID%3D'${cityId}'%20AND%20OBJECTID${operatorEncoded}${lastObjectId}`;
    const url = useProxy
      ? `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${queryUrl}`
      : queryUrl;
    updateState("baseUrl", url);
    console.log("آخر تحديث للرابط:", url);
  }, [cityId, lastObjectId, objectIdOperator, resultRecordCount, fileType, useProxy]);

  // الدالة الأساسية لمعالجة التنزيل
  const processDownload = async () => {
    try {
      // التأكد من أن الطلب جديد ولم يتم طلبه مسبقاً
      if (downloadedIds.includes(lastObjectIdRef.current)) {
        console.log("⚠️ تم تنزيل البيانات مسبقاً لهذا المعرف:", lastObjectIdRef.current);
        const newId = window.prompt("أدخل معرف جديد:");
        if (newId) {
          updateState("lastObjectId", Number(newId));
        }
        return null;
      }
      const operatorEncoded = encodeURIComponent(objectIdOperator);
      const queryUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query?outFields=*&resultOffset=0&resultRecordCount=${resultRecordCount}&f=${fileType}&where=REGION_ID%3D'002'%20AND%20CITY_ID%3C%3E'00200001'%20AND%20OBJECTID${operatorEncoded}${lastObjectIdRef.current}`;
      // const queryUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/28/query?outFields=*&resultOffset=0&resultRecordCount=${resultRecordCount}&f=${fileType}&where=CITY_ID%3D'${cityId}'%20AND%20OBJECTID${operatorEncoded}${lastObjectIdRef.current}`;
      const url = useProxy
        ? `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${queryUrl}`
        : queryUrl;
      updateState("baseUrl", url);

      const response = await fetch(url);
      console.log("🚀 تم إرسال الطلب:", url);

      if (!response.ok) {
        console.warn(`❌ فشل الاتصال بالملف، رمز الحالة: ${response.status}`);
        return null;
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const features = data.features;
        const firstFeature = features[0];
        const lastFeature = features[features.length - 1];

        console.log(`✅ ${cityName} - نجح جلب البيانات`);
        console.log("أول عنصر:", firstFeature);
        console.log("آخر عنصر:", lastFeature);

        // تحديث رقم آخر عنصر بناءً على آخر عنصر من البيانات
        let newLastId = lastFeature.id || lastFeature.properties?.OBJECTID;
        if (newLastId && newLastId !== lastObjectIdRef.current) {
          updateState("lastObjectId", newLastId);
        }

        // تحميل الملف بعد نجاح استرجاع البيانات
        downloadGeoJSONFile(data);
      } else {
        console.log("⚠️ لم يتم العثور على عناصر جديدة");
      }

      // تحديث قائمة المعرفات التي تم تنزيلها
      if (!downloadedIds.includes(lastObjectIdRef.current)) {
        updateState("downloadedIds", (prevIds: number[]) => [...prevIds, lastObjectIdRef.current]);
      }
      return data;
    } catch (error) {
      console.error("❌ حدث خطأ أثناء تحميل البيانات:", error);
      return null;
    }
  };

  // دالة حساب تأخير عشوائي (بالملي ثانية)
  const getRandomDelay = (min: number, max: number) => {
    const minMs = min * 1000;
    const maxMs = max * 1000;
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  };

  // دالة التنزيل التلقائي مع مؤقت العد التنازلي
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
      console.error("❌ حدث خطأ أثناء التنزيل التلقائي:", error);
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

  // دالة بدء العد التنازلي ثم إعادة محاولة التنزيل
  const startCountdownAndRetry = (delayMs: number) => {
    let secondsLeft = Math.floor(delayMs / 1000);
    updateState("waitingTime", secondsLeft);

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    countdownRef.current = setInterval(() => {
      if (!autoAdvance) {
        clearInterval(countdownRef.current!);
        updateState("waitingTime", 0);
        return;
      }
      secondsLeft--;
      updateState("waitingTime", secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(countdownRef.current!);
        autoDownload();
      }
    }, 1000);
  };

  // بدء التنزيل التلقائي عند تفعيل الخيار
  useEffect(() => {
    if (autoAdvance && waitingTime === 0) {
      autoDownload();
    }
  }, [autoAdvance]);

  // إعادة تعيين مؤقت العد التنازلي عند إيقاف التنزيل التلقائي
  useEffect(() => {
    if (!autoAdvance) {
      updateState("waitingTime", 0);
    }
  }, [autoAdvance]);

  // دالة تحميل ملف GeoJSON مع إضافة تنبيه عند أول تنزيل
  const downloadGeoJSONFile = (data: any) => {
    if (!data || !data.features || data.features.length === 0) {
      console.warn("⚠️ لا توجد بيانات متاحة لتنزيلها");
      return;
    }

    // عند أول تنزيل، يتم تنبيه المستخدم بأن الملف سيتم حفظه في المجلد الافتراضي للمتصفح
    if (firstDownload) {
      alert("تنبيه: سيتم حفظ الملف في مجلد التنزيلات الافتراضي للمتصفح.");
      setFirstDownload(false);
    }

    // تحويل البيانات إلى سلسلة JSON
    const jsonString = JSON.stringify(data, null, 2);
    // إنشاء Blob من السلسلة مع تحديد نوع الملف
    const blob = new Blob([jsonString], { type: "application/geo+json" });
    // إنشاء عنوان URL مؤقت للـ Blob
    const url = window.URL.createObjectURL(blob);
    // إنشاء عنصر رابط (anchor)
    const a = document.createElement("a");
    a.href = url;
    // تعيين اسم الملف (يمكنك تعديل الاسم حسب الحاجة)
    a.download = `${cityName}_${lastObjectIdRef.current}.geojson`;
    // إضافته إلى الصفحة (مطلوب لبعض المتصفحات)
    document.body.appendChild(a);
    // تفعيل النقر لتحميل الملف
    a.click();
    // إزالة العنصر بعد النقر وتنظيف الرابط المؤقت
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-gray-100 border shadow-lg w-full min-h-[140vh] h-full">
            <h2 className='text-[10px] text-dis ' dir='ltr'> Download JSON auto </h2>
        {/* الحقول الأساسية */}
        <div>
          <label className="block mb-1">code city</label>
          <input
            type="text"
            name="cityId"
            value={cityId}
            onChange={(e) => onChange(e)}
            placeholder="أدخل معرف المدينة"
            className="p-2 w-full border"
          />
        </div>

        <div>
          <label className="block mb-1">اسم المدينة</label>
          <input
            type="text"
            value={cityName}
            onChange={(e) => onChange(e)}
            name="cityName"
            placeholder="أدخل اسم المدينة"
            className="p-2 w-full border"
          />
        </div>

        <div>
          <label className="block mb-1">نوع الملف</label>
          <select
            value={fileType}
            onChange={(e) => onChange(e)}
            name="fileType"
            className="p-2 w-full border"
          >
            <option value="geoJSON">GeoJSON</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">رقم آخر عنصر</label>
          <input
            type="number"
            value={lastObjectId}
            onChange={(e) => onChange(e)}
            name="lastObjectId"
            placeholder="أدخل رقم آخر عنصر"
            className="p-2 w-full border"
          />
        </div>

        <div>
          <label className="block mb-1">رقم اول عنصر</label>
          <input
            type="number"
            value={startObjectId}
            onChange={(e) => onChange(e)}
            name="startObjectId"
            placeholder="أدخل رقم أول عنصر"
            className="p-2 w-full border"
          />
        </div>

        <div>
          <label className="block mb-1">عامل المقارنة</label>
          <select
            value={objectIdOperator}
            onChange={(e) => onChange(e)}
            name="objectIdOperator"
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
            onChange={(e) => onChange(e)}
            name="resultRecordCount"
            placeholder="أدخل عدد السجلات"
            className="p-2 w-full border"
          />
        </div>

        <div>
          <label className="block mb-1">الرابط الأساسي</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => onChange(e)}
            name="baseUrl"
            placeholder="الرابط يتم توليده تلقائياً"
            className="p-2 w-full border bg-gray-200"
            readOnly
          />
        </div>

        {/* إعدادات التنزيل التلقائي */}
        <div className="border p-2 block">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={useProxy}
              onChange={(e) => onChange(e)}
              name="useProxy"
              className="mr-2"
            />
            <span className="text-sm text-dis">إضافة بروكسي إلى الرابط</span>
          </div>

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => onChange(e)}
              name="autoAdvance"
              className="mr-2"
            />
            <span>تفعيل التنزيل التلقائي</span>
          </div>

          <div className="mt-2">
            <label className="block mb-1">الحد الأدنى للتأخير (ثواني)</label>
            <input
              type="number"
              value={minDelay}
              onChange={(e) => onChange(e)}
              name="minDelay"
              placeholder="أدخل الحد الأدنى للتأخير"
              className="p-2 w-full border"
            />
          </div>
          <div className="mt-2">
            <label className="block mb-1">الحد الأقصى للتأخير (ثواني)</label>
            <input
              type="number"
              value={maxDelay}
              onChange={(e) => onChange(e)}
              name="maxDelay"
              placeholder="أدخل الحد الأقصى للتأخير"
              className="p-2 w-full border"
            />
          </div>
          {autoAdvance && waitingTime > 0 && (
            <div className="mt-2 text-center text-sm text-blue-600">
              الانتظار: {waitingTime} ثانية...
            </div>
          )}
        </div>
    </div>
  );
}
