import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { createDoctor, deleteDoctor, getDoctors } from "../services/adminService";

const SPECIALIZATIONS = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic Surgeon",
    "Pediatrician",
    "Psychiatrist",
    "Gynecologist",
    "ENT Specialist",
    "Ophthalmologist",
    "Dentist",
    "Urologist",
];

const EMPTY_FORM = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    specialization: SPECIALIZATIONS[0],
    qualification: "",
    experience: "",
    consultationFee: "",
    hospital: "",
};

const Doctors = () => {
    const queryClient = useQueryClient();
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ["admin-doctors"],
        queryFn: getDoctors,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 0,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteDoctor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
            toast.success("Doctor removed");
        },
        onError: (error) =>
            toast.error(error.response?.data?.message || "Unable to remove doctor"),
    });

    const createMutation = useMutation({
        mutationFn: createDoctor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
            toast.success("Doctor added successfully");
            setShowAdd(false);
            setForm(EMPTY_FORM);
        },
        onError: (error) =>
            toast.error(error.response?.data?.message || "Unable to add doctor"),
    });

    const doctors = data?.data ?? [];

    const remove = (doctor) => {
        if (
            window.confirm(
                `Remove Dr. ${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}?`
            )
        ) {
            deleteMutation.mutate(doctor._id);
        }
    };

    const updateField = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const submitAdd = (event) => {
        event.preventDefault();
        createMutation.mutate({
            ...form,
            experience: Number(form.experience),
            consultationFee: Number(form.consultationFee),
        });
    };

    return (
        <DashboardLayout>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-bold">Doctors</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setShowAdd((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Doctor
                    </button>
                </div>
            </div>

            {showAdd && (
                <form
                    onSubmit={submitAdd}
                    className="mb-8 rounded-xl bg-white p-6 shadow"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Add new doctor</h2>
                        <button
                            type="button"
                            onClick={() => setShowAdd(false)}
                            className="rounded-lg p-1 hover:bg-slate-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            label="First name"
                            value={form.firstName}
                            onChange={(e) => updateField("firstName", e.target.value)}
                            required
                        />
                        <Input
                            label="Last name"
                            value={form.lastName}
                            onChange={(e) => updateField("lastName", e.target.value)}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            required
                        />
                        <Input
                            label="Phone"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={form.phone}
                            onChange={(e) =>
                                updateField("phone", e.target.value.replace(/\D/g, ""))
                            }
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={form.password}
                            onChange={(e) => updateField("password", e.target.value)}
                            required
                        />
                        <label className="space-y-1 text-sm font-medium text-gray-700">
                            Specialization
                            <select
                                value={form.specialization}
                                onChange={(e) => updateField("specialization", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                required
                            >
                                {SPECIALIZATIONS.map((spec) => (
                                    <option key={spec} value={spec}>
                                        {spec}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <Input
                            label="Qualification"
                            placeholder="e.g. MD, DM"
                            value={form.qualification}
                            onChange={(e) => updateField("qualification", e.target.value)}
                            required
                        />
                        <Input
                            label="Experience (years)"
                            type="number"
                            min="0"
                            value={form.experience}
                            onChange={(e) => updateField("experience", e.target.value)}
                            required
                        />
                        <Input
                            label="Consultation fee ($)"
                            type="number"
                            min="0"
                            value={form.consultationFee}
                            onChange={(e) => updateField("consultationFee", e.target.value)}
                            required
                        />
                        <Input
                            label="Hospital"
                            value={form.hospital}
                            onChange={(e) => updateField("hospital", e.target.value)}
                            required
                        />
                    </div>

                    <div className="mt-5 flex gap-3">
                        <Button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="max-w-xs"
                        >
                            {createMutation.isPending ? "Adding..." : "Add doctor"}
                        </Button>
                        <button
                            type="button"
                            onClick={() => setShowAdd(false)}
                            className="rounded-lg border border-slate-300 px-4 py-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {isLoading && <p>Loading doctors...</p>}
            {isError && <p className="text-red-600">Unable to load doctors.</p>}

            {!isLoading && !isError && (
                <div className="overflow-x-auto rounded-xl bg-white shadow">
                    <table className="w-full text-left">
                        <thead className="border-b bg-slate-50 text-sm text-slate-600">
                            <tr>
                                <th className="p-4">Doctor</th>
                                <th className="p-4">Specialization</th>
                                <th className="p-4">Hospital</th>
                                <th className="p-4">Fee</th>
                                <th className="p-4"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor) => (
                                <tr key={doctor._id} className="border-b last:border-0">
                                    <td className="p-4 font-medium">
                                        Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                                        <div className="text-sm font-normal text-slate-500">
                                            {doctor.user?.email}
                                        </div>
                                    </td>
                                    <td className="p-4">{doctor.specialization}</td>
                                    <td className="p-4">{doctor.hospital}</td>
                                    <td className="p-4">{doctor.consultationFee ?? "—"}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => remove(doctor)}
                                            disabled={deleteMutation.isPending}
                                            className="text-sm font-medium text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!doctors.length && (
                                <tr>
                                    <td colSpan="5" className="p-4 text-slate-500">
                                        No doctors found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Doctors;

