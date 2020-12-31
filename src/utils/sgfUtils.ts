type Point = [number, number];

const tengen = [9, 9];
const hoshi = [[3, 3], [3, 9], [3, 15],
    [9, 3], [9, 15],
    [15, 3], [15, 9], [15, 15]
];

export default class SgfUtils {

    static translateToCoordinate(gtpLocation: string): Point {
        let col = gtpLocation.charCodeAt(0);
        if (col >= 'I'.charCodeAt(0)) {
            col--;
        }
        return [col - 65, Number.parseInt(gtpLocation.substr(1)) - 1];
    }

    static isTengen(point: [number, number]): boolean {
        return tengen[0] === point[0] && tengen[1] === point[1];
    }

    static isHoshi(point: [number, number]): boolean {
        return hoshi.some(p => p[0] === point[0] && p[1] === point[1]);
    }

}