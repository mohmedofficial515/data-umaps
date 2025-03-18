import React, { useState } from "react";

const CountElementsByRegion = () => {
  // حالات حقول الإدخال والإعدادات
  const [regionIds, setRegionIds] = useState("");
  const [layer, setLayer] = useState("28");
  const [additionalWhere, setAdditionalWhere] = useState("");
  const [useProxy, setUseProxy] = useState(true);

  // حالات نتيجة الطلب
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // دالة لمعالجة الشروط الإضافية المدخلة.
  // يمكن إدخال عدة شروط مفصولة بفاصلة.
  // مثال: "OBJECTID >= 1000, AREA <> 50"
  const processAdditionalConditions = () => {
    if (additionalWhere.trim() === "") return "";
    const conditionsArray = additionalWhere
      .split(",")
      .map((cond) => cond.trim())
      .filter((cond) => cond !== "");
    return conditionsArray.join(" AND ");
  };

  // دالة لبناء جملة where باستخدام معرفات المنطقة والشروط الإضافية
  const buildWhereClause = () => {
    let clause = "1=1";

    // معالجة معرفات المنطقة
    if (regionIds.trim() !== "") {
      const idsArray = regionIds
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");
      if (idsArray.length > 1) {
        clause += ` AND REGION_ID IN ('${idsArray.join("','")}')`;
      } else if (idsArray.length === 1) {
        clause += ` AND REGION_ID = '${idsArray[0]}'`;
      }
    }

    // معالجة الشروط الإضافية
    const additionalConditions = processAdditionalConditions();
    if (additionalConditions !== "") {
      clause += ` AND ${additionalConditions}`;
    }
    return clause;
  };

  // دالة لجلب العدد من الـ API باستخدام جملة الاستعلام
  const fetchCount = async () => {
    setLoading(true);
    setError(null);
    try {
      const whereClause = encodeURIComponent(buildWhereClause());
      const queryUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer/${layer}/query?where=${whereClause}&returnCountOnly=true&f=json`;
      const url = useProxy
        ? `https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?${queryUrl}`
        : queryUrl;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`خطأ في جلب العدد: ${response.status}`);
      }
      const data = await response.json();
      if (data.count !== undefined) {
        setCount(data.count);
      }
    } catch (err:any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">حساب عدد العناصر حسب المنطقة</h2>

      <div className="mb-4">
        <label className="block mb-1">
          معرف/معرفات المنطقة (افصل بين المعرفات بفاصلة)
        </label>
        <input
          type="text"
          value={regionIds}
          onChange={(e) => setRegionIds(e.target.value)}
          placeholder="مثال: 001, 002, 003"
          className="p-2 border w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">طبقة البيانات (Layer)</label>
        <input
          type="text"
          value={layer}
          onChange={(e) => setLayer(e.target.value)}
          placeholder="أدخل رقم الطبقة"
          className="p-2 border w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">
          شروط إضافية (يمكن إدخال عدة شروط مفصولة بفاصلة)
        </label>
        <input
          type="text"
          value={additionalWhere}
          onChange={(e) => setAdditionalWhere(e.target.value)}
          placeholder='مثال: OBJECTID >= 1000, AREA <> 50'
          className="p-2 border w-full"
        />
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={useProxy}
          onChange={(e) => setUseProxy(e.target.checked)}
          className="mr-2"
        />
        <span>استخدام البروكسي</span>
      </div>

      <button
        onClick={fetchCount}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        حساب العدد
      </button>

      <div className="mt-4">
        {loading && <p>جاري التحميل...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {count !== null && !loading && !error && (
          <p>
            عدد العناصر: <strong>{count}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default CountElementsByRegion;
