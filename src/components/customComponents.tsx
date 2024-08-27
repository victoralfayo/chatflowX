import React from "react";

export function TableFooterInfo({children}: { children: React.ReactNode }) {
    return <div className={"text-jade-600 text-sm"}>
        {children}
    </div>;
}