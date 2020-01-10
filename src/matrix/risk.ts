import MatrixBase from "./matrixBase";

export default class Risk extends MatrixBase {
    constructor() {
        super(2);
        
        this.matrix["Rare"] = [];
        this.matrix["Possible"] = [];
        this.matrix["Certain"] = [];

        this.matrix["Rare"]["Insignificant"] = "Accept risk";
        this.matrix["Rare"]["Moderate"] = "Create mitigating strategies, monitor risk regularly";
        this.matrix["Rare"]["Catastrophic"] = "Protect position, invest to fix ASAP, gets top priority";

        this.matrix["Possible"]["Insignificant"] = "Accept risk";
        this.matrix["Possible"]["Moderate"] = "Protect position, invest to fix ASAP, gets top priority";
        this.matrix["Possible"]["Catastrophic"] = "Protect Position, invest to fix immediately everything else goes on hold";

        this.matrix["Certain"]["Insignificant"] = "Accept risk";
        this.matrix["Certain"]["Moderate"] = "Protect Position, invest to fix immediately everything else goes on hold";
        this.matrix["Certain"]["Catastrophic"] = "Protect Position, invest to fix immediately everything else goes on hold";

        this.scoreLookup["Accept risk"] = 1;
        this.scoreLookup["Create mitigating strategies, monitor risk regularly"] = 2;
        this.scoreLookup["Protect position, invest to fix ASAP, gets top priority"] = 6;
        this.scoreLookup["Protect Position, invest to fix immediately everything else goes on hold"] = 9;
    }
}