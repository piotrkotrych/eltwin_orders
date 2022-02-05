import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import OrderPill from "./OrderPill";

function Dashboard({ user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState();

  useEffect(() => {
    if (!orders) {
      const getAllOrders = async () => {
        const get = await fetch(
          "http://10.47.8.28/eltwin_orders/api/api.php?type=getAllOrders"
        );
        const res = await get.json();
        let newRes = res.filter((e) => e.initials === user.login);
        setOrders(newRes);
        setIsLoading(false);
      };
      getAllOrders();
    } else {
      return () => {};
    }
  }, [orders, user.login]);

  return (
    <div className="container-fluid">
      <h2 className="m-4">Elo, {user.name}!</h2>
      <hr />
      {!isLoading ? (
        <div className="m-4">
          <h3>
            Twoja zamówienia:{" "}
            {orders.filter((order) => order.initials === user.login).length}
          </h3>
          <hr />
          <div className="row">
            <OrderPill type="forApproval" user={user} orders={orders} />
            <OrderPill type="approved" user={user} orders={orders} />
            <OrderPill type="forPickup" user={user} orders={orders} />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Dashboard;
