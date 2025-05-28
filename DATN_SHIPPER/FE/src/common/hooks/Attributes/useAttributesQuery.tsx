import { useState, useEffect } from "react";
import axios from "axios";
import instance from "../../../configs/axios";

interface UseAttributesResult {
  colors: string[];
  sizes: string[];
  loading: boolean;
  error: string | null;
}

const useAttributes = (): UseAttributesResult => {
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await instance.get("/attributes");
        setColors(response.data.colors);
        setSizes(response.data.sizes);
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    };

    fetchAttributes();
  }, []);

  return { colors, sizes, loading, error };
};

export default useAttributes;
