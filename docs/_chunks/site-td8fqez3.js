import{Au as i}from"./site-ngcb07t9.js";import{Qu as o}from"./site-p0rrvqfa.js";import{jF as r}from"./site-6873nq4n.js";class s extends i{constructor(e){super(e);this.condition=this.registerDataInput("condition",o),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function a(){if(t)return;t=!0,r("FlowGraphBranchBlock",s)}a();
export{s as Ir,a as Jr};

//# debugId=2DB8FD4BD8E1BFB964756E2164756E21
//# sourceMappingURL=site-td8fqez3.js.map
