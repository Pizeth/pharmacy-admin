/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationErrorMessage } from "react-admin";
import { AsyncValidationErrorMessage, MessageFunc } from "../Types/types";

export class MsgUtils {
  // static setMsg(
  //   message: string | MsgObj | any,
  //   args?: object,
  // ): string | MsgObj | undefined {
  //   if (!message) return undefined;
  //   return {
  //     message: message?.message || message,
  //     args: args || message?.args || null,
  //   };
  // }

  static setMsg(
    message: string | AsyncValidationErrorMessage | any,
    args?: object,
    status?: boolean | number,
  ): string | AsyncValidationErrorMessage | undefined {
    return {
      message: message?.message || message,
      args: args || message?.args || null,
      status: status,
    };
  }

  static getMessage = (
    message: string | MessageFunc,
    messageArgs: any,
    value: any,
    values: any,
  ) =>
    typeof message === "function"
      ? message({
          args: messageArgs,
          value,
          values,
        })
      : messageArgs
        ? {
            message,
            args: messageArgs,
          }
        : message;

  static getMessage1(
    message: string | MessageFunc,
    args: object,
    value?: any,
    values?: any,
  ): ValidationErrorMessage | undefined {
    if (!message) return undefined;

    return typeof message === "function"
      ? message({ args, value, values })
      : { message, args };
  }
}

export default MsgUtils;

// import statusCode from "http-status-codes";
// const API_URL = import.meta.env.VITE_API_URL;

// export const useDebouncedValidator = (
//   source: string,
//   options?: UseFieldOptions,
// ) => {
//   const resource = useResourceContext(options);
//   const translateLabel = useTranslateLabel();
//   if (!resource) {
//     throw new Error("useAsync: missing resource prop or context");
//   }
//   const timeoutRef = useRef<NodeJS.Timeout>();
//   const cancelTokenRef = useRef<CancelTokenSource>();
//   const lastValueRef = useRef<string>("");

//   const validate = useCallback(
//     async (
//       value: string,
//       values: any,
//       props: IconTextInputProps,
//     ): Promise<ValidationErrorMessage | null | undefined> => {
//       if (isEmpty(value)) {
//         return Object.assign(
//           MsgUtils.getMessage(
//             "razeth.validation.required",
//             {
//               source: source,
//               value,
//               field: translateLabel({
//                 label: props.label,
//                 source: source,
//                 resource,
//               }),
//             },
//             value,
//             values,
//           ),
//           // Return undefined if the value is not empty
//           { isRequired: true },
//         );
//       }

//       // Clear previous
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       if (cancelTokenRef.current) cancelTokenRef.current.cancel();

//       return new Promise((resolve) => {
//         timeoutRef.current = setTimeout(async () => {
//           if (value === lastValueRef.current) return undefined;
//           lastValueRef.current = value;

//           try {
//             cancelTokenRef.current = axios.CancelToken.source();

//             const response = await axios.get(
//               `${API_URL}/validate/${source}/${value}`,
//               {
//                 cancelToken: cancelTokenRef.current.token,
//               },
//             );

//             const data = response.data;
//             const status = statusCode.getStatusCode(data.status);
//             // Proper success case handling
//             if (status === statusCode.OK) {
//               resolve(undefined); // ✅ Clear errors automatically
//             } else {
//               resolve({
//                 message: data.message,
//                 args: {
//                   source,
//                   value,
//                   field: translateLabel({
//                     label: props.label,
//                     source,
//                     resource,
//                   }),
//                 },
//               });
//             }
//           } catch (error) {
//             if (!axios.isCancel(error)) {
//               resolve(
//                 {
//                   message: "razeth.validation.async",
//                   args: {
//                     source,
//                     value,
//                     field: translateLabel({
//                       label: props.label,
//                       source,
//                       resource,
//                     }),
//                   },
//                 },
//               );
//             }
//           }
//         }, options?.debounce ?? DEFAULT_DEBOUNCE);
//       });
//     },
//     [options?.debounce, resource, source, translateLabel],
//   );

//   return validate;
// };

// import statusCode from "http-status-codes";
// const API_URL = import.meta.env.VITE_API_URL;
// export const useDebouncedValidator = (
//   options?: UseFieldOptions,
// ) => {
//   const resource = useResourceContext(options);
//   const translateLabel = useTranslateLabel();
//   if (!resource) {
//     throw new Error("useAsync: missing resource prop or context");
//   }
//   const timeoutRef = useRef<NodeJS.Timeout>();
//   const cancelTokenRef = useRef<CancelTokenSource>();
//   const lastValueRef = useRef<string>("");

//   const validate = useCallback(
//     (callTimeOptions?: UseFieldOptions) => {
//       const { message, debounce: interval } = merge<UseFieldOptions, any, any>(
//         {
//           debounce: DEFAULT_DEBOUNCE,
//           message: "razeth.validation.required",
//         },
//         options,
//         callTimeOptions,
//       );

//       return async (
//         value: any,
//         allValues: any,
//         props: IconTextInputProps,
//       ) => {
//         const { source, label } = props;
//         if (isEmpty(value)) {
//           return undefined;
//         }
//         if (timeoutRef.current) clearTimeout(timeoutRef.current);
//         if (cancelTokenRef.current) cancelTokenRef.current.cancel();
//         const result = await new Promise<
//           ValidationErrorMessage | null | undefined
//         >((resolve) => {
//           timeoutRef.current = setTimeout(async () => {
//             if (value === lastValueRef.current) return;
//             lastValueRef.current = value;

//             try {
//               cancelTokenRef.current = axios.CancelToken.source();

//               const response = await axios.get(
//                 `${API_URL}/validate/${source}/${value}`,
//                 {
//                   cancelToken: cancelTokenRef.current.token,
//                 },
//               );

//               const data = response.data;
//               const status = statusCode.getStatusCode(data.status);
//               // Proper success case handling
//               if (status === statusCode.OK) {
//                 console.log("jol and should clear error");
//                 resolve(undefined); // ✅ Clear errors automatically
//               } else {
//                 console.log("jol and should set error");
//                 resolve({
//                   message: data.message,
//                   args: {
//                     source,
//                     value,
//                     field: translateLabel({
//                       label: props.label,
//                       source,
//                       resource,
//                     }),
//                   },
//                 });
//               }
//             } catch (error) {
//               if (!axios.isCancel(error)) {
//                 resolve({
//                   message: "razeth.validation.async",
//                   args: {
//                     source,
//                     value,
//                     field: translateLabel({
//                       label: props.label,
//                       source,
//                       resource,
//                     }),
//                   },
//                 });
//               }
//             }
//           }, interval ?? DEFAULT_DEBOUNCE);
//         });

//         if (typeof result !== "undefined") {
//           console.log("here not undefined");
//           return result;
//         }
//         return undefined;
//       };
//     },
//     [options, resource, translateLabel],
//   );
//   return validate;
// };

// import { useCallback, useRef } from "react";
// import axios, { CancelTokenSource } from "axios";
// import statusCode from "http-status-codes";
// import { useResourceContext, useTranslateLabel } from "react-admin";

// const DEFAULT_DEBOUNCE = 2500;

// export const useDebouncedValidator = (options?: { debounce?: number }) => {
//   const resource = useResourceContext(options);
//   const translateLabel = useTranslateLabel();
//   const timeoutRef = useRef<NodeJS.Timeout>();
//   const cancelTokenRef = useRef<CancelTokenSource>();
//   const lastValueRef = useRef<string>("");

//   if (!resource) {
//     throw new Error("useDebouncedValidator: missing resource context");
//   }

//   const validate = useCallback(
//     async (value: string, props: any): Promise<string | undefined> => {
//       // Clear previous validation
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       if (cancelTokenRef.current) cancelTokenRef.current.cancel();

//       // Generate new validation ID
//       const validationId = ++currentValidationId.current;

//       return new Promise((resolve) => {
//         timeoutRef.current = setTimeout(async () => {
//           // Only process if still the latest validation
//           if (validationId !== currentValidationId.current) return;

//           try {
//             cancelTokenRef.current = axios.CancelToken.source();
//             const response = await axios.get(
//               `${API_URL}/validate/${props.source}/${value}`,
//               { cancelToken: cancelTokenRef.current.token },
//             );

//             const data = response.data;
//             const status = statusCode.getStatusCode(data.status);

//             if (status === statusCode.OK) {
//               resolve(undefined); // Clear errors
//             } else {
//               resolve(data.message || "validation.error.default");
//             }
//           } catch (error) {
//             if (!axios.isCancel(error)) {
//               resolve("validation.error.network");
//             }
//           }
//         }, options?.debounce ?? DEFAULT_DEBOUNCE);
//       });
//     },
//     [options?.debounce, resource],
//   );

//   return validate;
// };
