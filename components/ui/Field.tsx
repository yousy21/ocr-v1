export default function Field({
    label,
    value,
}: {
    label: string;
    value: any;
}) {
    return (
        <div className="flex justify-between py-1">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className="text-gray-900 font-medium text-sm">{value || "—"}</span>
        </div>
    );
}
