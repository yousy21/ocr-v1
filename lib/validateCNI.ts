export async function validateCNI(imageBase64: string): Promise<boolean> {
    return new Promise((resolve) => {
        // Ensure OpenCV is loaded
        const check = setInterval(() => {
            if (typeof (window as any).cv !== "undefined") {
                clearInterval(check);
                startValidation();
            }
        }, 100);

        const startValidation = () => {
            const cv = (window as any).cv;

            let img = new Image();
            img.src = imageBase64;

            img.onload = () => {
                // Convert to OpenCV Mat
                let mat = cv.imread(img);

                // Grayscale
                let gray = new cv.Mat();
                cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);

                // Blur + Edge
                let blurred = new cv.Mat();
                cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

                let edges = new cv.Mat();
                cv.Canny(blurred, edges, 50, 150);

                // Contours
                let contours = new cv.MatVector();
                let hierarchy = new cv.Mat();
                cv.findContours(
                    edges,
                    contours,
                    hierarchy,
                    cv.RETR_EXTERNAL,
                    cv.CHAIN_APPROX_SIMPLE
                );

                let valid = false;

                for (let i = 0; i < contours.size(); i++) {
                    let cnt = contours.get(i);
                    let rect = cv.minAreaRect(cnt);
                    let { width, height } = rect.size;

                    if (width < 80 || height < 40) continue;

                    let ratio = width > height ? width / height : height / width;

                    // Algerian CNI follows ISO ID-1 dimensions
                    // Ratio ≈ 1.586
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
        };
    });
}
