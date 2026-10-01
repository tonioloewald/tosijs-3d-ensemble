import{tr}from"./site-gh92gf7j.js";import{Ye}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class wm extends tr{constructor(e){super(e);this.condition=this.registerDataInput("condition",Ye),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function Im(){if(t)return;t=!0,o("FlowGraphBranchBlock",wm)}Im();
export{wm,Im};

//# debugId=906D9CA2C4D4A51B64756E2164756E21
//# sourceMappingURL=site-4hj1hy87.js.map
