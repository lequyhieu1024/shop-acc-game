import React from "react";

const Loading: React.FC = () => {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
             style={{ zIndex: 1050, pointerEvents: "none", background: "#B9B9B9", opacity: 0.8 }}>
            <div className="spinner-border text-success" role="status" style={{ width: "5rem", height: "5rem" }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Loading;
