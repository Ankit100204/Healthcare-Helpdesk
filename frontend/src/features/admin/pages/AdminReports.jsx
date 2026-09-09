import { useQuery } from "@tanstack/react-query";
import { FileText, Download } from "lucide-react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import axiosInstance from "../../../api/axios";

const AdminReports = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: () =>
      axiosInstance.get("/admin/reports").then((r) => r.data),
  });

  const reports = data?.data ?? [];

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold">All Reports</h1>

      {isLoading && <p>Loading reports...</p>}

      {isError && (
        <p className="text-red-600">Unable to load reports. Please try again later.</p>
      )}

      {!isLoading && !isError && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-slate-500">No reports found.</p>
          ) : (
            reports.map((report) => (
              <div
                key={report._id}
                className="flex items-center justify-between rounded-xl bg-white p-5 shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold">{report.title}</h3>

                    <p className="text-sm text-slate-500">
                      {report.reportType} ·{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>

                    <p className="text-xs text-slate-400">
                      Patient: {report.patient?.user?.firstName}{" "}
                      {report.patient?.user?.lastName} · Doctor:{" "}
                      {report.doctor?.user?.firstName}{" "}
                      {report.doctor?.user?.lastName}
                    </p>
                  </div>
                </div>

                <a
                  href={`/api/reports/${report._id}/download`}
                  className="rounded-lg border p-2 hover:bg-slate-50"
                >
                  <Download className="h-5 w-5" />
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminReports;