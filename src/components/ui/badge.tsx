import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-app-border bg-app-elevated text-app-text",
        success: "border-app-success/40 bg-app-success/12 text-green-100",
        warning: "border-app-medium/45 bg-app-medium/12 text-yellow-100",
        danger: "border-app-critical/45 bg-app-critical/12 text-red-100",
        blue: "border-app-primary/40 bg-app-primary/12 text-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
