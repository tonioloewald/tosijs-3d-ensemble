import{sr}from"./site-dkd9tveg.js";import{Ye}from"./site-jw81twe3.js";import{o}from"./site-mkftt73g.js";class Bm extends sr{constructor(e){super(e);this.condition=this.registerDataInput("condition",Ye),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function Vm(){if(t)return;t=!0,o("FlowGraphBranchBlock",Bm)}Vm();
export{Bm,Vm};

//# debugId=9B74B7FB0CC2A7D464756E2164756E21
//# sourceMappingURL=site-6p1de8sx.js.map
