import React from "react";

function Driver(props: any) {
    return (
        <div className="w-full rounded-xl bg-neutral-100 p-2 overflow-hidden">
            {props.username}

        </div>
    )
}

export default Driver;