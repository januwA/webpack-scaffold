import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

const x$ = new BehaviorSubject<number>(0);

export const useCount = () => {
  const [count, _setCount] = useState(x$.value);
  useEffect(() => {
    const sub = x$.subscribe(_setCount);
    return () => sub.unsubscribe();
  }, []);

  return {
    count,
    setCount: x$.next.bind(x$),
    inc: () => x$.next(count + 1),
  };
};
