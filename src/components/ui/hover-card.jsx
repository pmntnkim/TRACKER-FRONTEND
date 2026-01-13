import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

const HoverCard = ({ children, ...props }) => <HoverCardPrimitive.Root {...props}>{children}</HoverCardPrimitive.Root>;
HoverCard.displayName = HoverCardPrimitive.Root.displayName;

const HoverCardTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <HoverCardPrimitive.Trigger ref={ref} className={cn("", className)} {...props} />
));
HoverCardTrigger.displayName = HoverCardPrimitive.Trigger.displayName;

const HoverCardContent = React.forwardRef(({ className, side = "right", align = "center", ...props }, ref) => (
  <HoverCardPrimitive.Content ref={ref} side={side} align={align} className={cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md animate-in fade-in-80 data-[side=left]:slide-in-from-right-2", className)} {...props} />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
