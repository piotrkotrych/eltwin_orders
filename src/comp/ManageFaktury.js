import React, { useRef } from "react";
import { showModal, hideModal } from "../func/ModalToggle";

function ManageFaktury({ user, order }) {
  const modalRef = useRef();

  return (
    <div>
      <div className="row">
        <div className="col m-4">
          <h4>Zarządzaj fakturami</h4>
        </div>
      </div>
      <div className="mx-4">
        {order.files.length > 0 ? (
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Nazwa pliku</th>
                <th scope="col">Rozmiar pliku</th>
                <th scope="col">Typ pliku</th>
                <th scope="col">Data dodania</th>
                <th scope="col">Dodał</th>
                <th scope="col">Podgląd</th>
                <th scope="col">Usuń plik</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        ) : null}

        <div className="row my-4">
          <div className="col-md-2">
            <h4>Dodaj plik:</h4>
          </div>
          <div className="col-md-4">
            <input type="file" name="file" id="file" className="form-control" />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-primary"
              onClick={() => showModal(modalRef)}
            >
              Dodaj fakturę
            </button>
          </div>
        </div>
      </div>

      <div className="modal fade" ref={modalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <button
              className="btn btn-danger"
              onClick={() => hideModal(modalRef)}
            >
              Nie, nie chcę usuwać pliku
            </button>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default ManageFaktury;
