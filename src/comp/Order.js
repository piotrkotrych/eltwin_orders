import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "./Loading";
import ManageFiles from "./ManageFiles";
import OrderLog from "./OrderLog";

function Order({ user, statusy }) {
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState();
  const [status] = useState(statusy);

  useEffect(() => {
    if (isLoading && id) {
      console.log(id);
      const getOrder = async () => {
        const get = await fetch(
          "http://localhost/eltwin_orders/api/api.php?type=getOrder&id=" + id
        );
        const res = await get.json();
        if (res) {
          setOrder(res[0]);
          setIsLoading(false);
        }
      };
      getOrder();
      console.log(order);
    }
  });

  const updateStatus = (newStatus) => {
    console.log("Próba akceptacji samego siebie");
    console.log(newStatus);
    setOrder((oldOrder) => ({ ...oldOrder, status: newStatus }));

    if (order) {
      const data = {
        id: order.id,
        ["level" + newStatus]: 1,
        ["level" + newStatus + "user"]: user.name + " " + user.secondname,
        status: newStatus,
      };

      const options = { method: "POST", body: JSON.stringify(data) };
      const update = async () => {
        const up = await fetch(
          "http://localhost/eltwin_orders/api/api.php?type=updateStatus",
          options
        );
        const res = await up.ok;
        console.log(res);
      };

      update();
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="container-fluid">
          <h2 className="m-4">Zamówienie numer {id}</h2>
          <h5 className="mx-4">Status: {status[order.status]}</h5>
          {order.log ? <OrderLog order={order} user={user} /> : null}
          <hr />
          <div className="d-flex justify-content-start flex-wrap">
            {(user.login === order.initials && order.status < 2) ||
            (user.level > 2 && order.status < 2) ? (
              <Link
                className="btn btn-secondary mx-4 my-2"
                to={`/form/${order.id}`}
              >
                Edytuj zamówienie
              </Link>
            ) : null}
            {user.level > 1 && order.status === 0 ? (
              <button
                className="btn btn-primary mx-4 my-2"
                onClick={() => updateStatus(1)}
              >
                Zaakceptuj poziom 1
              </button>
            ) : null}
            {user.level > 2 && order.status === 1 ? (
              <button
                className="btn btn-primary mx-4 my-2"
                onClick={() => updateStatus(2)}
              >
                Zaakceptuj poziom 2
              </button>
            ) : null}
            {user.level > 2 ? (
              <button
                className="btn btn-danger mx-4 my-2"
                onClick={() => console.log(order)}
              >
                Odrzuć zamówienie
              </button>
            ) : null}
          </div>
          <hr />
          <div className="row">
            <div className="col-md">
              <h4 className="mx-4 mb-4">Podstawowe informacje</h4>
            </div>
            <div className="col-md">
              <h4 className="mx-4 mb-4">Dane firmy</h4>
            </div>
          </div>

          <div className="row">
            <div className="col-md mx-4">
              <dl className="row">
                <dt className="col-sm">Data zamówienia:</dt>
                <dd className="col-sm">{order.date_added}</dd>
              </dl>
            </div>
            <div className="col-md mx-4">
              <dl className="row">
                <dt className="col-sm">Nazwa firmy:</dt>
                <dd className="col-sm">{order.firma}</dd>
              </dl>
            </div>
          </div>
          <div className="row">
            <div className="col-md mx-4">
              <dl className="row">
                <dt className="col-sm">Rodzaj zamówienia:</dt>
                <dd className="col-sm">{order.rodzaj}</dd>
              </dl>
            </div>
            <div className="col-md mx-4">
              <dl className="row">
                <dt className="col-sm">Kontakt:</dt>
                <dd className="col-sm">{order.kontakt_osoba}</dd>
              </dl>
            </div>
          </div>
          <div className="row">
            <div className="col-md mx-4">
              <dl className="row">
                <dt className="col-sm">Dla działu:</dt>
                <dd className="col-sm">{order.dzial}</dd>
              </dl>
            </div>
            <div className="col-md mx-4">
              <dl className="row">
                <dt className="col-sm">Kontakt telefon:</dt>
                <dd className="col-sm">{order.kontakt_telefon}</dd>
              </dl>
            </div>
          </div>
          <div className="row">
            <div className="col-md mx-4">
              <dl className="row">
                <dt className="col-sm">Zamówienie dla:</dt>
                <dd className="col-sm">{order.ordered_by}</dd>
              </dl>
            </div>
            <div className="col-md mx-4">
              <dl className="row">
                <dt className="col-sm">Kontakt email:</dt>
                <dd className="col-sm">
                  <a href={"mailto:" + order.kontakt_email}>
                    {order.kontakt_email}
                  </a>
                </dd>
              </dl>
            </div>
          </div>
          <div className="row">
            <div className="col-md mx-4">
              <dl className="row">
                <dt className="col-sm">Zamówił:</dt>
                <dd className="col-sm">{order.user_added}</dd>
              </dl>
            </div>
            <div className="col-md mx-4"></div>
          </div>
          <div className="row">
            <div className="col-md mx-4">
              <dl className="row">
                <dt className="col-sm">Cel zakupu:</dt>
                <dd className="col-sm">{order.cel}</dd>
              </dl>
            </div>
            <div className="col-md mx-4"></div>
          </div>
          <hr />
          {user.level > 1 || user.login === order.initials ? (
            <>
              <ManageFiles user={user} order={order} />
              <hr />
            </>
          ) : null}

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
              Razem: {order.produkty.reduce((a, b) => a + b.cena, 0)} zł +{" "}
              {order.produkty.reduce((a, b) => a + b.koszt_wysylki, 0)} ZŁ
            </h4>
          </div>
        </div>
      )}
    </>
  );
}

export default Order;
