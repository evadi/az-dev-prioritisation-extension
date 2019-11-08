import MatrixBase from "./matrixBase";

export default class Ansoff extends MatrixBase {
    constructor() {
        super(1);
        
        this.matrix["New"] = [];
        this.matrix["Existing"] = [];

        this.matrix["New"]["New"] = "Diversification";
        this.matrix["New"]["Existing"] = "Market Development";
        this.matrix["Existing"]["New"] = "Product Development";
        this.matrix["Existing"]["Existing"] = "Market Penetration or Stabilisation";

        this.scoreLookup["Diversification"] = 1;
        this.scoreLookup["Product Development"] = 2;
        this.scoreLookup["Market Development"] = 3;
        this.scoreLookup["Market Penetration or Stabilisation"] = 4;
    }
}