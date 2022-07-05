import React from "react";

function OrderProdukty({ user, order }) {
  return (
    <div>
      <div className="row">
        <div className="col-md m-4">
          <h4>Produkty</h4>
        </div>
      </div>
      <div className="mx-4">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Indeks</th>
              <th scope="col">Nazwa</th>
              <th scope="col">Ilość</th>
              <th scope="col">Cena</th>
              <th scope="col">Koszty wysyłki</th>
              <th scope="col">Link</th>
            </tr>
          </thead>
          <tbody>
            {order.produkty.map((e, index) => {
              return (
                <tr key={e.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{e.indeks}</td>
                  <td>{e.nazwa}</td>
                  <td>
                    {e.ilosc} {e.jednostka}
                  </td>
                  <td>{e.cena} zł</td>
                  <td>{e.koszt_wysylki} zł</td>
                  <td>
                    <a href={e.link} target="_blank" rel="noreferrer">
                      Link do strony
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="m-4">
        <h4>
          {/* Razem: {order.produkty.reduce((a, b) => a + b.cena, 0)} {order.waluta}{" "}
          + {order.produkty.reduce((a, b) => a + b.koszt_wysylki, 0)}{" "}
          {order.waluta} */}
          {/* map produkty and sum cena times ilosc */}
          Razem:{" "}
          {order.produkty
            .reduce(
              (a, b) =>
                parseFloat(a) + parseFloat(b.cena) * parseFloat(b.ilosc),
              0
            )
            .toFixed(2)}{" "}
          {order.waluta}+{" "}
          {order.produkty
            .reduce((a, b) => parseFloat(a) + parseFloat(b.koszt_wysylki), 0)
            .toFixed(2)}{" "}
          {order.waluta}
        </h4>
      </div>
    </div>
  );
}

export default OrderProdukty;
