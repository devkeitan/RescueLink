import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { LogDataTable } from "./data-table";
import { logColumns } from "./columns";
import LogTableFilters, { DEFAULT_FILTERS } from "./table-filters";
import { systemLogsAPI } from "@/api/systemLogs";

const DEFAULT_PAGINATION = {
  total:        0,
  per_page:     10,
  current_page: 1,
  total_pages:  1,
};

export default function LogTable() {
  const [logs, setLogs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filters, setFilters]       = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [page, setPage]             = useState(1);

  const fetchLogs = useCallback(async (currentPage, currentFilters) => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        ...(currentFilters.search              && { search:      currentFilters.search }),
        ...(currentFilters.entity_name !== "all" && { entity_name: currentFilters.entity_name }),
        ...(currentFilters.action      !== "all" && { action:      currentFilters.action }),
        ...(currentFilters.date_from           && { date_from:   currentFilters.date_from }),
        ...(currentFilters.date_to             && { date_to:     currentFilters.date_to + "T23:59:59.999Z" }),
      };

      const result = await systemLogsAPI.getAll(params);
      setLogs(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      Swal.fire({
        icon:               "error",
        title:              "Failed to Load Logs",
        text:               error?.response?.data?.message || "Could not fetch system logs",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(page, filters);
  }, [page, filters, fetchLogs]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LogTableFilters filters={filters} onChange={handleFilterChange} />
      <LogDataTable
        columns={logColumns}
        data={logs}
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
}