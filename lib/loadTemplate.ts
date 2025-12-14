import { readFileSync } from "fs";
import path from "path";

export function loadTemplate(type: string, lang: "fr" | "ar" | "bilingual") {
    const p = path.join(process.cwd(), "templates", type, `${lang}.html`);
    return readFileSync(p, "utf8");
}
