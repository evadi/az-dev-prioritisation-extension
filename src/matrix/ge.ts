import MatrixBase from "./matrixBase";

export default class GE extends MatrixBase {
    constructor() {
        super(2);
        
        this.matrix["Low"] = [];
        this.matrix["Mid"] = [];
        this.matrix["High"] = [];

        this.matrix["Low"]["Low"] = "Divest, Sell at a time to maximise value, Cut fixed costs, Avoid investment";
        this.matrix["Low"]["Mid"] = "Manage for Earnings, Protect profitable areas, Upgrade product line, Minimise investment";
        this.matrix["Low"]["High"] = "Protect and Refocus, Manage for current earnings, Focus on attractive segments, Defend strengths";

        this.matrix["Mid"]["Low"] = "Limited Expansion or Harvest, Find low risk ways to expand, Minimise investment, Rationalise operations";
        this.matrix["Mid"]["Mid"] = "Selectively Manage for Earnings, Protect existing earnings, Concentrate investments on segments where profitability is good and risks are low";
        this.matrix["Mid"]["High"] = "Build Selectively, Invest in attractive segments, Counter competition, Emphasise profitability";

        this.matrix["High"]["Low"] = "Build Selectively, Specialise on limited strengths, Seek to overcome weaknesses, Withdraw if not sustainable";
        this.matrix["High"]["Mid"] = "Invest to Build, Challenge for leadership, Build on strengths, Reinforce vulnerable areas";
        this.matrix["High"]["High"] = "Protect Position, Invest to grow at maximum rate, Protect strengths";
        
        this.scoreLookup["Divest, Sell at a time to maximise value, Cut fixed costs, Avoid investment"] = 1;
        this.scoreLookup["Manage for Earnings, Protect profitable areas, Upgrade product line, Minimise investment"] = 2;
        this.scoreLookup["Limited Expansion or Harvest, Find low risk ways to expand, Minimise investment, Rationalise operations"] = 2;
        this.scoreLookup["Protect and Refocus, Manage for current earnings, Focus on attractive segments, Defend strengths"] = 3;
        this.scoreLookup["Build Selectively, Specialise on limited strengths, Seek to overcome weaknesses, Withdraw if not sustainable"] = 3
        this.scoreLookup["Selectively Manage for Earnings, Protect existing earnings, Concentrate investments on segments where profitability is good and risks are low"] = 4
        this.scoreLookup["Build Selectively, Invest in attractive segments, Counter competition, Emphasise profitability"] = 6
        this.scoreLookup["Invest to Build, Challenge for leadership, Build on strengths, Reinforce vulnerable areas"] = 6
        this.scoreLookup["Protect Position, Invest to grow at maximum rate, Protect strengths"] = 9
    }
}