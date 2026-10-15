import{ir}from"./site-rzgrmjyd.js";import{Ye}from"./site-ws3bshz1.js";import{o}from"./site-pmpcb5qm.js";class Bm extends ir{constructor(e){super(e);this.condition=this.registerDataInput("condition",Ye),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function Vm(){if(t)return;t=!0,o("FlowGraphBranchBlock",Bm)}Vm();
export{Bm,Vm};

//# debugId=08E908C54B601FD464756E2164756E21
//# sourceMappingURL=site-kevgdd1k.js.map
