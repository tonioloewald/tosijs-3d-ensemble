import{Ye}from"./site-bs4qmp9a.js";import{ai}from"./site-f6qdnbcs.js";import{_e}from"./site-hh88thkx.js";import{o}from"./site-3cxcjhqf.js";class $g extends Ye{constructor(t={}){super(t);this.config=t,this.config.startIndex=t.startIndex??new _e(0),this.reset=this._registerSignalInput("reset"),this.maxExecutions=this.registerDataInput("maxExecutions",ai),this.executionCount=this.registerDataOutput("executionCount",ai,new _e(0))}_execute(t,s){if(s===this.reset)this.executionCount.setValue(this.config.startIndex,t);else{let e=this.executionCount.getValue(t);if(e.value<this.maxExecutions.getValue(t).value)this.executionCount.setValue(new _e(e.value+1),t),this.out._activateSignal(t)}}getClassName(){return"FlowGraphDoNBlock"}}var i=!1;function Yg(){if(i)return;i=!0,o("FlowGraphDoNBlock",$g)}
export{$g,Yg};

//# debugId=CE82446C97AE5F5D64756E2164756E21
//# sourceMappingURL=site-wfzdvt68.js.map
