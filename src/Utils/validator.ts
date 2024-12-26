import { useEffect, useState } from "react";
import axios from "axios";
import { json } from "stream/consumers";

const API_URL = import.meta.env.VITE_API_URL;

export const useUsernameValidator = (
  username: string | undefined,
): string | null => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateUsername = async () => {
      if (!username) return;
      console.log(`${API_URL}/user/username/${username}`);
      try {
        const response = await axios.get(
          `${API_URL}/user/username/${username}`,
        );
        console.log(response);
        const data = response.data as { exists: boolean; message?: string };
        if (data.exists) {
          setError(data.message || null);
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
