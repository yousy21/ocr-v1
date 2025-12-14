import cv from "@techstark/opencv-js";

export async function validateCNI(imageBase64: string): Promise<boolean> {
    return new Promise((resolve) => {
        let img = new Image();
        img.src = imageBase64;

        img.onload = () => {
            // Convert image to OpenCV mat
            let mat = cv.imread(img);

            // Convert to grayscale
            let gray = new cv.Mat();
            cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);

            // Blur + Edge detection
            let blurred = new cv.Mat();
            cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

            let edges = new cv.Mat();
            cv.Canny(blurred, edges, 50, 150);

            // Find contours
            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();
            cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

            let valid = false;

            for (let i = 0; i < contours.size(); i++) {
                let cnt = contours.get(i);
                let rect = cv.minAreaRect(cnt);
                let { width, height } = rect.size;

                if (width < 80 || height < 40) continue; // avoid noise

                let ratio = width > height ? width / height : height / width;

                // CNI ratio ≈ 1.586 (ISO ID-1 standard)
                if (ratio > 1.50 && ratio < 1.68) {
                    valid = true;
                    break;
                }
            }

            // Cleanup
            mat.delete();
            gray.delete();
            blurred.delete();
            edges.delete();
            contours.delete();
            hierarchy.delete();

            resolve(valid);
        };
    });
}
