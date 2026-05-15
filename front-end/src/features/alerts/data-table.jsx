import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TableFilters from "./table-filters";

export function DataTable({ columns, data, hideStatusFilter }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const globalFilterFn = (row, columnId, filterValue) => {
    const search = String(filterValue || "").toLowerCase();
    const { type, status, data } = row.original;

    const searchableFields = [
      type,
      status,

      data?.title,
      data?.description,
      data?.location,
      data?.alert_type,
      data?.severity,

      data?.event_type,
      data?.impact_force,
      data?.network_type,

      data?.device_id,

      data?.user?.first_name,
      data?.user?.last_name,
      data?.user?.email,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableFields.includes(search);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
  });

  return (
    <div className="space-y-4">
      <TableFilters
        table={table}
        hideStatusFilter={hideStatusFilter}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground px-1 flex-wrap">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm border-l-4 border-l-purple-500 bg-muted inline-block" />
          Manual Alert
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm border-l-4 border-l-red-500 bg-muted inline-block" />
          Crash Detected
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm border-l-4 border-l-amber-500 bg-muted inline-block" />
          BLE Emergency
        </span>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const type = row.original.type;

                const rowBorderClass =
                  type === "crash"
                    ? "border-l-red-500"
                    : type === "alert"
                    ? "border-l-purple-500"
                    : "border-l-amber-500";

                return (
                  <TableRow
                    key={row.id}
                    className={`border-l-4 hover:bg-muted/50 ${rowBorderClass}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No incidents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of {data.length} incidents
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}