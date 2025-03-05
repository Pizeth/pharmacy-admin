import axios, { CancelTokenSource } from "axios";
import { isEmpty, merge } from "lodash";
import { useCallback, useRef, useEffect } from "react";
import statusCode from "http-status-codes";
import {
  useResourceContext,
  useTranslateLabel,
  useTranslate,
  asyncDebounce,
  InputProps,
  Validator,
} from "react-admin";
import {
  UseFieldOptions,
  IconTextInputProps,
  DEFAULT_DEBOUNCE,
  ValidationResult,
  ValidationResult1,
  Memoize,
} from "../Types/types";
import MsgUtils from "./MsgUtils";
import lodashMemoize from "lodash/memoize";

const memoize: Memoize = (fn: any) =>
  lodashMemoize(fn, (...args) => JSON.stringify(args));

const API_URL = import.meta.env.VITE_API_URL;

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

// export const useAsyncValidator = (

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

const API_URL = import.meta.env.VITE_API_URL;

export const useAsyncValidator = (options?: UseFieldOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const cancelTokenRef = useRef<CancelTokenSource | undefined>(undefined);
  const [, setMessage] = useAtom(setValidationMessageAtom);
  const [, clearMessage] = useAtom(clearValidationMessageAtom);
  const currentValidationId = useRef(0);

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

      return async (value: any, allValues: any, props: IconTextInputProps) => {
        const { source, label } = props;
        const args = {
          source,
          value,
          field: {
            label: label,
            source,
          },
        };

        if (isEmpty(value)) {
          return Object.assign(
            MsgUtils.getMessage(message, args, value, allValues),
            { isRequired: true },
            { status: statusCode.ACCEPTED },
          );
        }
        // Clear previous validation
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (cancelTokenRef.current) cancelTokenRef.current.cancel();

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
                  setMessage({ source, message: `⭕ ${data.message} ✔️` });
                  resolve(undefined); // ✅ Clear errors automatically
                  return;
                }
                clearMessage(source);
                resolve(MsgUtils.setMsg(`❌ ${data.message} ❗`, args, status));
              } catch (error) {
                if (!axios.isCancel(error)) {
                  clearMessage(source);
                  resolve(
                    MsgUtils.setMsg(
                      "razeth.validation.async",
                      args,
                      statusCode.INTERNAL_SERVER_ERROR,
                    ),
                  );
                }
              }
            }, interval ?? DEFAULT_DEBOUNCE);
          },
        );
      };
    },
    [clearMessage, options, setMessage],
  );

  return validate;
};
