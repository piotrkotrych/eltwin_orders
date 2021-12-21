import React from "react";

function OrdersBlok({ user, order, status, statusText }) {
  return (
    <div className="row">
      <div className={"col mx-4 mt-4 px-3 py-3 blok blokKolor-" + status}>
        <div className="row">
          <div className="col-md">
            <b>
              {order.date_modified ? (
                <>
                  {order.date_added} <br /> {order.date_modified}
                </>
              ) : (
                order.date_added
              )}
            </b>
          </div>
          <div className="col-md">{order.cel}</div>
          <div className="col-sm">
            <ul className="list-unstyled mb-0">
              {order.produkty.map((p) => {
                return <li key={p.id}>{p.nazwa}</li>;
              })}
            </ul>
          </div>
          <div className="col-sm">
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
          <div className="col-md">
            {order.user_modify ? (
              <>
                Zamówił: {order.ordered_by}
                <br />
                Edytował: {order.user_modify}
              </>
            ) : (
              <>Zamówił: {order.ordered_by}</>
            )}
          </div>
          <div className="col-md">
            <b>{statusText}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersBlok;
