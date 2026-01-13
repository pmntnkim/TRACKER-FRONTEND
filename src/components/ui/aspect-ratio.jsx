import * as React from "react";

import { cn } from "@/lib/utils";

const AspectRatio = React.forwardRef(({ className, ratio = 4 / 3, style, ...props }, ref) => {
  const padding = `${100 / ratio}%`;
  return (
    <div ref={ref} className={cn("relative w-full", className)} style={style} {...props}>
      <div style={{ paddingTop: padding }} />
      <div className="absolute inset-0">{props.children}</div>
    </div>
  );
});

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };