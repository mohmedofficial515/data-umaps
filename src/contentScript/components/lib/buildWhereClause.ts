
export const buildWhereClause = (regionIds:string, cityIds:string, objectId:number, operator:string , additionalWhere:any) => {
  let clause = "1=1";

  // معالجة معرفات المنطقة
  if (regionIds.trim() !== "") {
    const regionArray = regionIds
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    if (regionArray.length > 1) {
      clause += ` AND REGION_ID IN ('${regionArray.join("','")}')`;
    } else if (regionArray.length === 1) {
      clause += ` AND REGION_ID = '${regionArray[0]}'`;
    }
  }

  // معالجة معرفات المدينة
  if (cityIds.trim() !== "") {
    const cityArray = cityIds
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    if (cityArray.length > 1) {
      clause += ` AND CITY_ID IN ('${cityArray.join("','")}')`;
    } else if (cityArray.length === 1) {
      clause += ` AND CITY_ID = '${cityArray[0]}'`;
    }
  }

  // معالجة ObjectId مع عامل المقارنة
  if (operator.trim() !== "") {
    clause += ` AND OBJECTID ${operator} ${objectId}`;
  }

  // معالجة الشروط الإضافية
  const additionalConditions = processAdditionalConditions(additionalWhere);
  if (additionalConditions !== "") {
    clause += ` AND ${additionalConditions}`;
  }

  console.log("scss Add where: " + clause)
  return clause;
};



  // دالة لمعالجة الشروط الإضافية المدخلة.
  // يمكن إدخال عدة شروط مفصولة بفاصلة.
  // مثال: "OBJECTID >= 1000, CITY_ID <> 05500"
  const processAdditionalConditions = (additionalWhere:any) => {
    if (additionalWhere.trim() === "") return "";
    const conditionsArray = additionalWhere
      .split(",")
      .map((cond:any) => cond.trim())
      .filter((cond:any) => cond !== "");
    return conditionsArray.join(" AND ");
  };