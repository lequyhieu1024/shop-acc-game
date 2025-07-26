import Transaction from "@/app/admin/transactions/list";
import {Suspense} from "react";

export default function List() {
    return (
        <Suspense>
            <Transaction/>
        </Suspense>
    )
}