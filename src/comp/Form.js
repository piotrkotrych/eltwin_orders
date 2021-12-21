import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Form({ user, edit }) {
  let { editId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [alert, setAlert] = useState(null);
  const [rodzaje, setRodzaje] = useState();
  const [jednostki] = useState([
    "sztuki",
    "metry",
    "centymetry",
    "kilogramy",
    "gram",
    "litry",
    "mililitry",
  ]);
  const [formValues, setFormValues] = useState({
    rodzaj: "",
    dzial: "",
    cel: "",
    firma: "",
    kontakt_osoba: "",
    kontakt_email: "",
    kontakt_telefon: "",
    produkty: [
      {
        id: null,
        indeks: "",
        nazwa: "",
        ilosc: null,
        jednostka: "",
        link: "",
        cena: "",
        koszt_wysylki: "",
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
          "http://10.47.8.62/eltwin_orders/api/api.php?type=getRodzajeDzialy"
        );
        const res = await get.json();
        setRodzaje(res);
        console.log(rodzaje);
        if (editId) {
          const editForm = async () => {
            const get = await fetch(
              "http://10.47.8.62/eltwin_orders/api/api.php?type=editForm&id=" +
                editId
            );
            const res = await get.json();
            console.log(res[0]);
            setFormValues(res[0]);
            setIsLoading(false);
          };
          editForm();
        } else {
          setIsLoading(false);
        }
      };

      getRodzajeDzialy();
    } else {
      return () => {};
    }
  }, [editId, isLoading, rodzaje]);

  const handleChange = (e) => {
    e.preventDefault();
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormValues((oldValues) => ({ ...oldValues, [name]: value }));
  };
  const handleChangeProdukt = (i, e) => {
    e.preventDefault();
    let newProdukty = [...formValues.produkty];
    newProdukty[i][e.target.name] = e.target.value;
    setFormValues((oldValues) => ({
      ...oldValues,
      produkty: newProdukty,
    }));
  };

  const addNewProdukt = () => {
    setFormValues((oldValues) => ({
      ...oldValues,
      produkty: [
        ...oldValues.produkty,
        {
          id: null,
          indeks: "",
          nazwa: "",
          ilosc: null,
          jednostka: "",
          link: "",
          cena: "",
          koszt_wysylki: "",
          uwagi: "",
        },
      ],
    }));
  };

  const removeProdukt = (i) => {
    let newProdukty = [...formValues.produkty];
    newProdukty.splice(i, 1);
    setFormValues((oldValues) => ({ ...oldValues, produkty: newProdukty }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!edit) {
      const submit = async () => {
        setIsSubmit(true);
        const options = {
          method: "POST",
          body: JSON.stringify(formValues),
        };
        const req = await fetch(
          "http://10.47.8.62/eltwin_orders/api/api.php?type=postFormData",
          options
        );

        const res = await req.ok;
        console.log(res);
        if (res) {
          setIsSubmit(false);
          setAlert({
            text: "Formularz został wysłany do akceptacji",
            type: "success",
          });
          setFormValues({
            rodzaj: "",
            dzial: "",
            cel: "",
            firma: "",
            kontakt_osoba: "",
            kontakt_email: "",
            kontakt_telefon: "",
            produkty: [
              {
                id: null,
                indeks: "",
                nazwa: "",
                ilosc: null,
                jednostka: "",
                link: "",
                cena: "",
                koszt_wysylki: "",
                uwagi: "",
              },
            ],
            ordered_by: user.name + " " + user.secondname,
            initials: user.login,
            email: user.email,
          });
        } else {
          setAlert({
            text: "Błąd dodawania formularza, skontaktuj się z pko@eltwin.com",
            type: "danger",
          });
          setIsSubmit(false);
        }
      };
      submit();
    } else {
      console.log("Test edycji");
      const update = async () => {
        setIsSubmit(true);
        const options = {
          method: "POST",
          body: JSON.stringify(formValues),
        };
        const req = await fetch(
          "http://10.47.8.62/eltwin_orders/api/api.php?type=updateFormData&id=" +
            editId +
            "&user_modify=" +
            user.name +
            " " +
            user.secondname,
          options
        );

        const res = await req.ok;
        console.log(res);
        if (res) {
          setIsSubmit(false);
          setAlert({
            text: "Formularz numer " + editId + " został zaktualizowany",
            type: "success",
          });
        } else {
          setAlert({
            text: "Błąd aktualizacji formularza, skontaktuj się z pko@eltwin.com",
            type: "danger",
          });
          setIsSubmit(false);
        }
      };
      update();
    }
  };

  const clearAlert = () => {
    setAlert(null);
  };

  return (
    <div className="container-fluid">
      {!isLoading ? (
        <div>
          {alert ? (
            <>
              <div
                className={
                  "m-4 alert-dismissible fade show alert alert-" + alert.type
                }
                role="alert"
              >
                {alert.text}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={clearAlert}
                ></button>
              </div>
            </>
          ) : null}
          <h2 className="m-4">
            Formularz zamówienia {editId ? " numer " + editId : null}
          </h2>
          <hr />
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
                    value={formValues.rodzaj}
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
                      value={formValues.dzial}
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
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="#kontakt_osoba" className="form-label">
                    Dane kontaktowe: osoba
                  </label>
                  <input
                    type="text"
                    name="kontakt_osoba"
                    id="kontakt_osoba"
                    className="form-control"
                    value={formValues.kontakt_osoba}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-1">
                <div className="form-group">
                  <label htmlFor="#kontakt_email" className="form-label">
                    email
                  </label>
                  <input
                    type="email"
                    name="kontakt_email"
                    id="kontakt_email"
                    className="form-control"
                    value={formValues.kontakt_email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-1">
                <div className="form-group">
                  <label htmlFor="#kontakt_telefon" className="form-label">
                    telefon
                  </label>
                  <input
                    type="tel"
                    name="kontakt_telefon"
                    id="kontakt_telefon"
                    className="form-control"
                    value={formValues.kontakt_telefon}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <h4 className="my-4">Zamawiane produkty</h4>
            {formValues.produkty.map((e, index) => {
              return (
                <div className="produkt my-5" key={index}>
                  <h4>Produkt: {e.nazwa ? e.nazwa : index + 1}</h4>
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
                          required
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
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label htmlFor="#jednostka" className="form-label">
                          Jednostka
                        </label>
                        <select
                          name="jednostka"
                          id="jednostka"
                          className="form-select"
                          value={e.jednostka}
                          onChange={(e) => handleChangeProdukt(index, e)}
                          required
                        >
                          <option value=""></option>
                          {jednostki.map((e, index) => {
                            return (
                              <option key={index} value={e}>
                                {e}
                              </option>
                            );
                          })}
                        </select>
                        <div className="form-text">Jednostka miary...</div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label htmlFor="#cena" className="form-label">
                          Cena netto
                        </label>
                        <input
                          type="text"
                          name="cena"
                          id="cena"
                          className="form-control"
                          value={e.cena}
                          onChange={(e) => handleChangeProdukt(index, e)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label htmlFor="#koszt_wysylki" className="form-label">
                          Koszt wysyłki
                        </label>
                        <input
                          type="text"
                          name="koszt_wysylki"
                          id="koszt_wysylki"
                          className="form-control"
                          value={e.koszt_wysylki}
                          onChange={(e) => handleChangeProdukt(index, e)}
                        />
                        <div className="form-text">Jeżeli możliwe</div>
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
                  <hr />
                </div>
              );
            })}
            {isSubmit ? (
              <div className="row my-4">
                <div className="col-md-2">
                  <button
                    className="btn btn-primary mb-3 form-control"
                    disabled
                  >
                    Dodaj kolejny produkt
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    disabled
                    className="btn btn-primary form-control"
                  >
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span className="px-3">
                      {edit ? "Aktualizuję" : "Wysyłam formularz"}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="row my-4">
                <div className="col-md-2">
                  <button
                    className="btn btn-primary mb-3 form-control"
                    onClick={() => addNewProdukt()}
                  >
                    Dodaj kolejny produkt
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    type="submit"
                    className="btn btn-primary form-control"
                  >
                    {edit ? "Aktualizuj zamówienie" : "Wyślij formularz"}
                  </button>
                </div>
              </div>
            )}
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
