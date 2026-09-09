import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import axiosInstance from "../../../api/axios";

const getNotifications = async () => {
  const { data } = await axiosInstance.get("/notifications");
  return data;
};

const markAsRead = async (id) => {
  const { data } = await axiosInstance.put(`/notifications/${id}/read`);
  return data;
};

const markAllAsRead = async () => {
  const { data } = await axiosInstance.put("/notifications/read-all");
  return data;
};

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const notifications = data?.data?.data ?? [];

  const readMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const allReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-1 text-slate-500">
            Stay updated with your healthcare activities.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={() => allReadMutation.mutate()}
            className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      {isLoading && <p>Loading notifications...</p>}

      {isError && (
        <p className="text-red-600">Unable to load notifications.</p>
      )}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-slate-500">No notifications yet.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-xl p-5 shadow ${notification.isRead
                    ? "bg-white"
                    : "border-l-4 border-blue-500 bg-blue-50"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {notification.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      onClick={() =>
                        readMutation.mutate(notification._id)
                      }
                      className="whitespace-nowrap text-sm font-medium text-blue-600 hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;