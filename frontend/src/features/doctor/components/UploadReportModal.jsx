import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../../components/common/Button";
import { uploadReport } from "../services/doctorService";

const reportTypes = ["Blood Test", "X-Ray", "MRI", "CT Scan", "ECG", "Prescription", "Ultrasound", "Other"];

const UploadReportModal = ({ appointment, onClose }) => {
    const [title, setTitle] = useState("");
    const [reportType, setReportType] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const mutation = useMutation({
        mutationFn: uploadReport,
        onSuccess: () => { toast.success("Report uploaded"); onClose(); },
        onError: (error) => toast.error(error.response?.data?.message || "Unable to upload report"),
    });
    const submit = (event) => { event.preventDefault(); if (!file) return toast.error("Select a report file"); mutation.mutate({ appointmentId: appointment._id, title, reportType, description, file }); };
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><form onSubmit={submit} className="w-full max-w-lg rounded-xl bg-white p-6"><div className="flex justify-between"><h2 className="text-xl font-bold">Upload medical report</h2><button type="button" onClick={onClose}>✕</button></div><p className="mt-2 text-sm text-slate-500">For {appointment.patient?.user?.firstName} {appointment.patient?.user?.lastName}</p><div className="mt-5 space-y-4"><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Report title" className="w-full rounded-lg border border-slate-300 px-3 py-2" /><select required value={reportType} onChange={(event) => setReportType(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Report type</option>{reportTypes.map((type) => <option key={type}>{type}</option>)}</select><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description (optional)" className="w-full rounded-lg border border-slate-300 px-3 py-2" /><input required type="file" accept="application/pdf,image/jpeg,image/png" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full" /></div><div className="mt-6"><Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Uploading..." : "Upload report"}</Button></div></form></div>;
};

export default UploadReportModal;
