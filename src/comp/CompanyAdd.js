import React, { useState } from "react";

function CompanyAdd() {
  const [addCompany, setAddCompany] = useState({
    firma: "",
    nip: "",
    www: "",
    kontakt_osoba: "",
    kontakt_email: "",
    kontakt_telefon: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddCompany({ ...addCompany, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(addCompany);
  };

  return (
    <>
      <h4 className="m-4">Dodaj firmę:</h4>

      <form className="form m-4" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="#firma" className="form-label">
                Nazwa firmy
              </label>
              <input
                type="text"
                name="firma"
                id="firma"
                className="form-control"
                onChange={handleChange}
                value={addCompany.firma}
                placeholder="Nazwa firmy np. Eltwin"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="#nip" className="form-label">
                NIP
              </label>
              <input
                type="text"
                name="nip"
                id="nip"
                className="form-control"
                onChange={handleChange}
                value={addCompany.nip}
                placeholder="123456789"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="#www" className="form-label">
                Adres WWW
              </label>
              <input
                type="text"
                name="www"
                id="www"
                className="form-control"
                onChange={handleChange}
                value={addCompany.www}
                placeholder="http://www.eltwin.pl"
              />
            </div>
          </div>
        </div>
        <div className="row my-4">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="#kontakt_osoba" className="form-label">
                Kontakt osoba
              </label>
              <input
                type="text"
                name="kontakt_osoba"
                id="kontakt_osoba"
                className="form-control"
                onChange={handleChange}
                value={addCompany.kontakt_osoba}
                placeholder="Jan Kowalski"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="#kontakt_email" className="form-label">
                Kontakt email
              </label>
              <input
                type="text"
                name="kontakt_email"
                id="kontakt_email"
                className="form-control"
                onChange={handleChange}
                value={addCompany.kontakt_email}
                placeholder="jan.kowalski@eltwin.pl"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="#kontakt_telefon" className="form-label">
                Kontakt telefon
              </label>
              <input
                type="text"
                name="kontakt_telefon"
                id="kontakt_telefon"
                className="form-control"
                onChange={handleChange}
                value={addCompany.kontakt_telefon}
                placeholder="+48 123 456 789"
              />
            </div>
          </div>
        </div>
        <div className="row my-4">
          <div className="col-md-4">
            <button type="submit" className="btn btn-primary btn-block">
              Dodaj firmę
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default CompanyAdd;
