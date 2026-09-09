import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Button from "../../../components/common/Button";
import axiosInstance from "../../../api/axios";
import { FileText, Download, Upload } from "lucide-react";

const REPORT_TYPES = [
  "Blood Test",
  "X-Ray",
  "MRI",
  "CT Scan",
  "ECG",
  "Prescription",
  "Ultrasound",
  "Other",
];

const getReports = () =>
  axiosInstance.get("/reports/doctor/my").then((r) => r.data);

const getCompletedAppointments = () =>
  axiosInstance.get("/appointments/doctor", {
    params: { status: "completed", limit: 100 },
  }).then((r) => r.data);

const uploadReport = async (payload) => {
  const formData = new FormData();
  formData.append("appointmentId", payload.appointmentId);
  formData.append("title", payload.title);
  formData.append("reportType", payload.reportType);
  formData.append("description", payload.description || "");
  formData.append("file", payload.file);
  const { data } = await axiosInstance.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const DoctorReports = () => {
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["doctor-reports"],
    queryFn: getReports,
  });

  const { data: appointmentsData } = useQuery({
    queryKey: ["doctor-completed-appointments"],
    queryFn: getCompletedAppointments,
  });

  const reports = data?.data?.data ?? [];
  const completedAppointments = appointmentsData?.data?.appointments ?? [];

  const uploadMutation = useMutation({
    mutationFn: uploadReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-reports"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-completed-appointments"] });
      toast.success("Medical report uploaded successfully");
      setShowUpload(false);
      setAppointmentId("");
      setTitle("");
      setDescription("");
      setFile(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Unable to upload report"),
  });

  const submitUpload = (event) => {
    event.preventDefault();
    if (!appointmentId || !title.trim() || !file) {
      toast.error("Please fill all required fields and select a file");
      return;
    }
    uploadMutation.mutate({
      appointmentId,
      title: title.trim(),
      reportType,
      description: description.trim(),
      file,
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold">Medical Reports</h1>
          <p className="text-slate-500">View and upload reports for your patients.</p>
        </div>
        <button
          onClick={() => setShowUpload((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" />
          Upload report
        </button>
      </div>

      {showUpload && (
        <form
          onSubmit={submitUpload}
          className="mb-8 rounded-xl bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-lg font-semibold">Upload new report</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Completed appointment
              <select
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                required
              >
                <option value="">Select an appointment</option>
                {completedAppointments.map((appointment) => (
                  <option key={appointment._id} value={appointment._id}>
                    Dr. {appointment.patient?.user?.firstName}{" "}
                    {appointment.patient?.user?.lastName} —{" "}
                    {new Date(appointment.appointmentStart).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Report type
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {REPORT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="e.g. Complete blood count"
                required
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              File (PDF, JPG, PNG)
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                required
              />
            </label>

            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Description (optional)
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="Additional notes about the report"
              />
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <Button
              type="submit"
              disabled={uploadMutation.isPending}
              className="max-w-xs"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload report"}
            </Button>
            <button
              type="button"
              onClick={() => setShowUpload(false)}
              className="rounded-lg border border-slate-300 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading && <p>Loading reports...</p>}

      {!isLoading && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-slate-500">No reports uploaded yet.</p>
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
                      {report.patient?.user?.lastName}
                    </p>

                    {report.description && (
                      <p className="mt-1 text-sm text-slate-600">
                        {report.description}
                      </p>
                    )}
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

export default DoctorReports;
