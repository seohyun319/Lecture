import { useState } from "react";

type ReturnType<T> = [boolean, T | null];

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | string;

const useLoading = <T>(
  url: RequestInfo | URL,
  data: Record<string, unknown> = {},
  method: HttpMethod = "GET"
): ReturnType<T> => {
  const [isLoading, setIsLoading] = useState(true);
  const [res, setRes] = useState<T | null>(null);
  fetch(url, {
    method: method,
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {
      setRes(result);
      setIsLoading(false);
      return result as T;
    });

  return [isLoading, res];
};

export default useLoading;
