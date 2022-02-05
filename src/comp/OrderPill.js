import React from "react";
import { Link } from "react-router-dom";

function OrderPill({ user, orders, type }) {
  return (
    <>
      {type === "forApproval" ? (
        <div className="col-lg-4">
          <h4>Do akceptacji</h4>
          {orders
            .filter((s) => s.status <= 1 && s.initials === user.login)
            .map((order) => (
              <div key={order.id}>
                <div className="card my-3 border border-danger">
                  <div className="card-header">
                    Zamówienie: <b>{order.id}</b>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">
                      {order.rodzaj} / {order.dzial}
                    </h6>
                    <p>Dodano: {order.date_added}</p>
                    <p>Cel: {order.cel}</p>
                    <h6 className="card-title">Produkty:</h6>
                    {order.produkty.map((produkt) => {
                      return (
                        <p className="card-text" key={produkt.id}>
                          {produkt.nazwa}
                        </p>
                      );
                    })}
                    <h6 className="card-title">
                      Wartość: {order.produkty.reduce((a, b) => a + b.cena, 0)}{" "}
                      zł
                    </h6>
                  </div>
                  <div className="card-footer text-center">
                    <Link className="btn btn-primary" to={`/order/${order.id}`}>
                      Przejdź do zamówienia
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : null}
      {type === "approved" ? (
        <div className="col-lg-4">
          <h4>Zaakceptowane</h4>
          {orders
            .filter((s) => s.status === 2 && s.initials === user.login)
            .map((order) => (
              <div key={order.id}>
                <div className="card my-3 border border-warning">
                  <div className="card-header">
                    Zamówienie: <b>{order.id}</b>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">
                      {order.rodzaj} / {order.dzial}
                    </h6>
                    <p>Dodano: {order.date_added}</p>
                    <p>Cel: {order.cel}</p>
                    <h6 className="card-title">Produkty:</h6>
                    {order.produkty.map((produkt) => {
                      return (
                        <p className="card-text" key={produkt.id}>
                          {produkt.nazwa}
                        </p>
                      );
                    })}
                    <h6 className="card-title">
                      Wartość: {order.produkty.reduce((a, b) => a + b.cena, 0)}{" "}
                      zł
                    </h6>
                  </div>
                  <div className="card-footer text-center">
                    <Link className="btn btn-primary" to={`/order/${order.id}`}>
                      Przejdź do zamówienia
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : null}
      {type === "forPickup" ? (
        <div className="col-lg-4">
          <h4>Do odbioru</h4>
          {orders
            .filter((s) => s.status > 2 && s.initials === user.login)
            .map((order) => (
              <div key={order.id}>
                <div className="card my-3 border border-success">
                  <div className="card-header">
                    Zamówienie: <b>{order.id}</b>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">
                      {order.rodzaj} / {order.dzial}
                    </h6>
                    <p>Dodano: {order.date_added}</p>
                    <p>Cel: {order.cel}</p>
                    <h6 className="card-title">Produkty:</h6>
                    {order.produkty.map((produkt) => {
                      return (
                        <p className="card-text" key={produkt.id}>
                          {produkt.nazwa}
                        </p>
                      );
                    })}
                    <h6 className="card-title">
                      Wartość: {order.produkty.reduce((a, b) => a + b.cena, 0)}{" "}
                      zł
                    </h6>
                  </div>
                  <div className="card-footer text-center">
                    <Link className="btn btn-primary" to={`/order/${order.id}`}>
                      Przejdź do zamówienia
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : null}
    </>
  );
}

export default OrderPill;
