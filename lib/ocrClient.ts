export async function sendToOCR(file: File) {
    const endpoint = process.env.NEXT_PUBLIC_OCR_ENDPOINT;
    if (!endpoint) throw new Error("OCR endpoint missing");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("OCR request failed");
    }

    return response.json();
}
