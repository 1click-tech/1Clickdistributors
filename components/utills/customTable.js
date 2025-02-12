import React, { useEffect, useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
  useColumnOrder,
  useGlobalFilter,
} from "react-table";
import { camelToTitle } from "./commonFunctions";
import ColumnOrderControl from "./columnOrderControl";
import { MdClose } from "react-icons/md";
import Modal from "./Modal";
import { cellColors } from "@/lib/data/commonData";

// icons
import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { TfiControlBackward } from "react-icons/tfi";
import { TfiControlForward } from "react-icons/tfi";

// Default UI for filtering
const DefaultColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows },
}) => (
  <input
    value={filterValue || ""}
    onChange={(e) => setFilter(e.target.value || undefined)} // Set undefined to remove the filter
    className="mt-1 p-1 border rounded w-full"
    placeholder={`Search ${preFilteredRows?.length} data`}
  />
);

const CustomTable = ({
  uniqueDataKey,
  data,
  avoidCols,
  setSelectedRows,
  selectedRows,
  columns,
  openModal,
  closeModal,
  searchValue,
}) => {
  const [uniqueKey, setUniqueKey] = useState(uniqueDataKey);
  useEffect(() => {
    if (uniqueDataKey) {
      setUniqueKey(uniqueDataKey);
    }
  }, [uniqueDataKey]);

  const [selectedLeadForPopup, setSelectedLeadForPopup] = useState(false);
  const [selectedTypeToShow, setSelectedTypeToShow] = useState(null);

  const tableData = useMemo(() => data, [data]);

  const defaultColumn = useMemo(
    () => ({
      // Filter: DefaultColumnFilter,
      maxWidth: 400,
      width: 150,
    }),
    []
  );

  const getRowProps = (row) => {
    return {
      onClick: () => {
        if (uniqueKey) {
          let filtered = selectedRows?.filter(
            (item) => item[uniqueKey] == row[uniqueKey]
          );
          if (filtered.length > 0) {
            setSelectedRows((pre) =>
              pre.filter((item) => item[uniqueKey] !== row[uniqueKey])
            );
          } else {
            setSelectedRows((pre) => [...pre, row]);
          }
        }
      },
      className: `cursor-pointer ${
        selectedRows?.filter((item) => item[uniqueKey] == row[uniqueKey])
          ?.length > 0
          ? "bg-gray-200"
          : "bg-white"
      } hover:bg-gray-200`,
    };
  };

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      defaultColumn,
      autoResetFilters: false,
      initialState: { pageIndex: 0, pageSize: 50 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useColumnOrder
  );

  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    setColumnOrder,
    state,
    resetResizing,
    toggleHideColumn,
    allColumns,
    getToggleHideAllColumnsProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    flatColumns,
    visibleColumns,
    setPageSize,
    filteredRows,
    state: { pageIndex, pageSize },
  } = tableInstance;

  useEffect(() => {
    setGlobalFilter(searchValue);
  }, [searchValue]);

  const getCellStyle = (name) => {
    const cellName = name === "Followup" ? "FollowUp" : name;
    const color = cellColors[cellName];

    return {
      backgroundColor: color || "#2A80B9",
      color: "white",
    };
  };

  const wrapUpCols = [
    "Requirement",
    "whats_is_your_requirement_?_write_in_brief",
    "Query",
    "remarks",
    "Remarks",
  ];
  return (
    <div className="h-full flex flex-col justify-between">
      {openModal && (
        <Modal>
          <div className="h-[70vh] p-4  min-w-[90vw] md:min-w-[25vw] bg-white rounded-md pt-9 relative">
            <button className="top-1 right-4 absolute" onClick={closeModal}>
              <MdClose className="text-red-500 text-3xl" />
            </button>

            <ColumnOrderControl
              allColumns={allColumns}
              setColumnOrder={setColumnOrder}
              toggleHideColumn={toggleHideColumn}
              close={closeModal}
            />
          </div>
        </Modal>
      )}
      {selectedLeadForPopup && (
        <Modal>
          <div className="p-4 min-w-[20vw] max-w-[90vw] md:max-w-[45vw] bg-white rounded-md relative">
            <button
              className="top-1 right-4 absolute"
              onClick={() => setSelectedLeadForPopup(null)}
            >
              <MdClose className="text-red-500 text-3xl" />
            </button>

            <div className="p-2 flex flex-col gap-3">
              <h1 className="font-semibold">
                {selectedTypeToShow == "remarks" ? "Remarks" : "Query"}
              </h1>
              <p className="text-gray-500">
                {selectedLeadForPopup[selectedTypeToShow] || "Nothing to show"}
              </p>
            </div>
          </div>
        </Modal>
      )}
      <div className="overflow-auto h-[93%] scrollbar-thin">
        <table
          {...getTableProps()}
          className="min-w-full divide-y mt-1 divide-gray-200 max-h-[98%]"
        >
          <thead className="bg-blue-100 sticky top-0">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="p-1 cursor-pointer w-fit max-w-[200px]"
                  >
                    <div className="flex flex-col">
                      <div className="flex gap-2 px-2 text-sm font-[Figtree] font-[600]">
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </div>
                      {/* <div className="w-full">
                        {column.canFilter ? column.render("Filter") : null}
                      </div> */}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps(getRowProps(row?.original))}
                  className="odd:bg-gray-100"
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={
                        cell?.column?.Header == "Disposition"
                          ? getCellStyle(cell.value)
                          : {}
                      }
                      className="whitespace-nowrap px-2 text-[12px] max-w-[185px] border border-gray-300 overflow-hidden text-gray-700 scrollbar-thin"
                    >
                      <div
                        className={`capitalize ${
                          wrapUpCols?.includes(cell?.column?.Header)
                            ? "max-w-[280px]"
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            cell?.column?.id == "remarks" ||
                            cell?.column?.id ==
                              "whats_is_your_requirement_?_write_in_brief"
                          ) {
                            setSelectedLeadForPopup(cell?.row?.original);
                            setSelectedTypeToShow(cell.column.id);
                          }
                        }}
                      >
                        {cell.value &&
                        typeof cell.value != "object" &&
                        cell?.column?.id != "profileId" ? (
                          <HighlightText
                            text={cell.value || ""}
                            searchValue={searchValue}
                          />
                        ) : (
                          cell.render("Cell") // Use default render function for other columns
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data?.length > 9 && (
        <div className="pagination flex gap-3 py-1 h-[7%] justify-center items-center bg-gray-500/10 flex-wrap">
          <div className="flex gap-1 items-center pr-2 border-r border-gray-400">
            <select
              value={pageSize}
              defaultValue={20}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
              className="bg-gray-50 border outline-none rounded"
            >
              {[50, 70, 90, 120].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>

            <span className="text-gray-500 text-sm">Items per page</span>
          </div>
          <div className="items-center text-sm text-gray-500 border-r border-gray-400 pr-2">
            {pageIndex + 1} of {pageOptions.length} pages
          </div>
          <div className="flex gap-2 items-center ml-3">
            {/* <TfiControlBackward
              style={{ fontSize: 23 }}
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            /> */}
            <MdOutlineArrowBackIos
              style={{ fontSize: 18 }}
              onClick={() => previousPage()}
              className="text-gray-500 cursor-pointer"
              disabled={!canPreviousPage}
            />
            <span className="text-gray-600">{pageIndex + 1}</span>
            <MdOutlineArrowForwardIos
              style={{ fontSize: 18 }}
              className="text-gray-500 cursor-pointer"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            />
            {/* <TfiControlForward
              style={{ fontSize: 23 }}
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            /> */}
          </div>
          {/* <span>
            | Go to page:{" "}
            <input
              type="number"
              className="border-2 border-slate-500"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "} */}
        </div>
      )}
    </div>
  );
};

export default CustomTable;

const HighlightText = ({ text, searchValue }) => {
  if (!searchValue) return <span>{text}</span>;
  searchValue = searchValue?.toString();

  const lowerText = text?.toString().toLowerCase();
  const lowerSearchValue = searchValue.toLowerCase();
  const startIndex = lowerText.indexOf(lowerSearchValue);

  if (startIndex === -1) return <span>{text}</span>;

  const beforeMatch = text?.toString()?.slice(0, startIndex);
  const matchText = text
    ?.toString()
    ?.slice(startIndex, startIndex + searchValue.length);
  const afterMatch = text?.toString()?.slice(startIndex + searchValue.length);

  return (
    <span className="">
      {beforeMatch}
      <span style={{ backgroundColor: "orange" }}>{matchText}</span>
      {afterMatch}
    </span>
  );
};
