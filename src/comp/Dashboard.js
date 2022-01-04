import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";

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
            <div className="col">
              <h4>Do akceptacji</h4>
              {orders
                .filter((s) => s.status <= 1 && s.initials === user.login)
                .map((order) => (
                  <Link
                    to={`/order/${order.id}`}
                    key={order.id}
                    className="btn btn-primary mt-3"
                  >
                    <div className="row">
                      <div className="col">
                        Zamówienie: <b>{order.id}</b>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
            <div className="col">
              <h4>Zaakceptowane</h4>
              {orders
                .filter((s) => s.status === 2 && s.initials === user.login)
                .map((order) => (
                  <div key={order.id}>
                    <Link
                      to={`/order/${order.id}`}
                      key={order.id}
                      className="btn btn-primary mt-3"
                    >
                      <div className="row">
                        <div className="col">
                          Zamówienie: <b>{order.id}</b>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
            <div className="col">
              <h4>Do odbioru</h4>
              {orders
                .filter((s) => s.status > 2 && s.initials === user.login)
                .map((order) => (
                  <div key={order.id}>
                    <Link
                      to={`/order/${order.id}`}
                      key={order.id}
                      className="btn btn-primary mt-3"
                    >
                      <div className="row">
                        <div className="col">
                          Zamówienie: <b>{order.id}</b>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Dashboard;
