import React, { useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from "react-table";
// import Loading from "./Loading";
import { Link } from "react-router-dom";

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
      placeholder={`Filtruj wszystkie wpisy...`}
      className="form-control"
    />
  );
}

export default function Table({ columns, data, title }) {
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
      <h2 className="m-4">{title}:</h2>
      <hr />
      <div className="row m-3">
        <table {...getTableProps()} className="table table-bordered">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
              to={window.location}
              className="page-link"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              Pierwsza strona
            </Link>
          </li>
          <li className="page-item">
            <Link
              to={window.location}
              className="page-link"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              Poprzednia strona
            </Link>
          </li>
          <li className="page-item">
            <Link
              to={window.location}
              className="page-link"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Następna strona
            </Link>
          </li>
          <li className="page-item">
            <Link
              to={window.location}
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
