"use client";

import { HaveChildren } from "@/types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useHover, useCountdown, useBoolean } from "usehooks-ts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ExclamationTriangleIcon,
  Cross1Icon,
  CheckCircledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// functions available on the popper context
export type PopperContext = {
  pop(options: PopperOptions): void;
};

// popper options
export type PopperOptions = {
  type: PopperType;
  headline: string;
  message?: string;
};

// types of poppers
export type PopperType = "success" | "error" | "warning" | "info";

const popperTimeout = 1500;
const interval = 2;

const popperContext = createContext<PopperContext | null>(null);

// provider for the popper context
export function PopperContextProvider({ children }: HaveChildren) {
  const [option, setOption] = useState<PopperOptions>({
    type: "success",
    headline: "",
  });
  const {
    value: isTriggered,
    setTrue: setIsTriggeredTrue,
    setFalse: setIsTriggeredFalse,
  } = useBoolean(false);
  const popperRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(popperRef);
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: popperTimeout / interval,
      intervalMs: interval,
    });

  useEffect(() => {
    // stop countdown on hover
    if (isHover) {
      stopCountdown();
    }

    // start countdown on hover out and if count is greater than 0
    if (!isHover && count > 0 && isTriggered) {
      startCountdown();
    }

    // reset countdown on hover out and if count is 0
    if (count === 0) {
      setIsTriggeredFalse();
    }
  }, [
    isHover,
    count,
    startCountdown,
    stopCountdown,
    resetCountdown,
    setOption,
    isTriggered,
    setIsTriggeredFalse,
  ]);

  const pop: PopperContext["pop"] = ({ type, headline, message }) => {
    setOption({ type, headline, message });
    setIsTriggeredTrue();
    resetCountdown();
    startCountdown();
  };

  return (
    <popperContext.Provider
      value={{
        pop,
      }}
    >
      <div className="" ref={popperRef}>
        {count > 0 && isTriggered && (
          <Alert
            className={clsx({
              "fixed w-[300px] overflow-hidden z-50 bg-white top-2 left-2":
                true,
              "group/success text-green-500": option.type === "success",
              "group/error text-red-500 ": option.type === "error",
              "group/warning text-yellow-500": option.type === "warning",
              "group/info text-blue-500": option.type === "info",
            })}
          >
            <Button
              className="absolute right-1 top-1 rounded-full text-xs text-black"
              variant="ghost"
              size={"icon"}
              onClick={() => setIsTriggeredFalse()}
            >
              <Cross1Icon />
            </Button>
            {option.type === "error" && (
              <ExclamationTriangleIcon
                className="h-5 w-5"
                color="rgb(239 68 68)"
              />
            )}
            {option.type === "success" && (
              <CheckCircledIcon className="h-5 w-5" color="rgb(34 197 94)" />
            )}
            {option.type === "warning" && (
              <ExclamationTriangleIcon
                className="h-5 w-5"
                color="rgb(234 179 8)"
              />
            )}
            {option.type === "info" && (
              <InfoCircledIcon className="h-5 w-5" color="rgb(59 130 246 )" />
            )}

            <AlertTitle className="">{option.headline}</AlertTitle>
            <AlertDescription className="text-sm">
              {option.message || ""}
            </AlertDescription>
            <Progress
              value={100 * (interval / popperTimeout) * count}
              className="absolute w-full bottom-0 left-0 rounded-none h-full -z-10 opacity-5 "
            />
          </Alert>
        )}
      </div>
      {children}
    </popperContext.Provider>
  );
}

// hook to get the non-nullable popper context
export function usePopper() {
  const popper = useContext(popperContext);
  if (!popper) throw new Error("Popper context not found");
  return popper;
}
