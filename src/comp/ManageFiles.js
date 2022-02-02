import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "bootstrap";

function ManageFiles({ user, order }) {
  const modalRef = useRef();

  const [deleteFile, setDeleteFile] = useState({});
  const [addFile, setAddFile] = useState();

  const confirmDelete = async () => {
    order.files = order.files.filter((file) => {
      return file.id !== deleteFile.id;
    });
    const req = await fetch(
      "http://localhost/eltwin_orders/api/api.php?type=deleteFile",
      {
        method: "POST",
        body: JSON.stringify({
          id: deleteFile.id,
          name: deleteFile.filename,
          user: user.login,
        }),
      }
    );

    const response = await req.ok;

    if (response) {
      setDeleteFile({});
      hideModal();
    }
  };

  const handleFileChange = (e) => {
    setAddFile(e.target.files[0]);
  };

  const handleAddFile = async () => {
    if (addFile) {
      const inputFile = document.querySelector("#file");

      console.log(addFile);

      const formData = new FormData();

      formData.append("file", addFile);

      const options = { method: "POST", body: formData };

      const req = await fetch(
        "http://localhost/eltwin_orders/api/api.php?type=uploadFiles&id=" +
          order.id +
          "&user=" +
          user.login,
        options
      );

      const response = await req.json();

      console.log(response.file);

      order.files.push(response.file);

      inputFile.value = null;

      setAddFile();
    } else {
      console.log("Wybierz plik");
    }
  };

  const showModal = () => {
    const modalEle = modalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };

  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };

  return (
    <>
      <div className="row">
        <div className="col m-4">
          <h4>Zarządzaj plikami</h4>
        </div>
      </div>
      <div className="mx-4">
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
          <tbody>
            {order.files.map((file) => {
              return (
                <tr key={file.id}>
                  <td>{file.filename}</td>
                  <td>{file.size} kB</td>
                  <td>{file.type}</td>
                  <td>{file.date_added}</td>
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
                      Pokaż
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setDeleteFile(file);
                        showModal();
                      }}
                    >
                      Usuń plik
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="row my-4">
          <div className="col-md-2">
            <h4>Dodaj plik:</h4>
          </div>
          <div className="col-md-4">
            <input
              type="file"
              name="file"
              id="file"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary" onClick={handleAddFile}>
              Dodaj plik
            </button>
          </div>
        </div>

        <div className="modal fade" ref={modalRef}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Plik: {deleteFile.filename}</h5>
              </div>
              <div className="modal-body">
                Czy na pewno chcesz skasować premanentnie plik: <br />
                {deleteFile.filename}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={confirmDelete}>
                  Tak, usuń plik
                </button>
                <button className="btn btn-danger" onClick={hideModal}>
                  Nie, nie chcę usuwać pliku
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageFiles;
