import * as React from "react";

const Separator = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />);

Separator.displayName = "Separator";

export { Separator };
