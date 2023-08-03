import { HaveChildren } from "@/types";
import { PopperContextProvider } from "./popper";
import { TanstackQueryProvider } from "./tanstackQuery";
import { NextAuthSessionProvider } from "./session";

// provider for all providers
export function Providers({ children }: HaveChildren) {
  return (
    <TanstackQueryProvider>
      <NextAuthSessionProvider>
        <PopperContextProvider>
          {children}
        </PopperContextProvider>
      </NextAuthSessionProvider>
    </TanstackQueryProvider>
  );
}
