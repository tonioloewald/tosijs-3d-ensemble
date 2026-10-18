import{ir}from"./site-3q4gqkf5.js";import{Ye}from"./site-9g37ftzw.js";import{o}from"./site-16qs5rck.js";class Bm extends ir{constructor(e){super(e);this.condition=this.registerDataInput("condition",Ye),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function Vm(){if(t)return;t=!0,o("FlowGraphBranchBlock",Bm)}Vm();
export{Bm,Vm};

//# debugId=08E908C54B601FD464756E2164756E21
//# sourceMappingURL=site-2fqh176n.js.map
