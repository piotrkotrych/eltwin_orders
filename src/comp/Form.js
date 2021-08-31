import { React, useState, useEffect } from "react";

function Form({ user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [rodzaje, setRodzaje] = useState();
  const [formValues, setFormValues] = useState({
    rodzaj: "",
    dzial: "",
    cel: "",
    firma: "",
    kontakt: "",
    produkty: [
      {
        indeks: "",
        nazwa: "",
        ilosc: null,
        jednostka: "",
        link: "",
        cena: "",
        uwagi: "",
      },
    ],
    ordered_by: user.name + " " + user.secondname,
    initials: user.login,
    email: user.email,
  });

  useEffect(() => {
    if (isLoading) {
      const getRodzajeDzialy = async () => {
        const get = await fetch(
          "http://localhost/eltwin_orders/api/api.php?type=getRodzajeDzialy"
        );
        const res = await get.json();
        setRodzaje(res);
        console.log(rodzaje);
        setIsLoading(false);
      };
      getRodzajeDzialy();
    } else {
      return () => {};
    }
  }, [rodzaje, isLoading]);

  function handleChange(e) {
    e.preventDefault();
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormValues((oldValues) => ({ ...oldValues, [name]: value }));
  }
  function handleChangeProdukt(i, e) {
    e.preventDefault();
    let newProdukty = [...formValues.produkty];
    newProdukty[i][e.target.name] = e.target.value;
    setFormValues((oldValues) => ({
      ...oldValues,
      produkty: newProdukty,
    }));
  }

  function addNewProdukt() {
    setFormValues((oldValues) => ({
      ...oldValues,
      produkty: [
        ...oldValues.produkty,
        {
          indeks: "",
          nazwa: "",
          ilosc: null,
          jednostka: "",
          link: "",
          cena: "",
          uwagi: "",
        },
      ],
    }));
  }

  function removeProdukt(i) {
    let newProdukty = [...formValues.produkty];
    newProdukty.splice(i, 1);
    setFormValues((oldValues) => ({ ...oldValues, produkty: newProdukty }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formValues);
  }

  return (
    <div className="container-fluid">
      {!isLoading ? (
        <div>
          <h2 className="m-4">Formularz zamówienia</h2>
          <form className="formularz m-4" onSubmit={handleSubmit}>
            <h4>Informacje ogólne</h4>
            <div className="row my-4">
              <div className="col-md">
                <div className="form-group">
                  <label htmlFor="#rodzaj" className="form-label">
                    Rodzaj zamówienia
                  </label>
                  <select
                    name="rodzaj"
                    id="rodzaj"
                    className="form-select"
                    onChange={handleChange}
                    required
                  >
                    <option value=""></option>
                    {rodzaje.map((e, index) => {
                      return (
                        <option key={index} value={e.rodzaj}>
                          {e.rodzaj}
                        </option>
                      );
                    })}
                  </select>
                  <div className="form-text">
                    Rodzaj zamówienia np. Administracyjne...
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="form-group">
                  <div className="form-group">
                    <label htmlFor="#dzial" className="form-label">
                      Wybierz dział
                    </label>
                    <select
                      name="dzial"
                      id="dzial"
                      className="form-select"
                      onChange={handleChange}
                      required
                    >
                      <option value=""></option>
                      {formValues.rodzaj.length > 0
                        ? rodzaje
                            .find(({ rodzaj }) => rodzaj === formValues.rodzaj)
                            .dzial.map((e, index) => {
                              return (
                                <option key={index} value={e}>
                                  {e}
                                </option>
                              );
                            })
                        : null}
                    </select>
                    <div className="form-text">
                      Wybierz dział, którego dotyczy zamówienie...
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="form-group">
                  <div className="form-group">
                    <label htmlFor="#rodzaj" className="form-label">
                      Zamawiający
                    </label>
                    <input
                      type="text"
                      name="ordered_by"
                      className="form-control"
                      value={formValues.ordered_by}
                      onChange={handleChange}
                      required
                    />
                    <div className="form-text">
                      Kto jest odbiorcą zamówienia...
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md">
                <div className="form-group">
                  <label htmlFor="#cel" className="form-label">
                    Cel zakupu
                  </label>
                  <input
                    type="text"
                    name="cel"
                    id="cel"
                    className="form-control"
                    value={formValues.cel}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">Dlaczego zamawiasz?</div>
                </div>
              </div>
              <div className="col-md">
                <div className="form-group">
                  <label htmlFor="#firma" className="form-label">
                    Dostawca
                  </label>
                  <input
                    type="text"
                    name="firma"
                    id="firma"
                    className="form-control"
                    value={formValues.firma}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">Nazwa firmy...</div>
                </div>
              </div>
              <div className="col-md">
                <div className="form-group">
                  <label htmlFor="#kontakt" className="form-label">
                    Dane kontaktowe
                  </label>
                  <input
                    type="text"
                    name="kontakt"
                    id="kontakt"
                    className="form-control"
                    value={formValues.kontakt}
                    onChange={handleChange}
                  />
                  <div className="form-text">
                    Osoba, numer telefonu, email itp.
                  </div>
                </div>
              </div>
            </div>
            <h4 className="my-4">Zamawiane produkty</h4>
            {formValues.produkty.map((e, index) => {
              return (
                <div className="produkt my-5" key={index}>
                  <h4>Produkt {index + 1}:</h4>
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label htmlFor="#indeks" className="form-label">
                          Indeks
                        </label>
                        <input
                          type="text"
                          name="indeks"
                          id="indeks"
                          className="form-control"
                          value={e.indeks}
                          onChange={(e) => handleChangeProdukt(index, e)}
                        />
                        <div className="form-text">Indeks produktu</div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="#nazwa" className="form-label">
                          Nazwa
                        </label>
                        <input
                          type="text"
                          name="nazwa"
                          id="nazwa"
                          className="form-control"
                          value={e.nazwa}
                          onChange={(e) => handleChangeProdukt(index, e)}
                        />
                      </div>
                      <div className="form-text">Nazwa produktu</div>
                    </div>
                    <div className="col-md">
                      <div className="form-group">
                        <label htmlFor="#link" className="form-label">
                          Link
                        </label>
                        <input
                          type="text"
                          name="link"
                          id="link"
                          className="form-control"
                          value={e.link}
                          onChange={(e) => handleChangeProdukt(index, e)}
                        />
                        <div className="form-text">
                          Wklej link do strony www z ofertą
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row my-4">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label htmlFor="#ilosc" className="form-label">
                          Ilość
                        </label>
                        <input
                          type="text"
                          name="ilosc"
                          id="ilosc"
                          className="form-control"
                          value={e.ilosc || ""}
                          onChange={(e) => handleChangeProdukt(index, e)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label htmlFor="#jednostka" className="form-label">
                          Jednostka
                        </label>
                        <input
                          type="text"
                          name="jednostka"
                          id="jednostka"
                          className="form-control"
                          value={e.jednostka}
                          onChange={(e) => handleChangeProdukt(index, e)}
                        />
                        <div className="form-text">
                          Jednostka miary np. sztuki, kg, metry itp.
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label htmlFor="#cena" className="form-label">
                          Cena netto + wysyłka
                        </label>
                        <input
                          type="text"
                          name="cena"
                          id="cena"
                          className="form-control"
                          value={e.cena}
                          onChange={(e) => handleChangeProdukt(index, e)}
                        />
                        <div className="form-text">
                          Cena netto i jeżeli to możliwe koszt wysyłki
                        </div>
                      </div>
                    </div>
                    <div className="col-md">
                      <div className="form-group">
                        <label htmlFor="#uwagi" className="form-label">
                          Uwagi
                        </label>
                        <input
                          type="text"
                          name="uwagi"
                          id="uwagi"
                          className="form-control"
                          value={e.uwagi}
                          onChange={(e) => handleChangeProdukt(index, e)}
                        />
                        <div className="form-text">
                          Uwagi, dodatkowe informacje...
                        </div>
                      </div>
                    </div>
                    {index ? (
                      <div className="col-md-2">
                        <div className="form-group">
                          <label htmlFor="#opcje" className="form-label">
                            Opcje
                          </label>
                          <button
                            className="btn btn-danger form-control"
                            id="opcje"
                            onClick={() => removeProdukt(index)}
                          >
                            Usuń produkt
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <hr className="bg-primary" />
                </div>
              );
            })}
            <div className="row my-4">
              <div className="col-md-2">
                <button
                  className="btn btn-primary mb-3"
                  onClick={() => addNewProdukt()}
                >
                  Dodaj kolejny produkt
                </button>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary">
                  Wyślij formularz
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center">
          <div
            className="spinner-border"
            style={{ width: "10rem", height: "10rem", marginTop: "20vh" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h1 className="mt-3" style={{ fontSize: "40px" }}>
            Wczytuję dane...
          </h1>
        </div>
      )}
    </div>
  );
}

export default Form;
