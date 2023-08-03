"use client";

import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <>
      <div className="inline-block mx-auto">{JSON.stringify(error)}</div>;
      <Button onClick={reset}>Reset</Button>
    </>
  );
}
