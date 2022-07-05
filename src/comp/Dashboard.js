import React from "react";
import OrderPill from "./OrderPill";

function Dashboard({ orders, user }) {
  return (
    <>
      {orders ? (
        <div className="container-fluid">
          <h2 className="m-4">Elo, {user.name}!</h2>
          <hr />
          <div className="m-4">
            <h3>Twoje zamówienia: {orders.length}</h3>
            <hr />
            <div className="row">
              <OrderPill type="forApproval" user={user} orders={orders} />
              <OrderPill type="approved" user={user} orders={orders} />
              <OrderPill type="forPickup" user={user} orders={orders} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Dashboard;
