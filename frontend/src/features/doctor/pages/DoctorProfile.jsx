import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Button from "../../../components/common/Button";
import axiosInstance from "../../../api/axios";

const DoctorProfile = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({ queryKey: ["doctor-profile"], queryFn: () => axiosInstance.get("/doctors/me/profile").then((r) => r.data) });
    const doctor = data?.data;

    const [form, setForm] = useState({ qualification: "", experience: 0, consultationFee: 0, hospital: "", about: "", languages: [] });
    const [newLang, setNewLang] = useState("");

    useEffect(() => {
        if (doctor) {
            setForm({ qualification: doctor.qualification || "", experience: doctor.experience || 0, consultationFee: doctor.consultationFee || 0, hospital: doctor.hospital || "", about: doctor.about || "", languages: doctor.languages || [] });
        }
    }, [doctor]);

    const mutation = useMutation({
        mutationFn: (payload) => axiosInstance.put("/doctors/profile", payload).then((r) => r.data),
        onSuccess: () => { toast.success("Profile updated"); queryClient.invalidateQueries({ queryKey: ["doctor-profile"] }); },
        onError: (err) => toast.error(err.response?.data?.message || "Update failed"),
    });

    const addLanguage = () => { if (newLang.trim() && !form.languages.includes(newLang.trim())) { setForm((prev) => ({ ...prev, languages: [...prev.languages, newLang.trim()] })); setNewLang(""); } };
    const removeLanguage = (lang) => setForm((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== lang) }));

    const submit = (e) => { e.preventDefault(); mutation.mutate(form); };

    if (isLoading) return <DashboardLayout><p>Loading profile...</p></DashboardLayout>;

    return (
        <DashboardLayout>
            <h1 className="mb-6 text-3xl font-bold">Doctor Profile</h1>
            <form onSubmit={submit} className="max-w-2xl space-y-5 rounded-xl bg-white p-6 shadow">
                <div className="grid gap-5 md:grid-cols-2">
                    <label className="text-sm font-medium">Qualification <input value={form.qualification} onChange={(e) => setForm((p) => ({ ...p, qualification: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required /></label>
                    <label className="text-sm font-medium">Experience (years) <input type="number" min={0} value={form.experience} onChange={(e) => setForm((p) => ({ ...p, experience: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                    <label className="text-sm font-medium">Consultation Fee ($) <input type="number" min={0} value={form.consultationFee} onChange={(e) => setForm((p) => ({ ...p, consultationFee: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required /></label>
                    <label className="text-sm font-medium">Hospital <input value={form.hospital} onChange={(e) => setForm((p) => ({ ...p, hospital: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required /></label>
                </div>
                <label className="text-sm font-medium">
                    About
                    <textarea
                        value={form.about}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, about: e.target.value }))
                        }
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        rows={3}
                    />
                </label>

                <div>
                    <label className="text-sm font-medium">Languages</label>

                    <div className="mt-1 flex gap-2">
                        <input
                            value={newLang}
                            onChange={(e) => setNewLang(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2"
                            placeholder="Add a language"
                        />

                        <button
                            type="button"
                            onClick={addLanguage}
                            className="rounded-lg bg-slate-800 px-4 text-white"
                        >
                            Add
                        </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {form.languages.map((lang) => (
                            <span
                                key={lang}
                                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm"
                            >
                                {lang}

                                <button
                                    type="button"
                                    onClick={() => removeLanguage(lang)}
                                    className="text-red-500"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>            </form>
        </DashboardLayout>
    );
};

export default DoctorProfile;
