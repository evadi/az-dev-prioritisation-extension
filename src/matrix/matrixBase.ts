import ICalculatable from "./ICalculatable";

export default class MatrixBase implements ICalculatable {
    protected matrix: Array<string>;
    protected scoreLookup: Array<number> = [];

    constructor(arrayLength: number) {
        this.matrix = Array(arrayLength);
    }

    calculate(a: string, b: string) {
        if (a && b) {
            return this.matrix[a][b];
        }

        return "";
    }

    lookupScore(val: string): number {
        return this.scoreLookup[val];
    }
}
