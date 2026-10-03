import{tr}from"./site-x7zr027n.js";import{Ye}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class Bm extends tr{constructor(e){super(e);this.condition=this.registerDataInput("condition",Ye),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function Vm(){if(t)return;t=!0,o("FlowGraphBranchBlock",Bm)}Vm();
export{Bm,Vm};

//# debugId=630DB0AC70D4C1F264756E2164756E21
//# sourceMappingURL=site-qbrsrn7d.js.map
