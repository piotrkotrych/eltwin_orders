import React, { useState, useEffect } from "react";
import OrdersBlok from "./OrdersBlok";
import Loading from "./Loading";
import { Link } from "react-router-dom";

function Orders({ user, statusy }) {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState();
  const [status] = useState(statusy);

  useEffect(() => {
    if (isLoading) {
      const getAllOrders = async () => {
        const get = await fetch(
          "http://10.47.8.28/eltwin_orders/api/api.php?type=getAllOrders"
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
        <Loading />
      ) : (
        <div className="container-fluid">
          <h2 className="m-4">Wszystkie zamówienia:</h2>

          <hr />
          {orders.map((order) => {
            return (
              <Link
                className="link-order"
                to={`/order/${order.id}`}
                key={order.id}
              >
                <OrdersBlok
                  user={user}
                  status={order.status}
                  statusText={status[order.status]}
                  order={order}
                  key={order.id}
                />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Orders;
