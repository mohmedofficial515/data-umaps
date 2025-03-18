import { generateMapQueryUrl } from "./generateMapQueryUrl";

export const fetchTotalCount = async (
    setTotalCount: any,
    layer: string,
    useProxy: boolean,
    selectServer: "Umaps_Click" | "Umaps_Identify_Satatistics" | "UMaps_AdministrativeData"|"UMaps_AdditionalLayers",
    WhereClause?: string,
  
  ) => {
    try {  
      // استخدام الدالة generateMapQueryUrl لتجميع الرابط النهائي لاستعلام العدد فقط
      const queryUrl = generateMapQueryUrl({
        selectLayer: layer,
        selectServer:selectServer,
        whereClause: WhereClause,
        f: 'json',
        useProxy: useProxy,
        returnCountOnly: true,
      });
  
      const response = await fetch(queryUrl);
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
  