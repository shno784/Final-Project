const cleanNulls = <T extends Record<string, any>>(obj: T): T => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, value ?? null])
    ) as T;
  };

export default cleanNulls;