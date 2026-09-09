import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { getPatientProfile, updatePatientProfile } from "../services/patientService";

const Profile = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["patient-profile"],
        queryFn: getPatientProfile,
    });
    const { register, handleSubmit, reset } = useForm();
    const profile = data?.data;

    useEffect(() => {
        if (!profile) return;

        reset({
            gender: profile.gender || "",
            dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
            bloodGroup: profile.bloodGroup || "",
            height: profile.height || "",
            weight: profile.weight || "",
            allergies: (profile.allergies || []).join(", "),
            chronicDiseases: (profile.chronicDiseases || []).join(", "),
            emergencyName: profile.emergencyContact?.name || "",
            emergencyRelation: profile.emergencyContact?.relation || "",
            emergencyPhone: profile.emergencyContact?.phone || "",
            street: profile.address?.street || "",
            city: profile.address?.city || "",
            state: profile.address?.state || "",
            pincode: profile.address?.pincode || "",
        });
    }, [profile, reset]);

    const mutation = useMutation({
        mutationFn: updatePatientProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patient-profile"] });
            toast.success("Profile updated");
        },
        onError: (error) => toast.error(error.response?.data?.message || "Unable to update profile"),
    });

    const onSubmit = (values) => {
        const splitList = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);
        mutation.mutate({
            gender: values.gender || undefined,
            dateOfBirth: values.dateOfBirth || undefined,
            bloodGroup: values.bloodGroup || undefined,
            height: values.height ? Number(values.height) : undefined,
            weight: values.weight ? Number(values.weight) : undefined,
            allergies: splitList(values.allergies || ""),
            chronicDiseases: splitList(values.chronicDiseases || ""),
            emergencyContact: {
                name: values.emergencyName,
                relation: values.emergencyRelation,
                phone: values.emergencyPhone,
            },
            address: {
                street: values.street,
                city: values.city,
                state: values.state,
                pincode: values.pincode,
            },
        });
    };

    if (isLoading) return <DashboardLayout>Loading profile...</DashboardLayout>;
    if (isError) return <DashboardLayout>Unable to load your profile.</DashboardLayout>;

    return (
        <DashboardLayout>
            <h1 className="mb-6 text-3xl font-bold">My Profile</h1>
            <div className="mb-6 rounded-xl bg-white p-5 shadow">
                <p className="font-semibold">{profile?.user?.firstName} {profile?.user?.lastName}</p>
                <p className="text-sm text-slate-500">{profile?.user?.email} · {profile?.user?.phone}</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl bg-white p-6 shadow">
                <section>
                    <h2 className="mb-4 text-lg font-semibold">Health information</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <label className="text-sm font-medium text-gray-700">Gender<select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" {...register("gender")}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></label>
                        <Input label="Date of birth" type="date" {...register("dateOfBirth")} />
                        <label className="text-sm font-medium text-gray-700">Blood group<select className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" {...register("bloodGroup")}><option value="">Select</option>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group}>{group}</option>)}</select></label>
                        <Input label="Height (cm)" type="number" min="1" {...register("height")} />
                        <Input label="Weight (kg)" type="number" min="1" {...register("weight")} />
                    </div>
                </section>
                <section className="grid gap-4 md:grid-cols-2"><Input label="Allergies" placeholder="Separate items with commas" {...register("allergies")} /><Input label="Chronic conditions" placeholder="Separate items with commas" {...register("chronicDiseases")} /></section>
                <section><h2 className="mb-4 text-lg font-semibold">Emergency contact</h2><div className="grid gap-4 md:grid-cols-3"><Input label="Name" {...register("emergencyName")} /><Input label="Relationship" {...register("emergencyRelation")} /><Input label="Phone" {...register("emergencyPhone")} /></div></section>
                <section><h2 className="mb-4 text-lg font-semibold">Address</h2><div className="grid gap-4 md:grid-cols-2"><Input label="Street" {...register("street")} /><Input label="City" {...register("city")} /><Input label="State" {...register("state")} /><Input label="PIN code" {...register("pincode")} /></div></section>
                <div className="max-w-xs"><Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save profile"}</Button></div>
            </form>
        </DashboardLayout>
    );
};

export default Profile;
