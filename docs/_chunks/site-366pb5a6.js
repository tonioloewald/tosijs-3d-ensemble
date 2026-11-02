import{nr}from"./site-4mctpt5x.js";import{je}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class Um extends nr{constructor(e){super(e);this.condition=this.registerDataInput("condition",je),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function Wm(){if(t)return;t=!0,o("FlowGraphBranchBlock",Um)}Wm();
export{Um,Wm};

//# debugId=28E256A5DC54E06964756E2164756E21
//# sourceMappingURL=site-366pb5a6.js.map
