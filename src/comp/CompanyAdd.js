import React from "react";

function CompanyAdd({ update }) {
  return (
    <div>
      <button className="btn btn-primary" onClick={() => update("klop")}>
        Set state
      </button>
    </div>
  );
}

export default CompanyAdd;
