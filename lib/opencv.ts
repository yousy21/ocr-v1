import cv from "opencv-ts";

let loaded = false;

export function loadCV() {
    if (!loaded) loaded = true;
    return cv;
}
