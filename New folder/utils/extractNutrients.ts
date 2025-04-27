export function extractNutrients( rawData:| Record<string, number>| string| { name: string; value: any }): { name: string; value: number }[] {
  // Parse JSON if needed
  let data: any = rawData;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      console.warn("extractNutrients: failed to parse JSON string");
      return [];
    }}
  if (Array.isArray(data)) {
    return data.map(({ name, value }) => {
      const val =
        value != null && typeof value === "object" && "value" in value ? (value as { value: number }).value : (value as number);
      return { name, value: val };
    });}
  if (data && typeof data === "object") {
    return Object.entries(data).map(([name, val]) => ({
      name,
      value: val as number,
    }));
  }
  return [];
}
