// update: async <T extends RaRecord>(
//   resource: string,
//   params: UpdateParams<T>,
// ) => {
//   const hasFile = Object.values(params.data).some(
//     (value) => value instanceof File || (value && typeof value === 'object' && 'rawFile' in value)
//   );

//   let body: any;
//   let headers: any = {};

//   if (hasFile) {
//     body = createPostFormData(params);
//   } else {
//     body = JSON.stringify(params.data);
//     headers['Content-Type'] = 'application/json';
//   }

//   const response = await fetchUtils.fetchJson(`${API_URL}/${resource}`, {
//     method: "PUT",
//     body,
//     headers,
//   });

//   return {
//     data: response.json.data,
//   };
// },

// // const appendFormData = (
// //   formData: FormData,
// //   key: string,
// //   value: any,
// // ): FormData => serialize(value, {}, formData, key);

// // export default appendFormData;

// const hasFileField = (data: any): boolean => {
//   return Object.values(data).some(value =>
//     value instanceof File ||
//     (value && typeof value === 'object' && ('rawFile' in value || 'file' in value))
//   );
// };

// update: async <T extends RaRecord>(
//   resource: string,
//   params: UpdateParams<T>,
// ) => {
//   const config: RequestInit = {
//     method: 'PUT',
//   };

//   if (hasFileField(params.data)) {
//     config.body = createPostFormData(params);
//   } else {
//     config.body = JSON.stringify(params.data);
//     config.headers = {
//       'Content-Type': 'application/json',
//     };
//   }

//   const response = await fetchUtils.fetchJson(
//     `${API_URL}/${resource}`,
//     config
//   );

//   if (!response.ok) {
//     throw new Error(`Error updating ${resource}`);
//   }

//   return {
//     data: response.json.data,
//   };
// },
