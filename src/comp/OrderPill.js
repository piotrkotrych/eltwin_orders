import React from "react";
import { Link } from "react-router-dom";

function OrderPill({ user, orders, type }) {
  let display = null;
  let text = null;

  //switch case based on type prop, filter orders by status number
  switch (type) {
    case "forApproval":
      display = orders.filter((order) => order.status <= 1);
      text = "Do akceptacji";
      break;

    case "approved":
      display = orders.filter((order) => order.status === 2);
      text = "Zaakceptowane";
      break;

    case "forPickup":
      display = orders.filter((order) => order.status > 2);
      text = "Do odbioru";
      break;

    default:
      break;
  }

  return (
    <>
      {display ? (
        <div className="col-lg-4">
          <h4>{text}</h4>
          {display.map((order) => (
            <div key={order.id}>
              <div className="card my-3 shadow p-3">
                <div className="card-header bg-white">
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
                    Razem:{" "}
                    {order.produkty
                      .reduce(
                        (a, b) =>
                          parseFloat(a) +
                          parseFloat(b.cena) * parseFloat(b.ilosc),
                        0
                      )
                      .toFixed(2)}{" "}
                    {order.waluta}+{" "}
                    {order.produkty
                      .reduce(
                        (a, b) => parseFloat(a) + parseFloat(b.koszt_wysylki),
                        0
                      )
                      .toFixed(2)}{" "}
                    {order.waluta}
                  </h6>
                </div>
                <div className="card-footer text-center bg-white">
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
