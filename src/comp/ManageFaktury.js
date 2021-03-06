import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { showModal, hideModal } from "../func/ModalToggle";

function ManageFaktury({ user, order, updateLog }) {
  const modalAdd = useRef();
  const modalDelete = useRef();

  const [deleteFile, setDeleteFile] = useState({});
  const [addFile, setAddFile] = useState();

  const confirmDelete = async () => {
    order.faktury = order.faktury.filter((file) => {
      return file.id !== deleteFile.id;
    });
    const req = await fetch(
      "http://localhost/eltwin_orders/api/api.php?type=deleteFile",
      {
        method: "POST",
        body: JSON.stringify({
          id: deleteFile.id,
          form_id: order.id,
          firma_id: order.firma_id,
          name: deleteFile.filename,
          user: user.login,
          table: "orders_invoice",
        }),
      }
    );

    const response = await req.ok;

    if (response) {
      setDeleteFile({});
      updateLog(order.id);
      hideModal(modalDelete);
    }
  };

  const handleFileChange = (e) => {
    setAddFile(e.target.files[0]);
  };

  const handleAddFile = async (proforma) => {
    if (addFile) {
      const inputFile = document.querySelector("#faktura");

      console.log(addFile);

      const formData = new FormData();

      formData.append("faktura", addFile);
      formData.append("firma_id", order.firma_id);
      formData.append("nip", order.nip);

      const options = { method: "POST", body: formData };

      const req = await fetch(
        "http://localhost/eltwin_orders/api/api.php?type=uploadInvoice&id=" +
          order.id +
          "&user=" +
          user.login +
          "&pro=" +
          proforma,
        options
      );

      const response = await req.json();

      console.log(response);

      order.faktury.push(response.faktura);
      hideModal(modalAdd);
      inputFile.value = null;

      setAddFile();
      updateLog(order.id);
    } else {
      alert("Wybierz plik...");
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col m-4">
          <h4>Zarz??dzaj fakturami</h4>
        </div>
      </div>
      <div className="mx-4">
        {order.faktury && order.faktury.length > 0 ? (
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Nazwa pliku</th>

                <th scope="col">Rodzaj faktury</th>
                <th scope="col">Data dodania</th>
                <th scope="col">Rozmiar pliku</th>
                <th scope="col">Doda??</th>
                <th scope="col">Podgl??d</th>
                {user.login === order.initials || user.level > 1 ? (
                  <th scope="col">Usu?? faktur??</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {order.faktury.map((file) => {
                return (
                  <tr key={file.id}>
                    <td>{file.filename}</td>

                    <td>{file.rodzaj ? "Do zap??aty" : "Proforma"}</td>
                    <td>{file.date_added}</td>
                    <td>{file.size} kB</td>
                    <td>{file.user}</td>
                    <td>
                      <Link
                        to={{
                          pathname:
                            "http://localhost/eltwin_orders/upload/" +
                            file.filename,
                        }}
                        target="_blank"
                      >
                        Poka??
                      </Link>
                    </td>
                    {user.login === order.initials || user.level > 1 ? (
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            setDeleteFile(file);
                            showModal(modalDelete);
                          }}
                        >
                          Usu?? faktur??
                        </button>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}

        <div className="row my-4">
          <div className="col-md-2">
            <h4>Dodaj faktur??:</h4>
          </div>
          <div className="col-md-4">
            <input
              type="file"
              name="faktura"
              id="faktura"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                showModal(modalAdd);
                console.log(addFile);
              }}
            >
              Dodaj faktur??
            </button>
          </div>
        </div>
      </div>

      <div className="modal fade" ref={modalAdd}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Faktura: {addFile ? addFile.name : null}
              </h5>
            </div>
            <div className="modal-body">
              Wybierz rodzaj faktury przed dodaniem do zam??wienia:{" "}
              <b>{addFile ? addFile.name : null}</b>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleAddFile(1);
                }}
              >
                Dodaj faktur?? do zap??aty
              </button>
              <button
                className="btn btn-warning"
                onClick={() => {
                  handleAddFile(0);
                }}
              >
                Dodaj faktur?? proform??
              </button>
              <button
                className="btn btn-danger"
                onClick={() => hideModal(modalAdd)}
              >
                Nie, nie chc?? doda?? faktury
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" ref={modalDelete}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Chcesz usun???? faktur??: {deleteFile.filename}
              </h5>
            </div>
            <div className="modal-body">
              Czy na pewno checesz premanentnie usun??c faktur??:{" "}
              <b>{deleteFile.filename}</b>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={confirmDelete}>
                Tak, chce usun???? t?? faktur??
              </button>
              <button
                className="btn btn-danger"
                onClick={() => hideModal(modalDelete)}
              >
                Nie, nie chc?? usuwa?? tej faktury
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default ManageFaktury;
