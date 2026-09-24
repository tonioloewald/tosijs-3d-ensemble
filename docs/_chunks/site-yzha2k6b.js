import{Cu as i}from"./site-4sneyxhq.js";import{Su as o}from"./site-y0mephjk.js";import{lF as r}from"./site-54y5gp1n.js";class s extends i{constructor(e){super(e);this.condition=this.registerDataInput("condition",o),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function a(){if(t)return;t=!0,r("FlowGraphBranchBlock",s)}a();
export{s as Kr,a as Lr};

//# debugId=FEB9DE743BC284DF64756E2164756E21
//# sourceMappingURL=site-yzha2k6b.js.map
