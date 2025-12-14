export default function StepperHeader({ step }: { step: number }) {
    const steps = [
        "Locataire",
        "Bailleur",
        "Bien Immobilier",
        "Résumé",
    ];

    return (
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-xl">
            {steps.map((s, i) => {
                const active = step === i + 1;
                const completed = step > i + 1;

                return (
                    <div key={s} className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md text-sm transition-all
              ${active
                                    ? "bg-blue-600 text-white scale-110"
                                    : completed
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            {i + 1}
                        </div>

                        <p
                            className={`text-sm font-medium ${active ? "text-blue-600" : "text-gray-500"
                                }`}
                        >
                            {s}
                        </p>

                        {i < steps.length - 1 && (
                            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
