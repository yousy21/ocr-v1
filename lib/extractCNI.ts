export function extract_cni_data(raw: string) {
    const txt = raw.replace(/\n/g, " ");

    const data: any = {
        nni: null,
        nom: null,
        prenom: null,
        sexe: null,
        date_naissance: null,
        lieu_naissance: null,
        date_emission: null,
        date_expiration: null,
        authority: null,
    };

    // NNI
    const nni = txt.match(/رقم التعريف الوطني\s*[: ]\s*(\d{18})/);
    if (nni) data.nni = nni[1];

    // Last name
    const nom = txt.match(/اللقب\s*[: ]\s*([\u0600-\u06FF ]+)/);
    if (nom) data.nom = nom[1].trim();

    // First name
    const prenom = txt.match(/الاسم\s*[: ]\s*([\u0600-\u06FF ]+)/);
    if (prenom) data.prenom = prenom[1].trim();

    // Gender
    const sexe = txt.match(/الجنس\s*[: ]\s*([\u0600-\u06FF]+)/);
    if (sexe) data.sexe = sexe[1];

    // Birth date
    const dob = txt.match(/تاريخ الميلاد\s*[: ]\s*(\d{4}\.\d{2}\.\d{2})/);
    if (dob) data.date_naissance = dob[1];

    // Birth place
    const lieu = txt.match(/مكان الميلاد\s*[: ]\s*([\u0600-\u06FF ]+)/);
    if (lieu) data.lieu_naissance = lieu[1].trim();

    // Issue date
    const issue = txt.match(/تاريخ الإصدار\s*[: ]\s*(\d{4}\.\d{2}\.\d{2})/);
    if (issue) data.date_emission = issue[1];

    // Expiry date
    const exp = txt.match(/تاريخ الإنتهاء\s*[: ]\s*(\d{4}\.\d{2}\.\d{2})/);
    if (exp) data.date_expiration = exp[1];

    return data;
}
