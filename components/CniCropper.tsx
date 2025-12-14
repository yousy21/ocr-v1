"use client";

import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import imageCompression from "browser-image-compression";

export default function CniCropper({ onCropped }: { onCropped: (file: File) => void }) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => setImageSrc(reader.result as string);
        reader.readAsDataURL(file);
    };

    const onCropComplete = useCallback((_croppedArea: Area, croppedArea: Area) => {
        setCroppedAreaPixels(croppedArea);
    }, []);

    const getCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        const croppedFile = await cropImage(imageSrc, croppedAreaPixels);

        // OPTIONAL compression
        const compressed = await imageCompression(croppedFile, {
            maxSizeMB: 0.4,
            maxWidthOrHeight: 1500,
            useWebWorker: true,
        });

        onCropped(compressed);
    };

    return (
        <div className="space-y-3">
            {!imageSrc && (
                <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="border p-2 rounded-md"
                />
            )}

            {imageSrc && (
                <div className="relative w-full h-[350px] bg-black/20 rounded-md overflow-hidden">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1.586} // Algerian ID aspect ratio
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        cropShape="rect"
                        showGrid
                    />
                </div>
            )}

            {imageSrc && (
                <button
                    onClick={getCroppedImage}
                    className="w-full bg-emerald-600 text-white rounded-md p-2"
                >
                    Crop & Upload
                </button>
            )}
        </div>
    );
}

/* ----------------------------------------------------
   Helper: Convert crop area → File
---------------------------------------------------- */
async function cropImage(src: string, crop: Area): Promise<File> {
    const img = await createImage(src);
    const canvas = document.createElement("canvas");

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
        img,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(new File([blob!], "cni_cropped.jpg", { type: "image/jpeg" }));
        }, "image/jpeg");
    });
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
