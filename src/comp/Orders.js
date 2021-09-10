import React, { useState, useEffect } from "react";
import OrdersBlok from "./OrdersBlok";

function Orders({ user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState();
  const [status] = useState([
    "Oczekuje na akceptację",
    "Zaakceptowane na pierwszym poziomie",
    "Zaakceptowane, gotowe do zamówienia",
    "Zamówione",
    "Odebrane na magazynie",
    "Zamówienie zakończone",
  ]);

  useEffect(() => {
    if (isLoading) {
      const getAllOrders = async () => {
        const get = await fetch(
          "http://10.47.8.62/eltwin_orders/api/api.php?type=getAllOrders"
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

  return (
    <>
      {isLoading ? (
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
      ) : (
        <div className="container-fluid">
          <h2 className="m-4">Wszystkie zamówienia:</h2>

          <hr />
          {orders.map((order) => {
            return (
              <OrdersBlok
                user={user}
                status={order.status}
                statusText={status[order.status]}
                order={order}
                key={order.id}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default Orders;
