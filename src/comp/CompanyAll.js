import React, { useRef, useState } from "react";
import { showModal, hideModal } from "../func/ModalToggle";
import { Link } from "react-router-dom";
import Table from "./Table";

function CompanyAll({ companies, update }) {
  const modalRef = useRef();
  const editModalRef = useRef();

  const columns = [
    {
      Header: "Numer firmy",
      accessor: "firma_id",
      Cell: (row) => (
        <div className="">
          <Link to={`/company/${row.value}`}>Firma {row.value}</Link>
        </div>
      ),
    },
    {
      Header: "Nazwa firmy",
      accessor: "firma",
    },
    {
      Header: "NIP",
      accessor: "nip",
    },
    {
      Header: "Adres WWW",
      accessor: "www",
    },
    {
      Header: "Adres email",
      accessor: "kontakt_email",
    },
    {
      Header: "Numer telefonu",
      accessor: "kontakt_telefon",
    },
    {
      Header: "Osoba kontaktowa",
      accessor: "kontakt_osoba",
    },
    {
      Header: "Opcje",
      accessor: (row) => row.firma_id,
      Cell: (row) => (
        <div className="btn-group input-group">
          <button
            className="btn btn-primary"
            onClick={() => editCompany(row.value)}
          >
            Edytuj
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              deleteCompany(row.value);
            }}
          >
            Usuń
          </button>
        </div>
      ),
    },
  ];

  const [deleteFirma, setDeleteFirma] = useState({});
  const [editFirma, setEditFirma] = useState({
    firma_id: null,
    firma: "",
    nip: "",
    www: "",
    kontakt_osoba: "",
    kontakt_email: "",
    kontakt_telefon: "",
  });
  const [alert, setAlert] = useState(null);

  const deleteCompany = (id) => {
    console.log(id);
    showModal(modalRef);
    companies.map((company) => {
      if (company.firma_id === id) {
        setDeleteFirma(company);
        return null;
      }
      return null;
    });
  };

  const editCompany = (id) => {
    console.log(id);
    showModal(editModalRef);
    companies.map((company) => {
      if (company.firma_id === id) {
        setEditFirma(company);
        return null;
      }
      return null;
    });
  };

  const clearAlert = () => {
    setAlert(null);
  };

  const confirmDelete = async () => {
    const response = await fetch(
      "http://127.0.0.1/eltwin_orders/api/api.php?type=deleteCompany&id=" +
        deleteFirma.firma_id
    );
    const data = await response.json();
    if (data.success) {
      setAlert({
        type: "success",
        text: data.success,
      });
      hideModal(modalRef);
      setDeleteFirma({});
      update();
    } else if (data.error) {
      hideModal(modalRef);
      setAlert({
        type: "danger",
        text: data.error,
      });
    }
  };

  const confirmEdit = async () => {
    const response = await fetch(
      "http://127.0.0.1/eltwin_orders/api/api.php?type=updateCompany",
      {
        method: "POST",
        body: JSON.stringify(editFirma),
      }
    );
    const data = await response.json();
    if (data.success) {
      setAlert({
        type: "success",
        text: data.success,
      });
      hideModal(editModalRef);
      setEditFirma({
        firma_id: null,
        firma: "",
        nip: "",
        www: "",
        kontakt_osoba: "",
        kontakt_email: "",
        kontakt_telefon: "",
      });
      update();
    } else if (data.error) {
      hideModal(editModalRef);
      setAlert({
        type: "danger",
        text: data.error,
      });
    }
  };

  return (
    <>
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
      <Table
        columns={columns}
        data={companies}
        title={`Wszystkie firmy: ${companies.length}`}
      />

      <div className="modal fade" ref={modalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Usuń firmę: {deleteFirma.firma}</h5>
            </div>
            <div className="modal-body">
              Czy na pewno chcesz usunąć premanentnie firmę: <br />
              <b>{deleteFirma.firma}</b>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={confirmDelete}>
                Tak, usuń firmę
              </button>
              <button
                className="btn btn-danger"
                onClick={() => hideModal(modalRef)}
              >
                Nie, nie chcę usuwać tej firmy
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" ref={editModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edytuj firmę: {editFirma.firma}</h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group mb-2">
                  <label htmlFor="firma">Nazwa firmy</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    id="firma"
                    placeholder="Nazwa firmy"
                    value={editFirma.firma}
                    onChange={(e) =>
                      setEditFirma({
                        ...editFirma,
                        firma: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="www">Adres WWW</label>
                  <input
                    type="text"
                    className="form-control"
                    id="www"
                    placeholder="Adres WWW"
                    value={editFirma.www}
                    onChange={(e) =>
                      setEditFirma({ ...editFirma, www: e.target.value })
                    }
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="nip">NIP</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nip"
                    placeholder="NIP"
                    value={editFirma.nip}
                    onChange={(e) =>
                      setEditFirma({ ...editFirma, nip: e.target.value })
                    }
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="kontakt_osoba">Osoba kontaktowa</label>
                  <input
                    type="text"
                    className="form-control"
                    id="kontakt_osoba"
                    placeholder="Osoba do kontaktu"
                    value={editFirma.kontakt_osoba}
                    onChange={(e) =>
                      setEditFirma({
                        ...editFirma,
                        kontakt_osoba: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="kontakt_email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="kontakt_email"
                    placeholder="Adres email"
                    value={editFirma.kontakt_email}
                    onChange={(e) =>
                      setEditFirma({
                        ...editFirma,
                        kontakt_email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="kontakt_telefon">Telefon</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="kontakt_telefon"
                    placeholder="Numer telefonu"
                    value={editFirma.kontakt_telefon}
                    onChange={(e) =>
                      setEditFirma({
                        ...editFirma,
                        kontakt_telefon: e.target.value,
                      })
                    }
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={confirmEdit}>
                Aktualizuj firmę
              </button>
              <button
                className="btn btn-danger"
                onClick={() => hideModal(editModalRef)}
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyAll;
