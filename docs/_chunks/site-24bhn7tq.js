import{Yt}from"./site-bs4qmp9a.js";import{He}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class Ng extends Yt{constructor(e){super(e);this.condition=this.registerDataInput("condition",He),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function Lg(){if(t)return;t=!0,o("FlowGraphBranchBlock",Ng)}
export{Ng,Lg};

//# debugId=5C92661F9188EC0764756E2164756E21
//# sourceMappingURL=site-24bhn7tq.js.map
