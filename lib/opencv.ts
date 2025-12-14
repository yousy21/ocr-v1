let cvPromise: any = null;

export function loadCV() {
    if (typeof window === "undefined") return null;

    if (!cvPromise) {
        cvPromise = new Promise((resolve) => {
            if ((window as any).cv) {
                resolve((window as any).cv);
            } else {
                const script = document.createElement("script");
                script.src = "https://docs.opencv.org/4.x/opencv.js";
                script.async = true;
                script.onload = () => resolve((window as any).cv);
                document.body.appendChild(script);
            }
        });
    }

    return cvPromise;
}
