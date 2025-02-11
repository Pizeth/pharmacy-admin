import axios from "axios";
import statusCode from "http-status-codes";
import StringUtils from "../Utils/StringUtils";
import zxcvbn from "../Utils/lazyZxcvbn";
import {
  InputProps,
  isEmpty,
  useResourceContext,
  useTranslateLabel,
  UseUniqueOptions,
} from "react-admin";
import { FieldError, Memoize, MessageFunc } from "../Types/types";
import lodashMemoize from "lodash/memoize";

// If we define validation functions directly in JSX, it will
// result in a new function at every render, and then trigger infinite re-render.
// Hence, we memoize every built-in validator to prevent a "Maximum call stack" error.
const memoize: Memoize = (fn: any) =>
  lodashMemoize(fn, (...args) => JSON.stringify(args));

const API_URL = import.meta.env.VITE_API_URL;

const zxcvbnAsync = await zxcvbn.loadZxcvbn();

export const serverValidator = async (
  value: string | undefined,
  resource: string,
): Promise<FieldError | null> => {
  if (!value) {
    const field = StringUtils.getLastSegment(resource);
    return {
      error: true,
      message: `${StringUtils.capitalize(field)} is required!`,
    };
  }

  try {
    const response = await axios.get<any>(`${API_URL}/${resource}/${value}`);
    const data = response.data;

    return {
      error: statusCode.getStatusCode(data.status) !== statusCode.OK,
      message: data.message || null,
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "An error occurred while validating the field!",
    };
  }
};

export const validateStrength = async (value: string) => {
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

  if (invalid) {
    // Adjust threshold as needed
    return {
      message: warningMsg || "",
      feedbackMsg: (warningMsg ?? "").concat(` ${suggestMsg}`),
      score: score,
      invalid: invalid,
      args: { password: StringUtils.truncate(value, 5) },
    };
  }
  return {
    message: undefined,
    feedbackMsg: (warningMsg ?? "").concat(` ${suggestMsg}`),
    score: score,
    invalid: invalid,
    args: { password: StringUtils.truncate(value, 5) },
  }; // No error
};

export const matchPassword = memoize(
  (passwordValue: string, message = "razeth.validation.notmatch") =>
    (value: string, values: any) =>
      value !== passwordValue
        ? getMessage(message, { passwordValue }, value, values)
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
  options?: UseUniqueOptions,
  message = "ra.validation.required",
) => {
  // const dataProvider = useDataProvider();
  const translateLabel = useTranslateLabel();
  const resource = useResourceContext(options);
  if (!resource) {
    throw new Error("useField: missing resource prop or context");
  }

  const validateField = (resource: string) => {
    return (value: any, allValues: any, props: InputProps) => {
      if (isEmpty(value)) return undefined;
      return {
        message,
        args: {
          source: props.source,
          value,
          field: translateLabel({
            label: props.label,
            source: props.source,
            resource,
          }),
        },
        isRequired: true,
      };
    };
  };

  return validateField;
};

const getMessage = (
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

export default { serverValidator, validateStrength, matchPassword };
