type Point = [number, number];

export interface SVGProperties {
    dim: number
    boardColor: string
    blockDim: number
    blockOffset: number
    blockColor: string
    hoshiDim: number
    tengenDim: number
    blackColor: string
    whiteColor: string
    stoneHolderDim: number
    stoneHolderOffset: number
    currentStoneDim: number
    currentStoneWidth: number
    stoneDim: number
    stoneOffset: number
    stoneTextOffset: number
    stoneTextOffsetY: number
    ownershipDim: number
    ownershipOffset: number
    textColor: string
    winrateOffsetY: number
    leadOffsetY: number
}

export default class SvgRenderer {

    private readonly dimension: number;
    private svgProps: SVGProperties;

    public constructor(dimension: number, svgProps: SVGProperties) {
        this.dimension = dimension;
        this.svgProps = svgProps;
    }

    dim(index: number): Point {
        return [this.dimension - index % this.dimension - 1, Math.floor(index / this.dimension)];
    }

    loc(dim: [number, number]): Point {
        return [this.svgProps.blockDim * dim[0] + this.svgProps.blockOffset,
            this.svgProps.blockDim * dim[1] + this.svgProps.blockOffset];
    }

    ownershipColor(ownership: number): string {
        return ownership < 0 ? this.svgProps.blackColor : this.svgProps.whiteColor;
    }

    color(color: string): string {
        return color === 'B' ? this.svgProps.blackColor : this.svgProps.whiteColor;
    }

    oppositeColor(color: string): string {
        return color === 'B' ? this.svgProps.whiteColor : this.svgProps.blackColor;
    }
}