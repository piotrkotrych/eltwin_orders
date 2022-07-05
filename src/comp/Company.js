import React, { useState } from "react";
import CompanyAdd from "./CompanyAdd";

function Company() {
  const [isLoading, setIsLoading] = useState(false);
  const [companys, setCompanys] = useState([]);

  return (
    <div className="container-fluid">
      <h2 className="m-4">Lista dostawców</h2>
      <hr />
      <CompanyAdd></CompanyAdd>
    </div>
  );
}

export default Company;
