export { };

declare global {
    interface MediaTrackConstraintSet {
        zoom?: boolean | number | ConstrainDouble;
    }

    interface MediaTrackSettings {
        zoom?: number;
    }

    interface MediaTrackCapabilities {
        zoom?: { min: number; max: number; step: number };
    }
}
