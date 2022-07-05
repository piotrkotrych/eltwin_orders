import React, { useState, useEffect } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from "react-table";
import Loading from "./Loading";
import { Link } from "react-router-dom";

function Orders({ user, statusy }) {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState();
  const [status] = useState(statusy);

  useEffect(() => {
    if (isLoading) {
      const getAllOrders = async () => {
        const get = await fetch(
          "http://127.0.0.1/eltwin_orders/api/api.php?type=getAllOrders"
        );
        const res = await get.json();
        setOrders(res);
        console.log(orders);
        setIsLoading(false);
      };
      getAllOrders();
    } else {
      return () => {};
    }
  }, [orders, isLoading]);

  console.log(user.login);
  console.log(status);

  function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const countRows = preGlobalFilteredRows.length;
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
        placeholder={`Szukaj w ${countRows} zamówieniach`}
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
        <h2 className="m-4">Wszystkie zamówienia: {orders.length}</h2>
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
                to="/orders"
                className="page-link"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                Pierwsza strona
              </Link>
            </li>
            <li className="page-item">
              <Link
                to="/orders"
                className="page-link"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Poprzednia strona
              </Link>
            </li>
            <li className="page-item">
              <Link
                to="/orders"
                className="page-link"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Następna strona
              </Link>
            </li>
            <li className="page-item">
              <Link
                to="/orders"
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
      Header: "Numer zamówienia",
      accessor: "id",
      Cell: (row) => (
        <div className="">
          <Link to={`/order/${row.value}`}>Zamówienie {row.value}</Link>
        </div>
      ),
      sortType: "basic",
    },
    {
      Header: "Data",
      accessor: "date_added",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (row) => <b>{status[row.value]}</b>,
    },
    {
      Header: "Dział",
      accessor: "dzial",
    },
    {
      Header: "Rodzaj",
      accessor: "rodzaj",
    },
    {
      Header: "Zamówił/a",
      accessor: (row) => {
        return [row.ordered_by, row.initials];
      },
      Cell: (row) => (
        <div className="">
          <Link to={`/user/${row.value[1]}`}>{row.value}</Link>
        </div>
      ),
    },
    {
      Header: "Firma",
      accessor: "firma",
    },
    {
      Header: "Produkty",
      accessor: (row) => {
        return row.produkty.map((produkt) => {
          return [produkt.nazwa, produkt.ilosc, produkt.jednostka];
        });
      },
      Cell: (row) => {
        return row.value.map((produkt, index) => {
          return (
            <div className="" key={index}>
              <div className="">
                <b>{produkt[0]}</b>
              </div>
              <div className="">
                {produkt[1]} {produkt[2]}
              </div>
            </div>
          );
        });
      },
    },
    {
      Header: "Koszt",
      accessor: (row) => {
        return row.produkty
          .map((produkt) => {
            return produkt.cena * produkt.ilosc;
          })
          .reduce((a, b) => parseFloat(a + b), 0);
      },
      Cell: (row) => <div className="">{row.value.toFixed(2)}</div>,

      sortType: "basic",
    },
    {
      Header: "Waluta",
      accessor: "waluta",
    },
  ];

  return (
    <>{isLoading ? <Loading /> : <Table columns={columns} data={orders} />}</>
  );
}

export default Orders;
