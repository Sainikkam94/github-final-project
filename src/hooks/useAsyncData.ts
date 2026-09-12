import { useEffect, useState, type DependencyList } from "react";

export function useAsyncData<T>(loader: () => Promise<T>, dependencies: DependencyList) {
  const [data, setData] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let isCurrent = true;

    setIsLoading(true);
    setError(undefined);

    loader()
      .then((value) => {
        if (isCurrent) {
          setData(value);
        }
      })
      .catch((caught: unknown) => {
        if (isCurrent) {
          setError(caught instanceof Error ? caught.message : "Unable to load data");
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, dependencies);

  return { data, isLoading, error };
}
