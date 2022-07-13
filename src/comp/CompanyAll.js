import React, { useRef, useState } from "react";
import { showModal, hideModal } from "../func/ModalToggle";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from "react-table";
import { Link } from "react-router-dom";

function CompanyAll({ companies, update }) {
  const modalRef = useRef();
  const editModalRef = useRef();

  function GlobalFilter({ globalFilter, setGlobalFilter }) {
    const [value, setValue] = useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
      setGlobalFilter(value || undefined);
    }, 200);

    return (
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Szukaj pośród ${companies.length} firm`}
        className="form-control"
      />
    );
  }

  function Table({ columns, data }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      // rows,
      prepareRow,
      state,
      visibleColumns,
      // preGlobalFilteredRows,
      setGlobalFilter,
      page, // Instead of using 'rows', we'll use page,
      // which has only the rows for the active page

      // The rest of these things are super handy, too ;)
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 10 },
        defaultCanSort: true,
      },

      useGlobalFilter,
      useSortBy,
      usePagination
    );

    return (
      <div className="container-fluid">
        <h2 className="m-4">Wszystkie firmy: {companies.length}</h2>
        <hr />
        <div className="row m-3">
          <table {...getTableProps()} className="table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <span> &#8595;</span>
                          ) : (
                            <span> &#8593;</span>
                          )
                        ) : (
                          " "
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
              <tr>
                <th colSpan={visibleColumns.length}>
                  <GlobalFilter
                    preGlobalFilteredRows={page}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                  />
                </th>
              </tr>
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()} className="align-middle">
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <nav className="text-center">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <Link
                to="/company"
                className="page-link"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                Pierwsza strona
              </Link>
            </li>
            <li className="page-item">
              <Link
                to="/company"
                className="page-link"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Poprzednia strona
              </Link>
            </li>
            <li className="page-item">
              <Link
                to="/company"
                className="page-link"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Następna strona
              </Link>
            </li>
            <li className="page-item">
              <Link
                to="/company"
                className="page-link"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                Ostatnia strona
              </Link>
            </li>
          </ul>
          <span>
            Strona{" "}
            <strong>
              {pageIndex + 1} z {pageOptions.length}
            </strong>{" "}
          </span>
          <select
            value={pageSize}
            className="form-control form-control mx-auto mt-4"
            style={{ width: "90px" }}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[1, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Pokaż {pageSize}
              </option>
            ))}
          </select>
        </nav>
      </div>
    );
  }

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
      <Table columns={columns} data={companies} />

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
