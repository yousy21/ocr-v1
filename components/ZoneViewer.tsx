"use client";

interface ZoneViewerProps {
    zones: { [key: string]: string }[];
    images?: string[];
}

export default function ZoneViewer({ zones, images }: ZoneViewerProps) {
    if (!zones || zones.length === 0) return null;

    return (
        <div className="mt-6 w-full">
            <h2 className="text-xl font-bold mb-4 text-blue-700">🔍 Zones détectées</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {zones.map((zoneObj, index) => {
                    const key = Object.keys(zoneObj)[0];
                    const value = zoneObj[key];
                    const img = images?.[index];

                    return (
                        <div
                            key={index}
                            className="p-4 bg-white rounded-lg shadow border border-gray-200"
                        >
                            <h3 className="font-semibold text-gray-700 mb-2">{key}</h3>

                            {img && (
                                <img
                                    src={img}
                                    alt={key}
                                    className="w-full rounded border mb-3 cursor-pointer hover:scale-105 transition"
                                />
                            )}

                            <p className="text-gray-900 whitespace-pre-line">{value || "-"}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
