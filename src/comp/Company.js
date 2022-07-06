import React, { useState, useEffect } from "react";
import CompanyAdd from "./CompanyAdd";

function Company({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [companys, setCompanys] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    console.log(user);
    setIsLoading(false);
  }, []);

  return (
    <div className="container-fluid">
      {!isLoading ? (
        <>
          <h2 className="m-4">Lista dostawców</h2>
          <hr />
          {user.level >= 3 ? <CompanyAdd></CompanyAdd> : null}
          <hr />
        </>
      ) : null}
    </div>
  );
}

export default Company;
