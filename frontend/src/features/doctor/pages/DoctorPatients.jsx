import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Loader from "../../../components/common/Loader";
import axiosInstance from "../../../api/axios";

const DoctorPatients = () => {
    const navigate = useNavigate();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ["doctor-patients"],
        queryFn: () => axiosInstance.get("/appointments/doctor").then((r) => r.data),
    });
    const appointments = data?.data?.appointments ?? [];
    const patients = [...new Map(appointments.map((a) => [a.patient?._id, a])).values()];

    return (
        <DashboardLayout>
            <h1 className="mb-6 text-3xl font-bold">Patients</h1>
            {isLoading && <Loader />}
            {!isLoading && (
                <div className="rounded-xl bg-white p-6 shadow">
                    {patients.length === 0 ? <p className="text-slate-500">No patients yet.</p> : (
                        <div className="divide-y">
                            {patients.map((a) => {
                                const p = a.patient;
                                return p ? (
                                    <div key={p._id} className="flex items-center justify-between py-4">
                                        <div>
                                            <p className="font-medium">{p.user?.firstName} {p.user?.lastName}</p>
                                            <p className="text-sm text-slate-500">{p.user?.phone} · {p.user?.email}</p>
                                        </div>
                                        <button onClick={() => setSelectedPatient(selectedPatient?._id === p._id ? null : p)} className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50">
                                            {selectedPatient?._id === p._id ? "Hide details" : "View details"}
                                        </button>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    )}
                    {selectedPatient && (
                        <div className="mt-6 rounded-lg border bg-slate-50 p-5">
                            <h3 className="mb-3 font-semibold">Patient details</h3>
                            <div className="grid gap-3 md:grid-cols-3">
                                <div><p className="text-xs text-slate-500">Name</p><p className="font-medium">{selectedPatient.user?.firstName} {selectedPatient.user?.lastName}</p></div>
                                <div><p className="text-xs text-slate-500">Email</p><p className="font-medium">{selectedPatient.user?.email}</p></div>
                                <div><p className="text-xs text-slate-500">Phone</p><p className="font-medium">{selectedPatient.user?.phone}</p></div>
                                {selectedPatient.gender && <div><p className="text-xs text-slate-500">Gender</p><p className="font-medium">{selectedPatient.gender}</p></div>}
                                {selectedPatient.bloodGroup && <div><p className="text-xs text-slate-500">Blood group</p><p className="font-medium">{selectedPatient.bloodGroup}</p></div>}
                                {selectedPatient.dateOfBirth && <div><p className="text-xs text-slate-500">DOB</p><p className="font-medium">{new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</p></div>}
                            </div>
                            <button onClick={() => navigate("/doctor/appointments")} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">View appointments</button>
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
};

export default DoctorPatients;
