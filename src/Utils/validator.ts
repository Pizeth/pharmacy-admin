import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.API_URL;

export const useUsernameValidator = (
  username: string | undefined,
): string | null => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateUsername = async () => {
      if (!username) return;

      try {
        const response = await axios.get(
          `${API_URL}/user/username/${username}`,
        );
        console.log(response);
        const data = response.data as { exists: boolean };
        if (data.exists) {
          setError("Username already exists");
        } else {
          setError(null);
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while checking the username");
      }
    };

    validateUsername();
  }, [username]);

  return error;
};

export default useUsernameValidator;
