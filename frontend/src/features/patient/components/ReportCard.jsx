const ReportCard = ({ report, onPreview }) => {
    return (
        <article className="rounded-xl bg-white p-5 shadow">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">{report.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{report.reportType} · Dr. {report.doctor?.user?.firstName} {report.doctor?.user?.lastName}</p>
                </div>
                <span className="whitespace-nowrap text-sm text-slate-500">{new Date(report.createdAt).toLocaleDateString()}</span>
            </div>
            {report.description && <p className="mt-3 text-slate-600">{report.description}</p>}
            <div className="mt-4 flex gap-4">
                <button onClick={() => onPreview(report)} className="font-medium text-blue-600 hover:underline">Preview</button>
                <a href={`/api/reports/${report._id}/download`} className="font-medium text-blue-600 hover:underline">Download</a>
            </div>
        </article>
    );
};

export default ReportCard;
