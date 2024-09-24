import React, { useRef } from "react";
import { useTable } from "uikit";
import Row from "./Table/Row";

export default function FarmTables(props) {
  const tableWrapperEl = useRef();

  const { data, columns, userDataReady } = props;
  const { rows } = useTable(columns, data, {
    sortable: true,
    sortColumn: "farm",
  });

  return (
    <div
      ref={tableWrapperEl}
      className="overflow-visible "
    >
      <table className="border-collapse rounded-sm mx-auto w-full main_bg">
        <tbody>
          {rows.map((row, key) => {
            return (
              <Row
                {...row.original}
                userDataReady={userDataReady}
                key={`table-row-${row.id}`}
                index={key}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
