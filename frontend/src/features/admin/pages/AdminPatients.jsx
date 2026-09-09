import { useQuery } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Loader from "../../../components/common/Loader";
import axiosInstance from "../../../api/axios";

const AdminPatients = () => {
    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ["admin-patients"],
        queryFn: () => axiosInstance.get("/admin/patients").then((r) => r.data),
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 0,
    });

    const patients = data?.data ?? [];

    return (
        <DashboardLayout>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Manage Patients</h1>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {isLoading && <Loader />}

            {isError && (
                <p className="text-red-600">Unable to load patients. Please try again later.</p>
            )}

            {!isLoading && !isError && (
                <div className="rounded-xl bg-white p-6 shadow">
                    {patients.length === 0 ? (
                        <p className="text-slate-500">No patients registered yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="pb-3 font-medium">Name</th>
                                        <th className="pb-3 font-medium">Email</th>
                                        <th className="pb-3 font-medium">Phone</th>
                                        <th className="pb-3 font-medium">Gender</th>
                                        <th className="pb-3 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {patients.map((p) => (
                                        <tr key={p._id} className="hover:bg-slate-50">
                                            <td className="py-3">
                                                {p.user?.firstName ? `${p.user.firstName} ${p.user.lastName || ""}` : "—"}
                                            </td>
                                            <td className="py-3">{p.user?.email || "—"}</td>
                                            <td className="py-3">{p.user?.phone || "—"}</td>
                                            <td className="py-3 capitalize">{p.gender || "—"}</td>
                                            <td className="py-3">
                                                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminPatients;

