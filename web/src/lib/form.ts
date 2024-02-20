/*
 * @Author: Quarter
 * @Date: 2024-02-20 15:09:42
 * @LastEditors: Quarter
 * @LastEditTime: 2024-02-20 15:09:44
 * @FilePath: /anylink/web/src/lib/form.ts
 * @Description: 表单相关
 */

/**
 * @description: 解析成 FormData
 * @param {object} data 数据
 * @return {FormData}
 */
export const toFormData = (data: object): FormData => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = Reflect.get(data, key);
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (Object.prototype.toString.call(item) === "[object Object]") {
            formData.append(`${key}[]`, JSON.stringify(item));
          } else {
            formData.append(`${key}[]`, item);
          }
        });
      } else if (Object.prototype.toString.call(value) === "[object Object]") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });
  return formData;
};

/**
 * @description: 解析成 Object
 * @param {FormData} data 数据
 * @return {object}
 */
export const toObject = (data: FormData): object => {
  const obj = {};
  data.forEach((value, key) => {
    Reflect.set(obj, key, value);
  });
  return obj;
};
