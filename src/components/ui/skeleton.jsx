import * as React from "react";

const Skeleton = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));

Skeleton.displayName = "Skeleton";

export { Skeleton };
