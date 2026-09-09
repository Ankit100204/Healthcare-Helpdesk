import DashboardLayout from "../../../components/layout/DashboardLayout";
import ReportCard from "../components/ReportCard";
import { useReports } from "../hooks/useReports";
import { useState } from "react";

const Reports = () => {
    const { data, isLoading, isError } = useReports();
    const reports = data?.data?.data ?? [];
    const [preview, setPreview] = useState(null);

    return (
        <DashboardLayout>
            <h1 className="mb-6 text-3xl font-bold">Medical Reports</h1>
            {isLoading && <p>Loading reports...</p>}
            {isError && <p className="text-red-600">Unable to load medical reports.</p>}
            {!isLoading && !isError && <div className="grid gap-5">{reports.map((report) => <ReportCard key={report._id} report={report} onPreview={setPreview} />)}{reports.length === 0 && <p className="text-slate-500">No medical reports available yet.</p>}</div>}
            {preview && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-xl bg-white p-4"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">{preview.title}</h2><button onClick={() => setPreview(null)} className="text-slate-500">Close</button></div><iframe src={preview.reportUrl} title={preview.title} className="min-h-0 flex-1 rounded border" /><a href={`/api/reports/${preview._id}/download`} className="mt-3 font-medium text-blue-600 hover:underline">Download report</a></div></div>}
        </DashboardLayout>
    );
};

export default Reports;
