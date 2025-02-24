import React, {ReactNode} from "react";
import {ToastContainer} from "react-toastify";

export default function layout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <head>
            <title>Client</title>
        </head>
        <body>
        <header>
            <h2>Header</h2>
        </header>
        <div className="page-body">
            <div className="container-fluid">
                {/*Extend Here*/}
                {children}
                <ToastContainer/>
            </div>
            <footer>
                <h2>Footer</h2>
            </footer>
        </div>
        </body>
        </html>
    )
}