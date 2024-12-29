import { useEffect, useState } from "react";
import axios from "axios";
import statusCode from "http-status-codes";

// interface FieldError {
//   message: string | null;
// }

// type ControllerFieldState = {
//     invalid: boolean;
//     isTouched: boolean;
//     isDirty: boolean;
//     isValidating: boolean;
//     error?: FieldError;
// };

type FieldError = {
  error?: boolean;
  message?: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export const ServerValidator = (
  value: string | undefined,
  resource: string,
): FieldError | null => {
  const [error, setMsg] = useState<FieldError | null>(null);
  useEffect(() => {
    const validateUsername = async () => {
      if (!value) return;
      try {
        const response = await axios.get<any>(
          `${API_URL}/${resource}/${value}`,
        );
        const data = response.data;
        if (data) {
          const res: FieldError = {
            error:
              statusCode.getStatusCode(data.status) === statusCode.OK
                ? false
                : true,
            message: data.message || null,
          };
          setMsg(res || null);
        } else {
          setMsg(null);
        }
      } catch (error) {
        console.error(error);
        setMsg({
          error: true,
          message: "An error occurred while validating the field!",
        });
      }
    };

    validateUsername();
  }, [value, resource]);

  return error;
};

export default ServerValidator;
