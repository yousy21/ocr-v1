export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const dossierId = form.get("dossierId");

    // Fetch dossier data from Supabase
    const supabase = await supabaseServer();

    const { data: parties } = await supabase
      .from("dossier_parties")
      .select("*")
      .eq("dossier_id", dossierId);

    const locataire = parties?.find((p) => p.role === "locataire") || {};
    const bailleur = parties?.find((p) => p.role === "bailleur") || {};

    const { data: bien } = await supabase
      .from("contrat_location")
      .select("*")
      .eq("dossier_id", dossierId)
      .single();

    // Load template file
    const templatePath = path.join(
      process.cwd(),
      "templates/contrat-location/fr.html"
    );

    let html = fs.readFileSync(templatePath, "utf8");

    // Replace variables inside template
    html = html
      .replace(/{{LOCATAIRE_NOM}}/g, (locataire.nom || "") + " " + (locataire.prenom || ""))
      .replace(/{{LOCATAIRE_CIN}}/g, locataire.cin || "")
      .replace(/{{LOCATAIRE_ADDRESS}}/g, locataire.address || "")
      .replace(/{{LOCATAIRE_BIRTH}}/g, (locataire.date_naissance || "") + " à " + (locataire.lieu_naissance || ""))
      .replace(/{{LOCATAIRE_GENDER}}/g, locataire.gender === "M" ? "Monsieur" : locataire.gender === "F" ? "Madame" : "")

      .replace(/{{BAILLEUR_NOM}}/g, (bailleur.nom || "") + " " + (bailleur.prenom || ""))
      .replace(/{{BAILLEUR_CIN}}/g, bailleur.cin || "")
      .replace(/{{BAILLEUR_ADDRESS}}/g, bailleur.address || "")
      .replace(/{{BAILLEUR_BIRTH}}/g, (bailleur.date_naissance || "") + " à " + (bailleur.lieu_naissance || ""))
      .replace(/{{BAILLEUR_GENDER}}/g, bailleur.gender === "M" ? "Monsieur" : bailleur.gender === "F" ? "Madame" : "")

      .replace(/{{BIEN_ADDRESS}}/g, bien?.adresse || "")
      .replace(/{{LOYER_MONTANT}}/g, bien?.loyer || "")
      .replace(/{{DUREE_MOIS}}/g, bien?.rent_duration_months || "")
      .replace(/{{DATE_DEBUT}}/g, bien?.date_debut || "")
      .replace(/{{MODE_PAIEMENT}}/g, bien?.mode_paiement || "");

    // Generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "d:\\dznotaire\\puppeteer_cache\\chrome\\win64-142.0.7444.175\\chrome-win64\\chrome.exe",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    const buffer = Buffer.from(pdfBytes);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="contrat-${dossierId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("PDF Generation Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
