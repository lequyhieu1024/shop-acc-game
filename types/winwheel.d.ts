declare module 'winwheel' {
    interface Segment {
        fillStyle?: string;
        text?: string;
        textFillStyle?: string;
        textFontFamily?: string;
    }

    interface Animation {
        type: string;
        duration: number;
        spins: number;
        callbackFinished?: (indicatedSegment: { text: string }) => void;
        stopAngle?: number;
        animation: string;
    }

    interface WinwheelOptions {
        canvasId: string;
        numSegments: number;
        outerRadius: number;
        textFontSize: number;
        textAlignment: string;
        textOrientation: string;
        textMargin: number;
        segments: Segment[];
        animation: Animation;
        pointerAngle: number;
        drawMode: string;
        wash: string,
    }

    class Winwheel {
        constructor(options: WinwheelOptions);
        draw(): void;
        getRandomForSegment(segmentNumber: number): number;
        startAnimation(): void;
    }

    export default Winwheel;
}