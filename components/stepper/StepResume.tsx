export default function StepResume({ form }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Résumé du dossier</h2>

            <div className="p-5 bg-gray-50 rounded-xl shadow-inner">
                <h3 className="font-semibold mb-2">Locataire</h3>
                <pre className="text-sm">{JSON.stringify(form.locataire, null, 2)}</pre>
            </div>

            <div className="p-5 bg-gray-50 rounded-xl shadow-inner">
                <h3 className="font-semibold mb-2">Bailleur</h3>
                <pre className="text-sm">{JSON.stringify(form.bailleur, null, 2)}</pre>
            </div>

            <div className="p-5 bg-gray-50 rounded-xl shadow-inner">
                <h3 className="font-semibold mb-2">Bien Immobilier</h3>
                <pre className="text-sm">{JSON.stringify(form.bien, null, 2)}</pre>
            </div>
        </div>
    );
}
