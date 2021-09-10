import React from "react";

function OrdersBlok({ user, order, status, statusText }) {
  return (
    <div className="row">
      <div className={"col mx-4 mt-4 px-3 py-3 blok blokKolor-" + status}>
        <div className="row">
          <div className="col">
            <b>{order.date_added}</b>
          </div>
          <div className="col">{order.cel}</div>
          <div className="col">
            <ul className="list-unstyled mb-0">
              {order.produkty.map((p) => {
                return <li key={p.id}>{p.nazwa}</li>;
              })}
            </ul>
          </div>
          <div className="col">
            <ul className="list-unstyled mb-0">
              {order.produkty.map((p) => {
                return (
                  <li key={p.id}>
                    <strong>{p.cena} zł</strong>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="col">{order.ordered_by}</div>
          <div className="col">
            <u>{statusText}</u>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersBlok;
