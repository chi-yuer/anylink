/*
 * @Author: Quarter
 * @Date: 2024-01-29 16:43:28
 * @LastEditors: Quarter
 * @LastEditTime: 2024-01-29 16:43:29
 * @FilePath: /anylink/web/src/lib/object.ts
 * @Description: 对象相关
 */

/**
 * @description: 对象深拷贝
 * @param {T} obj 对象
 * @return {T}
 */
export const copy = <T>(obj: T): T => {
  // 判断是否为对象
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (obj === null) {
    return null as unknown as typeof obj;
  } else if (Array.isArray(obj)) {
    // 实现array数据的深拷贝
    return [...obj].map((item) => copy(item)) as unknown as typeof obj;
  } else if (obj instanceof Set) {
    // 实现set数据的深拷贝
    return new Set([...obj]) as unknown as typeof obj;
  } else if (obj instanceof Map) {
    // 实现map数据的深拷贝
    return new Map([...obj]) as unknown as typeof obj;
  }
  const result = {} as unknown as typeof obj;
  Object.keys(obj).forEach((key) => {
    const value = Reflect.get(obj, key);
    Reflect.set(result, key, copy(value));
  });
  return result;
};
