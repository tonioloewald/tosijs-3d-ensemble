import{er}from"./site-e2p70xxb.js";import{Ye}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class Im extends er{constructor(e){super(e);this.condition=this.registerDataInput("condition",Ye),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function Pm(){if(t)return;t=!0,o("FlowGraphBranchBlock",Im)}Pm();
export{Im,Pm};

//# debugId=13679911491BE6BA64756E2164756E21
//# sourceMappingURL=site-s4zzt2j1.js.map
