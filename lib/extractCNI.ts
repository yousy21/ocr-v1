export function extract_cni_data(text: string) {
    const clean = text.replace(/\n+/g, " ").trim();

    const data: any = {
        nni: null,
        nom: null,
        prenom: null,
        sexe: null,
        date_naissance: null,
        lieu_naissance: null,
        issue_date: null,
        expiry_date: null,
        authority: null,
    };

    /* ---------------------------------------
       1️⃣  NNI (18 digits)
    ----------------------------------------*/
    const nniMatch = clean.match(/\b(\d{18})\b/);
    if (nniMatch) data.nni = nniMatch[1];

    /* ---------------------------------------
       2️⃣  Nom (اللقب)
    ----------------------------------------*/
    const nomMatch =
        clean.match(/اللقب[: ]+([^\s]+)/) ||
        clean.match(/اللقب[: ]+([^\n]+)/);
    if (nomMatch) data.nom = nomMatch[1];

    /* ---------------------------------------
       3️⃣  Prénom (الإسم)
    ----------------------------------------*/
    const prenomMatch =
        clean.match(/الإسم[: ]+([^\s]+)/) ||
        clean.match(/الإسم[: ]+([^\n]+)/);
    if (prenomMatch) data.prenom = prenomMatch[1];

    /* ---------------------------------------
       4️⃣  Sexe (الجنس)
    ----------------------------------------*/
    const sexeMatch = clean.match(/الجنس[: ]+([^\s]+)/);
    if (sexeMatch) data.sexe = sexeMatch[1];

    /* ---------------------------------------
       5️⃣ Date naissance (1995.04.21)
    ----------------------------------------*/
    const birthMatch =
        clean.match(/تاريخ ال.?يلاد[: ]+(\d{4}.\d{2}.\d{2})/) ||
        clean.match(/(\d{4}\.\d{2}\.\d{2})/);
    if (birthMatch) data.date_naissance = birthMatch[1];

    /* ---------------------------------------
       6️⃣ Lieu naissance (مكان الولادة)
    ----------------------------------------*/
    const lieuMatch =
        clean.match(/مكان ال.?يلاد[: ]+([^\s\.]+)/) ||
        clean.match(/مكان ال.?يلاد[: ]+([^\n]+)/);
    if (lieuMatch) data.lieu_naissance = lieuMatch[1];

    /* ---------------------------------------
       7️⃣ Issue date (تاريخ الإصدار)
    ----------------------------------------*/
    const issueMatch =
        clean.match(/تاريخ الإصدار[: ]+(\d{4}.\d{2}.\d{2})/);
    if (issueMatch) data.issue_date = issueMatch[1];

    /* ---------------------------------------
       8️⃣ Expiry date (تاريخ الإنتهاء)
    ----------------------------------------*/
    const expiryMatch =
        clean.match(/تاريخ الإنتهاء[: ]+(\d{4}.\d{2}.\d{2})/);
    if (expiryMatch) data.expiry_date = expiryMatch[1];

    /* ---------------------------------------
       9️⃣ Authority (سلطة الإصدار)
    ----------------------------------------*/
    const authorityMatch =
        clean.match(/سلطة الإصدار[: ]+([^\n]+)/);
    if (authorityMatch) data.authority = authorityMatch[1];

    return data;
}
