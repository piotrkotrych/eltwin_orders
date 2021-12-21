import React from "react";

function Loading() {
  return (
    <div className="text-center">
      <div
        className="spinner-border"
        style={{ width: "10rem", height: "10rem", marginTop: "20vh" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <h1 className="mt-3" style={{ fontSize: "40px" }}>
        Wczytuję dane...
      </h1>
    </div>
  );
}

export default Loading;
