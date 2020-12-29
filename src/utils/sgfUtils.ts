import {SGFCoordinate} from 'models/SGF';

type Point = [number, number];

const tengen = [9, 9];
const hoshi = [[3, 3], [3, 9], [3, 15],
[9, 3], [9, 15],
[15, 3], [15, 9], [15, 15]];

export default class SGFUtils {

    static translateToCoordinate(gtpLocation: string): Point {
        return [gtpLocation.charCodeAt(0) - 97, Number.parseInt(gtpLocation.substr(1))];
    }

    static isTengen(point: [number, number]) {
        return tengen[0] === point[0] && tengen[1] === point[1];
    }

    static isHoshi(point: [number, number]) {
        return hoshi.some(p => p[0] === point[0] && p[1] === point[1]);
    }
}