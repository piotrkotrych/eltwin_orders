import React, { useState, useEffect, useCallback } from "react";
import { Route } from "react-router-dom";
import CompanyAdd from "./CompanyAdd";
import CompanyAll from "./CompanyAll";
import CompanyOne from "./CompanyOne";

function Company({ user, orders, statusy }) {
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  let fetchCompanies = useCallback(async () => {
    const response = await fetch(
      "http://127.0.0.1/eltwin_orders/api/api.php?type=getAllCompanies"
    );
    const data = await response.json();
    setCompanies(data);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchCompanies();
    setIsLoading(false);
  }, [fetchCompanies]);

  return (
    <div className="container-fluid">
      <Route path="/company" exact>
        {!isLoading ? (
          <>
            <h2 className="m-4">Lista dostawców</h2>
            <hr />
            {user.level >= 3 ? (
              <CompanyAdd update={fetchCompanies}></CompanyAdd>
            ) : null}
            <hr />
            <CompanyAll
              companies={companies}
              update={fetchCompanies}
            ></CompanyAll>
          </>
        ) : null}
      </Route>
      <Route path="/company/:companyId">
        {!isLoading ? (
          <>
            <CompanyOne
              companies={companies}
              orders={orders}
              statusy={statusy}
            ></CompanyOne>
          </>
        ) : null}
      </Route>
    </div>
  );
}

export default Company;
