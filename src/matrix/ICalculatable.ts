export default interface ICalculatable {
    calculate: (a: string, b: string) => string;
    lookupScore: (val: string) => number;
}