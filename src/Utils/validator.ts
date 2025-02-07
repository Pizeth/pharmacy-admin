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
import axios from "axios";
import statusCode from "http-status-codes";
import StringUtils from "./StringUtils";
import loadZxcvbn from "./lazyZxcvbn";

export type FieldError = {
  error?: boolean;
  message?: string;
};

const API_URL = import.meta.env.VITE_API_URL;

const zxcvbnAsync = await loadZxcvbn();

export const serverValidator = async (
  value: string | undefined,
  resource: string,
): Promise<FieldError | null> => {
  // if (!value) return null;
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

  // setValidateError(isValid);
  // setErrMessage(warningMsg || "");
  // setPasswordStrength(result.score);
  // setPasswordFeedback(
  //   result ? suggestMsg : (warningMsg ?? "").concat(` ${suggestMsg}`),
  // );

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

// const validateEmailUnicity = async (value: string) => {
//   const isEmailUnique = await checkEmailIsUnique(value);
//   if (!isEmailUnique) {
//     return "Email already used";

//     // You can return a translation key as well
//     return "myroot.validation.email_already_used";

//     // Or even an object just like the other validators
//     return {
//       message: "myroot.validation.email_already_used",
//       args: { email: value },
//     };
//   }

//   return undefined;
// };

export const matchPassword = (passwordValue: string) => (value: string) => {
  return value !== passwordValue ? "Passwords do not match!" : undefined;
};

export default { serverValidator, validateStrength, matchPassword };
