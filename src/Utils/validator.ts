/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
// import axios from "axios";
// import statusCode from "http-status-codes";

// type FieldError = {
//   error?: boolean;
//   message?: string;
// };

// const API_URL = import.meta.env.VITE_API_URL;

// export const ServerValidator = (
//   value: string | undefined,
//   resource: string,
// ): FieldError | null => {
//   const [error, setMsg] = useState<FieldError | null>(null);
//   useEffect(() => {
//     const validateUsername = async () => {
//       if (!value) return;
//       try {
//         const response = await axios.get<any>(
//           `${API_URL}/${resource}/${value}`,
//         );
//         const data = response.data;
//         if (data) {
//           const res: FieldError = {
//             error:
//               statusCode.getStatusCode(data.status) === statusCode.OK
//                 ? false
//                 : true,
//             message: data.message || null,
//           };
//           setMsg(res || null);
//         } else {
//           setMsg(null);
//         }
//       } catch (error) {
//         console.error(error);
//         setMsg({
//           error: true,
//           message: "An error occurred while validating the field!",
//         });
//       }
//     };

//     validateUsername();
//   }, [value, resource]);

//   return error;
// };

// export default ServerValidator;

// import { useEffect, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import statusCode from "http-status-codes";
import StringUtils from "./StringUtils";
import zxcvbn from "./lazyZxcvbn";
import {
  asyncDebounce,
  InputProps,
  isEmpty,
  useDataProvider,
  useResourceContext,
  useTranslate,
  useTranslateLabel,
  ValidationErrorMessage,
  Validator,
} from "react-admin";
import {
  AsyncValidationErrorMessage,
  DEFAULT_DEBOUNCE,
  FieldError,
  IconTextInputProps,
  Memoize,
  UseFieldOptions,
  ValidationResult,
  ValidationResult1,
} from "../Types/types";

import lodashMemoize from "lodash/memoize";
import MsgUtils from "./MsgUtils";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { merge, set } from "lodash";
import { resolve } from "path";
// import { AxiosRequestConfig } from "axios";
// import type { AxiosRequestConfig } from '@types/axios';

// If we define validation functions directly in JSX, it will
// result in a new function at every render, and then trigger infinite re-render.
// Hence, we memoize every built-in validator to prevent a "Maximum call stack" error.
const memoize: Memoize = (fn: any) =>
  lodashMemoize(fn, (...args) => JSON.stringify(args));

const API_URL = import.meta.env.VITE_API_URL;

const zxcvbnAsync = await zxcvbn.loadZxcvbn();

//  const {
//     field,
//     fieldState: { error, invalid },
//     id,
//     isRequired,
//   } = useInput({
//     defaultValue,
//     format,
//     parse,
//     resource,
//     source,
//     type: "text",
//     validate: [
//       async (value, values, props) => {
//         return validator(value, props);
//       },
//     ],
//     onBlur,
//     onChange,
//     ...rest,
//   });

export const useAsyncValidator = (
  // source: string,
  options?: UseFieldOptions,
) => {
  const resource = useResourceContext(options);
  const translateLabel = useTranslateLabel();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const cancelTokenRef = useRef<CancelTokenSource>();
  const [successMessage, setSuccessMessage] = useState("");
  // const lastValueRef = useRef<string>("");
  const currentValidationId = useRef(0);

  if (!resource) {
    throw new Error("useAsync: missing resource prop or context");
  }

  const validate = useCallback(
    (callTimeOptions?: UseFieldOptions) => {
      const { message, debounce: interval } = merge<UseFieldOptions, any, any>(
        {
          debounce: DEFAULT_DEBOUNCE,
          message: "razeth.validation.required",
        },
        options,
        callTimeOptions,
      );

      return async (
        value: any,
        props: IconTextInputProps,
        allValues?: any,
        // ): Promise<ValidationErrorMessage | null | undefined> => {
      ) => {
        const { source, label } = props;
        // console.log("le porprr", props);
        if (isEmpty(value)) {
          return Object.assign(
            MsgUtils.getMessage(
              message,
              {
                source: source,
                value,
                field: translateLabel({
                  label: label,
                  source: source,
                  resource,
                }),
              },
              value,
              allValues,
            ),
            // Return undefined if the value is not empty
            { isRequired: true },
            { status: statusCode.ACCEPTED },
          );
          // return undefined;
        }
        // Clear previous validation
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (cancelTokenRef.current) cancelTokenRef.current.cancel();

        // Reset success message immediately
        setSuccessMessage("");

        // Generate new validation ID
        const validationId = ++currentValidationId.current;

        return new Promise<AsyncValidationErrorMessage | undefined>(
          (resolve) => {
            timeoutRef.current = setTimeout(async () => {
              // Only process if still the latest validation
              if (validationId !== currentValidationId.current) {
                resolve(undefined);
                return;
              }
              // if (value === lastValueRef.current) return;
              // lastValueRef.current = value;

              try {
                cancelTokenRef.current = axios.CancelToken.source();
                const response = await axios.get(
                  `${API_URL}/validate/${source}/${value}`,
                  {
                    cancelToken: cancelTokenRef.current.token,
                  },
                );

                const data = response.data;
                const status = statusCode.getStatusCode(data.status);
                // Proper success case handling
                if (status === statusCode.OK) {
                  setSuccessMessage(data.message);
                  resolve(undefined); // ✅ Clear errors automatically
                } else {
                  //   const validationError: ValidationErrorMessage = {
                  //     message: data.message,
                  //     args: {
                  //       source,
                  //       value,
                  //       field: translateLabel({
                  //         label: props.label,
                  //         source,
                  //         resource,
                  //       }),
                  //     },
                  //   };
                  // }
                  setSuccessMessage("");
                  resolve({
                    message: data.message,
                    status: status,
                    args: {
                      source,
                      value,
                      field: translateLabel({
                        label: props.label,
                        source,
                        resource,
                      }),
                    },
                  });
                }
              } catch (error) {
                if (!axios.isCancel(error)) {
                  // resolve((value: any, values: any) => ({
                  setSuccessMessage("");
                  resolve({
                    message: "razeth.validation.async",
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    args: {
                      source,
                      value,
                      field: translateLabel({
                        label: props.label,
                        source,
                        resource,
                      }),
                    },
                  });
                  // );
                }
              }
            }, interval ?? DEFAULT_DEBOUNCE);
          },
        );
      };
    },
    [options, resource, translateLabel],
  );

  // async (
  //   value: string,
  //   values: any,
  //   props: IconTextInputProps,
  // ): Promise<ValidationErrorMessage | null | undefined> => {
  //   const { source, label } = props;
  //   // ): Promise<Validator | undefined> => {
  //   if (isEmpty(value)) {
  //     return Object.assign(
  //       // (value: any, values: any) =>
  //       MsgUtils.getMessage(
  //         "razeth.validation.required",
  //         {
  //           source: source,
  //           value,
  //           field: translateLabel({
  //             label: label,
  //             source: source,
  //             resource,
  //           }),
  //         },
  //         value,
  //         values,
  //       ),
  //       // Return undefined if the value is not empty
  //       { isRequired: true },
  //     );
  //   }

  //   // Handle empty value
  //   // if (isEmpty(value)) {
  //   //   return MsgUtils.getMessage1("razeth.validation.required", {
  //   //     source,
  //   //     value,
  //   //     field: translateLabel({
  //   //       label: props.label,
  //   //       source,
  //   //       resource,
  //   //     }),
  //   //   });
  //   // }

  //   // Clear previous
  //   if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //   if (cancelTokenRef.current) cancelTokenRef.current.cancel();

  //   return new Promise((resolve) => {
  //     timeoutRef.current = setTimeout(async () => {
  //       if (value === lastValueRef.current) return undefined;
  //       lastValueRef.current = value;

  //       try {
  //         cancelTokenRef.current = axios.CancelToken.source();

  //         const response = await axios.get(
  //           `${API_URL}/validate/${source}/${value}`,
  //           {
  //             cancelToken: cancelTokenRef.current.token,
  //           },
  //         );

  //         const data = response.data;
  //         const status = statusCode.getStatusCode(data.status);
  //         // Proper success case handling
  //         if (status === statusCode.OK) {
  //           console.log("jol and should clear error");
  //           resolve(undefined); // ✅ Clear errors automatically
  //         } else {
  //           // resolve((value: any, values: any) => ({
  //           resolve({
  //             message: data.message,
  //             args: {
  //               source,
  //               value,
  //               field: translateLabel({
  //                 label: props.label,
  //                 source,
  //                 resource,
  //               }),
  //             },
  //           });
  //           // );
  //         }
  //       } catch (error) {
  //         if (!axios.isCancel(error)) {
  //           // resolve((value: any, values: any) => ({
  //           resolve({
  //             message: "razeth.validation.async",
  //             args: {
  //               source,
  //               value,
  //               field: translateLabel({
  //                 label: props.label,
  //                 source,
  //                 resource,
  //               }),
  //             },
  //           });
  //           // );
  //         }
  //       }
  //     }, options?.debounce ?? DEFAULT_DEBOUNCE);
  //   });
  // },
  // [options, resource, translateLabel],
  // );
  // console.log(validate);
  return { validate, successMessage };
  // return (
  //   value: string,
  //   values: any,
  //   props: IconTextInputProps,
  // ): Promise<ValidationErrorMessage | null | undefined> => {
  //   return validate(value, values, props) as Promise<
  //     ValidationErrorMessage | null | undefined
  //   >;
  // };
};

// export const useAsyncValidator = (
//   source: string,
//   // translateLabel: (options: {
//   //   label?: string;
//   //   source: string;
//   //   resource?: string;
//   // }) => string,
//   // resource?: string,
//   // delay: number = 2500,
//   options?: UseFieldOptions,
// ): Validator => {
//   const resource = useResourceContext(options);
//   const translateLabel = useTranslateLabel();
//   if (!resource) {
//     throw new Error("useAsync: missing resource prop or context");
//   }
//   const translate = useTranslate();
//   // Store these in closure to maintain state between validations
//   let timeoutId: NodeJS.Timeout | null = null;
//   let abortController: AbortController | null = null;
//   let lastValue = "";

//   return (value: any, values: any, props: InputProps) => {
//     // Clear previous timeout and abort controller
//     if (timeoutId) clearTimeout(timeoutId);
//     if (abortController) abortController.abort();

//     // Store current value to compare later
//     const currentValue = value;

//     // if (isEmpty(currentValue)) {
//     //   return Object.assign(
//     //     MsgUtils.getMessage(
//     //       "razeth.validation.required",
//     //       {
//     //         source: source,
//     //         value,
//     //         field: translateLabel({
//     //           label: props.label,
//     //           source: source,
//     //           resource,
//     //         }),
//     //       },
//     //       value,
//     //       values,
//     //     ),
//     //     // Return undefined if the value is not empty
//     //     { isRequired: true },
//     //   );
//     // }

//     return new Promise((resolve) => {
//       timeoutId = setTimeout(async () => {
//         // Only proceed if value hasn't changed during wait
//         if (currentValue !== lastValue) {
//           lastValue = currentValue;
//           console.log(await lastValue);

//           try {
//             abortController = new AbortController();

//             const response = await axios.get(
//               `${API_URL}/validate/${source}/${currentValue}`,
//               { signal: abortController.signal },
//             );

//             const data = response.data;
//             if (data.status !== statusCode.OK) {
//               resolve({
//                 message: data.message,
//                 args: {
//                   source,
//                   value: currentValue,
//                   field: translateLabel({
//                     label: props.label,
//                     source,
//                     resource,
//                   }),
//                 },
//               });
//             } else {
//               resolve(undefined);
//             }
//           } catch (error) {
//             if (!axios.isCancel(error)) {
//               resolve({ message: "ra.notification.http_error", args: {} });
//             }
//           }
//         }
//         // }, options?.debounce ?? DEFAULT_DEBOUNCE);
//       }, 2500);
//     });
//   };
// };

export const useAsyncValidator6 = (
  source: string,
  options?: UseFieldOptions,
): Validator => {
  const resource = useResourceContext(options);
  const translateLabel = useTranslateLabel();
  if (!resource) {
    throw new Error("useAsync: missing resource prop or context");
  }
  const translate = useTranslate();
  let timeoutId: NodeJS.Timeout | null = null;
  let abortController: AbortController | null = null;

  return async (value: any, values: any, props: IconTextInputProps) => {
    // Clear previous timeout and request
    if (timeoutId) clearTimeout(timeoutId);
    if (abortController) abortController.abort();

    if (isEmpty(value)) {
      //   return {
      //     message: "razeth.validation.required",
      //     args: {
      //       source,
      //       value,
      //       field: translateLabel({
      //         label: props.label,
      //         source,
      //         resource,
      //       }),
      //     },
      //   };

      return Object.assign(
        MsgUtils.getMessage(
          "razeth.validation.required",
          {
            source: source,
            value,
            field: translateLabel({
              label: props.label,
              source: source,
              resource,
            }),
          },
          value,
          values,
        ),
        // Return undefined if the value is not empty
        { isRequired: true },
      );
    }

    return new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        try {
          abortController = new AbortController();

          const response = await axios.get(
            `${API_URL}/validate/${source}/${value}`,
            { signal: abortController.signal },
          );

          const data = response.data;
          if (data.status !== "OK") {
            resolve({
              message: data.message,
              args: {
                source,
                value,
                field: translateLabel({
                  label: props.label,
                  source,
                  resource,
                }),
              },
            });
          } else {
            resolve(undefined); // Validation passed
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            resolve({ message: "ra.notification.http_error", args: {} });
          }
        }
      }, options?.debounce ?? DEFAULT_DEBOUNCE);
      // }, 2500);
    });
  };
};

export const useAsyncValidatorz = (
  source: string,
  // translateLabel: unknown, resource: string | undefined, p0: number,
  options?: UseFieldOptions, // translateLabel: (options: {
  //   label?: string | ReactElement | false;
  //   source: string;
  //   resource?: string;
  // }) => string,
  // resource?: string,
  // debounce: number = DEFAULT_DEBOUNCE,
) => {
  const resource = useResourceContext(options);
  const translateLabel = useTranslateLabel();
  if (!resource) {
    throw new Error("useAsync: missing resource prop or context");
  }
  const translate = useTranslate();
  let timeoutId: NodeJS.Timeout | null = null;
  let abortController: AbortController | null = null;

  return async (
    value: any,
    // source: string,
    allValues: any,
    props: IconTextInputProps,
  ): Promise<ValidationResult> => {
    // Clear previous timeout and request
    if (timeoutId) clearTimeout(timeoutId);
    if (abortController) abortController.abort();

    if (isEmpty(value)) {
      // return {
      //   message: "razeth.validation.required",
      //   args: {
      //     source,
      //     value,
      //     field: translateLabel({
      //       label: props.label,
      //       source,
      //       resource,
      //     }),
      //   },
      //   isRequired: true,
      // };
      return Object.assign(
        MsgUtils.getMessage(
          "razeth.validation.required",
          {
            source: props.source,
            value,
            field: translateLabel({
              label: props.label,
              source: props.source,
              resource,
            }),
          },
          value,
          allValues,
        ),
        // Return undefined if the value is not empty
        { isRequired: true },
      );
    }

    return new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        try {
          abortController = new AbortController();

          const response = await axios.get(
            `${API_URL}/validate/${source}/${value}`,
            { signal: abortController.signal },
          );

          const data = response.data;
          if (data.status !== "OK") {
            resolve({
              message: data.message,
              args: {
                source,
                value,
                field: translateLabel({
                  label: props.label,
                  source,
                  resource,
                }),
              },
            });
          } else {
            resolve(undefined);
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            resolve({ message: "ra.notification.http_error", args: {} });
          }
        }
      }, options?.debounce ?? DEFAULT_DEBOUNCE);
    });
  };
};

export const createAsyncValidator1 = (source: string) => {
  let cancelTokenSource: CancelTokenSource | null = null;
  let currentValue = "";

  // Create debounced validation function
  const debouncedValidate = asyncDebounce(
    async (value: string, callback: (result: ValidationResult1) => void) => {
      try {
        // Cancel previous request
        if (cancelTokenSource) {
          cancelTokenSource.cancel("Operation canceled by new request");
        }

        // console.log(value);

        cancelTokenSource = axios.CancelToken.source();

        const response = await axios.get(
          `${API_URL}/validate/${source}/${value}`,
          {
            cancelToken: cancelTokenSource.token,
          },
        );

        console.log(response);

        if (response.status === 200) {
          callback({ status: "success", message: `${value} is available!` });
        } else {
          callback({ status: "error", message: response.data.message });
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          callback({ status: "error", message: "Validation error" });
        }
      }
    },
    DEFAULT_DEBOUNCE,
  );

  return {
    validate: (value: string): Promise<ValidationResult1> => {
      currentValue = value;

      return new Promise((resolve) => {
        if (!value) {
          return resolve({ status: "pending" });
        }

        debouncedValidate(value, (result) => {
          // Only resolve if the value hasn't changed during validation
          if (value === currentValue) {
            resolve(result);
          }
        });
      });
    },
    cancel: () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel("Validation canceled");
      }
    },
  };
};

export const useAsyncValidator5 = (options?: UseFieldOptions) => {
  const resource = useResourceContext(options);
  const translateLabel = useTranslateLabel();
  if (!resource) {
    throw new Error("useAsync: missing resource prop or context");
  }
  const translate = useTranslate();
  // let abortController: AbortController | null = null;

  const validateAsync = useCallback(
    (callTimeOptions?: UseFieldOptions) => {
      const { timeOut, abortController } = merge<UseFieldOptions, any, any>(
        {
          message: "razeth.validation.unique",
          debounce: DEFAULT_DEBOUNCE,
        },
        options,
        callTimeOptions,
      );
      return async (
        value: string,
        source: string,
        props: IconTextInputProps,
      ) => {
        // if (!value) return undefined;
        if (isEmpty(value))
          return {
            status: statusCode.ACCEPTED,
            message: "razeth.validation.required",
            args: {
              source: source,
              value,
              field: translateLabel({
                label: props.label,
                source: source,
                resource,
              }),
            },
            isRequired: true,
          };

        // Clear previous timeout
        if (timeOut.current) {
          clearTimeout(timeOut.current);
        }

        // Cancel previous request
        if (abortController.current) {
          abortController.current.abort();
        }

        // return new Promise((resolve) => {
        timeOut.current = setTimeout(async () => {
          console.log("jol");
          abortController.current = new AbortController();
          try {
            const response = await axios.get(
              `${API_URL}/validate/${source}/${value}`,
              {
                signal: abortController.current.signal,
              },
            );

            const data = response.data;
            console.log(data);
            const status = statusCode.getStatusCode(data.status);
            if (status === statusCode.OK) {
              // return { status: "success", message: `${value} is available!` };
              return {
                status: status,
                message: data.message,
                args: {
                  source: source,
                  value,
                  field: translateLabel({
                    label: props.label,
                    source: source,
                    resource,
                  }),
                },
              };
            }

            // return {
            //   status: "error",
            //   message: response.data.message || "Validation failed",
            // };
            return {
              status: status,
              message: data.message,
              args: {
                source: source,
                value,
                field: translateLabel({
                  label: props.label,
                  source: source,
                  resource,
                }),
              },
            };
          } catch (error) {
            // if (!axios.isCancel(error)) {
            //   return { status: "error", message: "Validation error" };
            // }
            if (!axios.isCancel(error)) {
              return { message: "ra.notification.http_error", args: {} };
            }
            // return undefined;
          }
        });
        // });
      };
    },
    [options, resource, translateLabel],
  );
  return validateAsync;
};

export const useAsyncValidator3 = (options?: UseFieldOptions) => {
  const resource = useResourceContext(options);
  const translateLabel = useTranslateLabel();
  if (!resource) {
    throw new Error("useAsync: missing resource prop or context");
  }
  const translate = useTranslate();
  const abortController = useRef<AbortController | null>(null);
  const debouncedResult = useRef<ReturnType<typeof asyncDebounce>>();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  const validateAsync = useCallback(
    (callTimeOptions?: UseFieldOptions) => {
      const { message, debounce: interval } = merge<UseFieldOptions, any, any>(
        {
          message: "razeth.validation.unique",
          debounce: DEFAULT_DEBOUNCE,
        },
        options,
        callTimeOptions,
      );

      // Initialize debounced validator
      debouncedResult.current = asyncDebounce(
        async (value: string, source: string) => {
          try {
            if (abortController.current) {
              abortController.current.abort();
            }
            abortController.current = new AbortController();

            const response = await axios.get(
              `${API_URL}/validate/${source}/${value}`,
              {
                signal: abortController.current.signal,
              },
            );
            return response;
          } catch (error) {
            if (!axios.isCancel(error)) {
              throw error;
            }
          }
        },
        interval,
      );

      return async (value: any, allValues: any, props: InputProps) => {
        const source = props.source;
        if (isEmpty(value)) {
          return {
            message: "razeth.validation.required",
            args: {
              source: source,
              value,
              field: translateLabel({
                label: props.label,
                source: source,
                resource,
              }),
            },
            isRequired: true,
          };
        }

        try {
          const response = await debouncedResult.current?.(value, source);
          if (!response) return undefined;

          const data = response.data;
          const status = statusCode.getStatusCode(data.status);

          if (status !== statusCode.OK) {
            return {
              message: data.message || message,
              args: {
                source: source,
                value,
                field: translateLabel({
                  label: props.label,
                  source: source,
                  resource,
                }),
              },
            };
          }
        } catch (error) {
          console.error(error);
          return translate("ra.notification.http_error");
        }

        return undefined;
      };
    },
    [options, resource, translate, translateLabel],
  );

  return validateAsync;
};

export const useAsyncValidator2 = (options?: UseFieldOptions) => {
  const resource = useResourceContext(options);
  const translateLabel = useTranslateLabel();
  if (!resource) {
    throw new Error("useAsync: missing resource prop or context");
  }
  const translate = useTranslate();
  const abortController = useRef<AbortController | null>(null);

  // Stable debounced validate function
  const debouncedValidate = useRef(
    asyncDebounce(
      async (
        value: string,
        source: string,
        resolve: (
          result: string | { message: string; args: object } | undefined,
        ) => void,
      ) => {
        try {
          // Cancel previous request
          if (abortController.current) {
            abortController.current.abort();
          }

          abortController.current = new AbortController();

          const response = await axios.get(
            `${API_URL}/validate/${source}/${value}`,
            {
              signal: abortController.current.signal,
            },
          );

          if (response.data.status !== 200) {
            resolve({
              message: "razeth.validation.error",
              args: { details: response.data.message },
            });
          } else {
            resolve(undefined);
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            resolve(translate("ra.notification.http_error"));
          }
        }
      },
      options?.debounce ?? DEFAULT_DEBOUNCE,
    ),
  );

  // Cleanup
  useEffect(
    () => () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    },
    [],
  );

  return useCallback(
    (
      value: string,
      allValues: any,
      props: InputProps,
    ): Promise<string | { message: string; args: object } | undefined> => {
      return new Promise((resolve) => {
        if (!value) {
          return resolve({
            message: "razeth.validation.required",
            args: { field: props.source },
          });
        }

        debouncedValidate.current(value, props.source, resolve);
      });
    },
    [],
  );
};

export const useAsyncValidator1 = (options?: UseFieldOptions) => {
  const resource = useResourceContext(options);
  const translateLabel = useTranslateLabel();
  if (!resource) {
    throw new Error("useAsync: missing resource prop or context");
  }
  const translate = useTranslate();
  const abortController = useRef<AbortController | null>(null);

  // Create stable debounced validate function
  const debouncedValidate = useRef(
    asyncDebounce(
      async (
        value: string,
        source: string,
        onValidate: (result: any) => void,
      ) => {
        try {
          // Cancel previous request if it exists
          if (abortController.current) {
            abortController.current.abort("New request initiated");
          }

          // Create new AbortController for the current request
          abortController.current = new AbortController();

          const response = await axios.get(
            `${API_URL}/validate/${source}/${value}`,
            {
              signal: abortController.current.signal, // Pass the AbortController signal
            },
          );

          onValidate(response.data);
        } catch (error) {
          if (!axios.isCancel(error)) {
            onValidate({
              error: true,
              message: translate("ra.notification.http_error"),
            });
          }
        }
      },
      options?.debounce ?? DEFAULT_DEBOUNCE,
    ),
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort("Component unmounted");
      }
    };
  }, []);

  return useCallback(
    (value: string, allValues: any, props: InputProps) => {
      return new Promise((resolve) => {
        // if (!value) {
        //   return resolve(translate("ra.validation.required"));
        // }
        const source = props.source;
        if (isEmpty(value)) {
          return {
            message: "razeth.validation.required",
            args: {
              source: source,
              value,
              field: translateLabel({
                label: props.label,
                source: source,
                resource,
              }),
            },
            isRequired: true,
          };
        }

        debouncedValidate.current(value, props.source, (result) => {
          if (result.error) {
            resolve(result.message);
          } else if (result.status !== 200) {
            resolve(result.message || translate("ra.validation.error"));
          } else {
            resolve(undefined); // Validation passed
          }
        });
      });
    },
    [resource, translate, translateLabel],
  );
};

const asyncValidate = async (value: string, source: string) => {
  const response = await axios.get<any>(
    `${API_URL}/validate/${source}/${value}`,
  );
  return response;
};

export const useAsync = (options?: UseFieldOptions) => {
  const resource = useResourceContext(options);
  const translateLabel = useTranslateLabel();
  if (!resource) {
    throw new Error("useAsync: missing resource prop or context");
  }
  const translate = useTranslate();

  const debouncedResult = useRef(
    // The initial value is here to set the correct type on useRef
    asyncDebounce(asyncValidate, options?.debounce ?? DEFAULT_DEBOUNCE),
  );

  const validateAsync = useCallback(
    (callTimeOptions?: UseFieldOptions) => {
      const { message, debounce: interval } = merge<UseFieldOptions, any, any>(
        {
          message: "razeth.validation.unique",
          debounce: DEFAULT_DEBOUNCE,
        },
        options,
        callTimeOptions,
      );

      debouncedResult.current = asyncDebounce(asyncValidate, interval);
      return async (value: any, allValues: any, props: InputProps) => {
        const source = props.source;
        if (isEmpty(value)) {
          return {
            message: "razeth.validation.required",
            args: {
              source: source,
              value,
              field: translateLabel({
                label: props.label,
                source: source,
                resource,
              }),
            },
            isRequired: true,
          };
        }

        try {
          const response = await debouncedResult.current(value, source);

          const data = response.data;
          const status = statusCode.getStatusCode(data.status);
          if (status !== statusCode.OK)
            return {
              message: data.message,
              args: {
                source: source,
                value,
                field: translateLabel({
                  label: props.label,
                  source: source,
                  resource,
                }),
              },
            };
        } catch (error) {
          console.error(error);
          return translate("ra.notification.http_error");
        }

        return undefined;
      };
    },
    [options, resource, translate, translateLabel],
  );

  return validateAsync;
};

export const asyncValidator = memoize(
  (resource: string, message = "razeth.validation.async") =>
    async (value: string): Promise<FieldError> => {
      const field = StringUtils.capitalize(
        StringUtils.getLastSegment(resource),
      );
      if (!value) {
        return {
          invalid: true,
          // message: `${StringUtils.capitalize(field)} is required!`,
          message: MsgUtils.setMsg("razeth.validation.required", {
            value,
            field: field,
          }),
        };
      }

      try {
        const response = await axios.get<any>(
          `${API_URL}/${resource}/${value}`,
        );
        const data = response.data;
        const status = statusCode.getStatusCode(data.status);
        return {
          invalid: status !== statusCode.OK,
          message: MsgUtils.setMsg(data.message || message, {
            value,
            endPoint: resource,
            status: status,
          }),
        };
      } catch (error) {
        console.error(error);
        return {
          invalid: true,
          message: MsgUtils.setMsg("razeth.validation.async", { error, field }),
        };
      }
    },
);

export const serverValidator = async (
  value: string | undefined,
  resource: string,
  message = "razeth.validation.async",
): Promise<FieldError> => {
  const field = StringUtils.capitalize(StringUtils.getLastSegment(resource));
  if (!value) {
    return {
      invalid: true,
      // message: `${StringUtils.capitalize(field)} is required!`,
      message: MsgUtils.setMsg("razeth.validation.required", {
        value,
        field: field,
      }),
    };
  }

  try {
    const response = await axios.get<any>(`${API_URL}/${resource}/${value}`);
    const data = response.data;
    const status = statusCode.getStatusCode(data.status);
    return {
      invalid: status !== statusCode.OK,
      message: MsgUtils.setMsg(data.message || message, {
        value,
        endPoint: resource,
        status: status,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      invalid: true,
      message: MsgUtils.setMsg("razeth.validation.async", { error, field }),
    };
  }
};

// export const validateStrength = async (value: string) => {
//   if (!value) return { invalid: false };

//   const result = await zxcvbnAsync(value);
//   return {
//     invalid: result.score <= 2, // Example threshold
//     message: "razeth.validation.strength",
//     args: {
//       strength: result.score,
//       warning: result.feedback.warning,
//     },
//   };
// };

export const validateStrength = async (
  value: string,
  message = "razeth.validation.notmatch",
) => {
  if (!value)
    return {
      message: "Required",
      feedbackMsg: "",
      score: 0,
      invalid: false,
      args: { password: "" },
    };
  const result = await zxcvbnAsync(value);
  const warningMsg = result.feedback.warning;
  const suggestMsg = result.feedback.suggestions.join(" ");
  const score = result.score;
  const invalid = score <= 0;

  // setValidateError(isValid);
  // setErrMessage(warningMsg || "");
  // setPasswordStrength(result.score);
  // setPasswordFeedback(
  //   result ? suggestMsg : (warningMsg ?? "").concat(` ${suggestMsg}`),
  // );

  if (invalid) {
    // Adjust threshold as needed
    return {
      message: warningMsg || message,
      feedbackMsg: (warningMsg ?? "").concat(` ${suggestMsg}`),
      score: score,
      invalid: invalid,
      args: {
        password: StringUtils.truncate(value, 5),
        strength: result.score,
        warning: result.feedback.warning,
      },
    };
  }
  return {
    message: undefined,
    feedbackMsg: (warningMsg ?? "").concat(` ${suggestMsg}`),
    score: score,
    invalid: invalid,
    args: {
      password: StringUtils.truncate(value, 5),
      strength: result.score,
      warning: result.feedback.warning,
    },
  }; // No error
};

export const matchPassword = memoize(
  (passwordValue: string, message = "razeth.validation.notmatch") =>
    (value: string, values: any) =>
      value !== passwordValue
        ? MsgUtils.getMessage(message, { passwordValue }, value, values)
        : undefined,
);

/**
 * Required validator
 *
 * Returns an error if the value is null, undefined, or empty
 *
 * @param {string|Function} message
 *
 * @example
 *
 * const titleValidators = [required('The title is required')];
 * <TextInput name="title" validate={titleValidators} />
 */
export const useRequired = (
  options?: UseFieldOptions,
  message = "razeth.validation.required",
) => {
  const translateLabel = useTranslateLabel();
  const resource = useResourceContext(options);
  if (!resource) {
    throw new Error("useField: missing resource prop or context");
  }

  const validateField = (resource?: string) => {
    // return (value: any, allValues: any, props: InputProps) => {
    //   if (isEmpty(value)) return undefined;
    //   return {
    //     message,
    //     args: {
    //       source: props.source,
    //       value,
    //       field: translateLabel({
    //         label: props.label,
    //         source: props.source,
    //         resource,
    //       }),
    //     },
    //     isRequired: true,
    //   };
    // };

    return Object.assign(
      (value: any, values: any, props: InputProps) =>
        isEmpty(value)
          ? MsgUtils.getMessage(
              message,
              {
                source: props.source,
                value,
                field: translateLabel({
                  label: props.label,
                  source: props.source,
                  resource,
                }),
              },
              value,
              values,
            )
          : undefined, // Return undefined if the value is not empty
      { isRequired: true },
    );
  };

  return validateField;
};

// const getMessage = (
//   message: string, // Now always a translation key
//   messageArgs: any,
//   translate: (key: string, options?: any) => string, // Add translate function as a parameter
// ) => {
//   return translate(message, messageArgs); // Always translate
// };

export default { serverValidator, validateStrength, matchPassword };
