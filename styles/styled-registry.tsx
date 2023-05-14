"use client";

import { useServerInsertedHTML } from "next/navigation";
import { ReactNode } from "react";
import { useStyledRegistry } from "./use-styled-registry";

export function StyledRegistry({ children }: { children: ReactNode }) {
  const [StyledComponentsRegistry, styledComponentsFlushEffect] =
    useStyledRegistry();

  useServerInsertedHTML(() => {
    return <>{styledComponentsFlushEffect()}</>;
  });

  return <StyledComponentsRegistry>{children}</StyledComponentsRegistry>;
}
