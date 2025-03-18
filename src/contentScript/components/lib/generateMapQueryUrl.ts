export interface MapQueryUrlOptions {
    // الطبقة المطلوبة (مطلوب)
    selectLayer: string;
    // عدد السجلات المطلوب إرجاعها (افتراضي: 100)
    resultRecordCount?: number;
    // إزاحة النتائج (افتراضي: 0)
    resultOffset?: number;
    // شرط البحث (افتراضي: "1=1")
    whereClause?: string;
    // الحقول المطلوبة (افتراضي: "*" أي جميع الحقول)
    outFields?: string;
    // تنسيق الإرجاع (افتراضي: "geoJSON")
    f?: string;
    // استخدام البروكسي أم لا (افتراضي: false)
    useProxy?: boolean;
    // إذا كان الاستعلام لإرجاع العدد فقط
    returnCountOnly?: boolean;
    selectServer:"Umaps_Click" | "Umaps_Identify_Satatistics" | "UMaps_AdministrativeData" | "UMaps_AdditionalLayers";
    orderByFields?:string;
  }
  
  export const generateMapQueryUrl = (options: MapQueryUrlOptions): string => {
    // تعيين القيم الافتراضية
    const {
      selectLayer,
      resultRecordCount = 100,
      resultOffset = 0,
      whereClause = '1=1',
      outFields = '*',
      f = 'geoJSON',
      useProxy = false,
      returnCountOnly,
      selectServer,
      orderByFields= "OBJECTID ASC"
    } = options;
  
    // https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?
    // https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Identify_Satatistics/MapServer
    // /18/query?f=json&returnIdsOnly=true&returnCountOnly=true&objectIds=&orderByFields=&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1+AND+OBJECTID+%3E+0

    // عناوين الخدمة الافتراضية الخاصة بخدمة الخرائط
    // const baseUrl = selectServer === "Umaps_Identify_Satatistics" 
    //   ? "https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Identify_Satatistics/MapServer" 
    //   :selectServer === "Umaps_Click" ? 'https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/Umaps_Click/MapServer' 
    //   :selectServer === "UMaps_AdministrativeData" ? 'https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/UMaps_AdministrativeData/MapServer' 
    //   : "";

    const baseUrl = `https://umapsudp.momrah.gov.sa/server/rest/services/Umaps/${selectServer}/MapServer` 

    const proxyUrl = 'https://umaps.balady.gov.sa/newProxyUDP/proxy.ashx?';
  
    // تجميع معلمات الاستعلام باستخدام URLSearchParams لضمان التشفير الصحيح
    const queryParams = new URLSearchParams({
      outFields,
      resultOffset: resultOffset.toString(),
      resultRecordCount: resultRecordCount.toString(),
      orderByFields,
      f,
      where: whereClause,
    });
  
    // إضافة معامل returnCountOnly إذا تم تحديده
    if (typeof returnCountOnly !== 'undefined') {
      queryParams.append('returnCountOnly', returnCountOnly.toString());
    }
  
    // بناء الرابط الكامل باستخدام الطبقة المطلوبة ونوع الاستعلام الثابت "query"
    const queryUrl = `${baseUrl}/${selectLayer}/query?${queryParams.toString()}`;
  
    // إرجاع الرابط مع استخدام البروكسي إذا تم تفعيله
    return useProxy ? `${proxyUrl}${queryUrl}` : queryUrl;
  };
  