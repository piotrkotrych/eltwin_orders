import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import Table from "./Table";

function Orders({ user, statusy }) {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState();
  const [status] = useState(statusy);

  useEffect(() => {
    if (isLoading) {
      const getAllOrders = async () => {
        const get = await fetch(
          "http://127.0.0.1/eltwin_orders/api/api.php?type=getAllOrders"
        );
        const res = await get.json();
        setOrders(res);
        console.log(orders);
        setIsLoading(false);
      };
      getAllOrders();
    } else {
      return () => {};
    }
  }, [orders, isLoading]);

  console.log(user.login);
  console.log(status);

  const columns = [
    {
      Header: "Numer zamówienia",
      accessor: "id",
      Cell: (row) => (
        <div className="">
          <Link to={`/order/${row.value}`}>Zamówienie {row.value}</Link>
        </div>
      ),
      sortType: "basic",
    },
    {
      Header: "Data",
      accessor: "date_added",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (row) => <b>{status[row.value]}</b>,
    },
    {
      Header: "Dział",
      accessor: "dzial",
    },
    {
      Header: "Rodzaj",
      accessor: "rodzaj",
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
      Header: "Koszt",
      accessor: (row) => {
        return row.produkty
          .map((produkt) => {
            return produkt.cena * produkt.ilosc;
          })
          .reduce((a, b) => parseFloat(a + b), 0);
      },
      Cell: (row) => <div className="">{row.value.toFixed(2)}</div>,

      sortType: "basic",
    },
    {
      Header: "Waluta",
      accessor: "waluta",
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          data={orders}
          title={`Wszystkie zamówienia ${orders.length}`}
        />
      )}
    </>
  );
}

export default Orders;
