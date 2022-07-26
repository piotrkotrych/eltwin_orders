import React, { useCallback, useEffect, useState } from "react";
import Table from "./Table";
import { Link } from "react-router-dom";

function Confirm({ user, status, orders, update }) {
  const [isLoading, setIsLoading] = useState(true);
  const [confirmOrders, setConfirmOrders] = useState();

  let ordersToConfirm = useCallback(() => {
    setConfirmOrders(orders.filter((order) => parseInt(order.status) < 2));
    setIsLoading(false);
  }, [orders]);

  useEffect(() => {
    if (isLoading && update()) {
      ordersToConfirm();
      setIsLoading(false);
    }
  }, [update, isLoading, ordersToConfirm]);

  const columns = [
    {
      Header: "Numer zamówienia",
      accessor: "id",
      Cell: ({ value }) => (
        <div>
          <Link to={`/order/${value}`}>{`Zamówienie ${value}`}</Link>
        </div>
      ),
    },
    {
      Header: "Data zamówienia",
      accessor: "date_added",
    },
    {
      Header: "Cel zakupu",
      accessor: "cel",
    },
    {
      Header: "Zamówił/a",
      accessor: (row) => {
        return [row.ordered_by, row.initials];
      },
      Cell: (row) => (
        <div className="">
          <Link to={`/user/${row.value[1]}`}>{row.value[0]}</Link>
        </div>
      ),
    },
    {
      Header: "Dostawca",
      accessor: (row) => {
        if (row.firma_id) {
          return [row.firma_id, row.firma];
        } else {
          return [0, row.firma];
        }
      },
      Cell: (row) => {
        if (row.value[0] === 0) {
          return <div>{row.value[1]}</div>;
        } else {
          return (
            <div>
              <Link to={`/company/${row.value[0]}`}>{row.value[1]}</Link>
            </div>
          );
        }
      },
    },
    {
      Header: "Produkty",
      accessor: (row) => {
        return row.produkty.map((produkt) => {
          return [produkt.nazwa, produkt.ilosc, produkt.jednostka];
        });
      },
      Cell: (row) => {
        return row.value.map((produkt, index) => {
          return (
            <div className="" key={index}>
              <div className="">
                <b>{produkt[0]}</b>
              </div>
              <div className="">
                {produkt[1]} {produkt[2]}
              </div>
            </div>
          );
        });
      },
    },
    {
      Header: "Pierwszy poziom",
      accessor: (row) => {
        return [row.level1, row.level1user, row.level1date];
      },
      Cell: (row) => {
        if (row.value[0] === 0) {
          return (
            <div>
              <button className="btn btn-primary">Zaakceptuj 1 poziom</button>
            </div>
          );
        } else {
          return (
            <div>
              <div>{row.value[1]}</div>
              <div>{row.value[2]}</div>
            </div>
          );
        }
      },
    },
    {
      Header: "Drugi poziom",
      accessor: (row) => {
        //check if level1 is equal to 1
        if (row.level1 === 1) {
          return [row.level2, row.level2user, row.level2date];
        } else {
          return [0, "", ""];
        }
      },
      Cell: (row) => {
        if (row.value[0] === 0) {
          return (
            <div>
              <button className="btn btn-primary">Zaakceptuj 2 poziom</button>
            </div>
          );
        } else {
          return (
            <div>
              <Link to={`/user/${row.value[1]}`}>{row.value[0]}</Link>
              <div>{row.value[2]}</div>
            </div>
          );
        }
      },
    },
    {
      Header: "Odrzuć",
      accessor: (row) => {
        return [row.rejected, row.rejected_by, row.rejected_reason];
      },
      Cell: (row) => {
        if (row.value[0] === 0) {
          return (
            <div>
              <button className="btn btn-danger">Odrzuć</button>
            </div>
          );
        } else {
          return (
            <div>
              <Link to={`/user/${row.value[1]}`}>{row.value[0]}</Link>
              <div>{row.value[2]}</div>
            </div>
          );
        }
      },
    },
  ];
  return (
    <div className="container-fluid">
      {!isLoading && user.level > 2 ? (
        <>
          <Table
            columns={columns}
            data={confirmOrders}
            title={`Lista zamówień do zatwierdzenia ${confirmOrders.length}`}
          />
        </>
      ) : null}
    </div>
  );
}

export default Confirm;
