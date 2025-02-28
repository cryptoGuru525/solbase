import { useMemo, useReducer, useEffect, ReactNode, useCallback } from "react";
import noop from "lodash/noop";
import { byTextAscending, byTextDescending } from "./utils";

const sortByColumn = (data, sortColumn, columns) => {
  let isAscending = null;
  let sortedRows = [...data];

  columns.forEach((column) => {
    // if the row was found
    if (sortColumn === column.name) {
      isAscending = column.sorted.asc;

      if (column.sort) {
        sortedRows = isAscending
          ? data.sort(column.sort)
          : data.sort(column.sort).reverse();
        // default to sort by string
      } else {
        sortedRows = isAscending
          ? data.sort(byTextAscending((object) => object.original[sortColumn]))
          : data.sort(
              byTextDescending((object) => object.original[sortColumn])
            );
      }
    }
  });

  return sortedRows;
};

const getPaginatedData = (rows, perPage, page) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return rows.slice(start, end);
};

const getColumnsByName = (columns) => {
  const columnsByName = {};
  columns.forEach((column) => {
    const col = {
      name: column.name,
      label: column.label,
    };

    if (column.render) {
      col.render = column.render;
    }
    col.hidden = column.hidden;
    columnsByName[column.name] = col;
  });

  return columnsByName;
};

const createReducer = () => (state, action) => {
  let rows = [];
  let nextPage = 0;
  let prevPage = 0;
  let isAscending = null;
  let sortedRows = [];
  let columnCopy = [];
  let filteredRows = [];
  let selectedRowsById = {};
  let stateCopy = { ...state };
  const rowIds = {};

  switch (action.type) {
    case "SET_ROWS":
      rows = [...action.data];
      // preserve sorting if a sort is already enabled when data changes
      if (state.sortColumn) {
        rows = sortByColumn(action.data, state.sortColumn, state.columns);
      }

      if (state.paginationEnabled === true) {
        rows = getPaginatedData(
          rows,
          state.pagination.perPage,
          state.pagination.page
        );
      }

      if (state.paginationEnabled === true) {
        rows = getPaginatedData(
          rows,
          state.pagination.perPage,
          state.pagination.page
        );
      }

      columnCopy = state.columns.map((column) => {
        if (state.sortColumn === column.name) {
          return {
            ...column,
            sorted: {
              on: true,
              asc: column.sorted.asc,
            },
          };
        }

        return column;
      });

      return {
        ...state,
        rows,
        originalRows: action.data,
        columns: columnCopy,
      };

    case "REACT_PAGE":
      nextPage = state.pagination.page + 1;
      return {
        ...state,
        rows: getPaginatedData(
          state.originalRows,
          state.pagination.perPage,
          nextPage
        ),
        pagination: {
          ...state.pagination,
          page: nextPage,
          canNext:
            nextPage * state.pagination.perPage < state.originalRows.length,
          canPrev: nextPage !== 1,
        },
      };
    case "PREV_PAGE":
      prevPage = state.pagination.page === 1 ? 1 : state.pagination.page - 1;

      return {
        ...state,
        rows: getPaginatedData(
          state.originalRows,
          state.pagination.perPage,
          prevPage
        ),
        pagination: {
          ...state.pagination,
          page: prevPage,
          canNext:
            prevPage * state.pagination.perPage < state.originalRows.length,
          canPrev: prevPage !== 1,
        },
      };
    case "TOGGLE_SORT":
      if (!(action.columnName in state.columnsByName)) {
        throw new Error(`Invalid column, ${action.columnName} not found`);
      }

      // loop through all columns and set the sort parameter to off unless
      // it's the specified column (only one column at a time for )
      columnCopy = state.columns.map((column) => {
        // if the row was found
        if (action.columnName === column.name) {
          if (action.isAscOverride !== undefined) {
            // force the sort order
            isAscending = action.isAscOverride;
          } else {
            // if it's undefined, start by setting to ascending, otherwise toggle
            isAscending =
              column.sorted.asc === undefined ? true : !column.sorted.asc;
          }

          if (column.sort) {
            sortedRows = isAscending
              ? state.rows.sort(column.sort)
              : state.rows.sort(column.sort).reverse();
            // default to sort by string
          } else {
            sortedRows = isAscending
              ? state.rows.sort(
                  byTextAscending(
                    (object) => object.original[action.columnName]
                  )
                )
              : state.rows.sort(
                  byTextDescending(
                    (object) => object.original[action.columnName]
                  )
                );
          }
          return {
            ...column,
            sorted: {
              on: true,
              asc: isAscending,
            },
          };
        }
        // set sorting to false for all other columns
        return {
          ...column,
          sorted: {
            on: false,
            asc: false,
          },
        };
      });

      return {
        ...state,
        columns: columnCopy,
        rows: sortedRows,
        sortColumn: action.columnName,
        columnsByName: getColumnsByName(columnCopy),
      };
    case "GLOBAL_FILTER":
      filteredRows = action.filter(state.originalRows);
      selectedRowsById = {};
      state.selectedRows.forEach((row) => {
        selectedRowsById[row.id] = row.selected ?? false;
      });

      return {
        ...state,
        rows: filteredRows.map((row) => {
          return selectedRowsById[row.id]
            ? { ...row, selected: selectedRowsById[row.id] }
            : { ...row };
        }),
        filterOn: true,
      };
    case "SELECT_ROW":
      stateCopy = { ...state };

      stateCopy.rows = stateCopy.rows.map((row) => {
        const newRow = { ...row };
        if (newRow.id === action.rowId) {
          newRow.selected = !newRow.selected;
        }
        return newRow;
      });

      stateCopy.originalRows = stateCopy.originalRows.map((row) => {
        const newRow = { ...row };
        if (newRow.id === action.rowId) {
          newRow.selected = !newRow.selected;
        }
        return newRow;
      });

      stateCopy.selectedRows = stateCopy.originalRows.filter(
        (row) => row.selected === true
      );

      stateCopy.toggleAllState =
        stateCopy.selectedRows.length === stateCopy.rows.length
          ? (stateCopy.toggleAllState = true)
          : (stateCopy.toggleAllState = false);

      return stateCopy;
    case "SEARCH_STRING":
      stateCopy = { ...state };
      stateCopy.rows = stateCopy.originalRows.filter((row) => {
        return (
          row.cells.filter((cell) => {
            if (cell.value.includes(action.searchString)) {
              return true;
            }
            return false;
          }).length > 0
        );
      });
      return stateCopy;
    case "TOGGLE_ALL":
      if (state.selectedRows.length < state.rows.length) {
        stateCopy.rows = stateCopy.rows.map((row) => {
          rowIds[row.id] = true;
          return { ...row, selected: true };
        });

        stateCopy.toggleAllState = true;
      } else {
        stateCopy.rows = stateCopy.rows.map((row) => {
          rowIds[row.id] = false;

          return { ...row, selected: false };
        });
        stateCopy.toggleAllState = false;
      }

      stateCopy.originalRows = stateCopy.originalRows.map((row) => {
        return row.id in rowIds
          ? { ...row, selected: rowIds[row.id] }
          : { ...row };
      });

      stateCopy.selectedRows = stateCopy.originalRows.filter(
        (row) => row.selected
      );

      return stateCopy;
    default:
      throw new Error("Invalid reducer action");
  }
};

const sortDataInOrder = (data, columns) => {
  return data.map((row) => {
    const newRow = {};
    columns.forEach((column) => {
      if (!(column.name in row)) {
        throw new Error(`Invalid row data, ${column.name} not found`);
      }
      newRow[column.name] = row[column.name];
    });
    return newRow;
  });
};

export const makeRender = (
  // eslint-disable-next-line
  value,
  render,
  row
) => {
  return render ? () => render({ row, value }) : () => value;
};

const makeHeaderRender = (label, render) => {
  return render ? () => render({ label }) : () => label;
};

export const useTable = (columns, data, options) => {
  const columnsWithSorting = useMemo(
    () =>
      columns.map((column) => {
        return {
          ...column,
          label: column.label ? column.label : column.name,
          hidden: column.hidden ? column.hidden : false,
          sort: column.sort,
          sorted: {
            on: false,
            asc: false,
          },
        };
      }),
    [columns]
  );
  const columnsByName = useMemo(
    () => getColumnsByName(columnsWithSorting),
    [columnsWithSorting]
  );

  const tableData = useMemo(() => {
    const sortedData = sortDataInOrder(data, columnsWithSorting);

    const newData = sortedData.map((row, idx) => {
      return {
        id: idx,
        selected: false,
        hidden: false,
        original: row,
        cells: Object.entries(row)
          .map(([column, value]) => {
            return {
              hidden: columnsByName[column].hidden,
              field: column,
              value,
              render: makeRender(value, columnsByName[column].render, row),
            };
          })
          .filter((cell) => !cell.hidden),
      };
    });
    return newData;
  }, [data, columnsWithSorting, columnsByName]);

  const reducer = createReducer();

  const [state, dispatch] = useReducer(reducer, {
    columns: columnsWithSorting,
    columnsByName,
    originalRows: tableData,
    rows: tableData,
    selectedRows: [],
    toggleAllState: false,
    filterOn: !!options?.filter,
    sortColumn: options?.sortColumn,
    paginationEnabled: !!options?.pagination,
    pagination: {
      page: 1,
      perPage: 10,
      canNext: true,
      canPrev: false,
      nextPage: noop,
      prevPage: noop,
    },
  });

  state.pagination.nextPage = useCallback(() => {
    dispatch({ type: "REACT_PAGE" });
  }, [dispatch]);
  state.pagination.prevPage = useCallback(
    () => dispatch({ type: "PREV_PAGE" }),
    [dispatch]
  );

  useEffect(() => {
    dispatch({ type: "SET_ROWS", data: tableData });
  }, [tableData]);

  const headers = useMemo(() => {
    return [
      ...state.columns.map((column) => {
        const label = column.label ? column.label : column.name;
        return {
          ...column,
          render: makeHeaderRender(label, column.headerRender),
        };
      }),
    ];
  }, [state.columns]);

  useEffect(() => {
    if (options && options.filter) {
      dispatch({ type: "GLOBAL_FILTER", filter: options.filter });
    }
  });

  return {
    headers: headers.filter((column) => !column.hidden),
    rows: state.rows,
    originalRows: state.originalRows,
    selectedRows: state.selectedRows,
    dispatch,
    selectRow: (rowId) => dispatch({ type: "SELECT_ROW", rowId }),
    toggleAll: () => dispatch({ type: "TOGGLE_ALL" }),
    toggleSort: (columnName, isAscOverride) =>
      dispatch({ type: "TOGGLE_SORT", columnName, isAscOverride }),
    setSearchString: (searchString) =>
      dispatch({ type: "SEARCH_STRING", searchString }),
    pagination: state.pagination,
    toggleAllState: state.toggleAllState,
  };
};
