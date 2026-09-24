import{zu as u}from"./site-s1smryc8.js";import{av as r}from"./site-y0mephjk.js";import{gv as e}from"./site-e7a247s4.js";import{lF as s}from"./site-54y5gp1n.js";class a extends u{constructor(t={}){super(t);this.config=t,this.config.startIndex=t.startIndex??new e(0),this.reset=this._registerSignalInput("reset"),this.maxExecutions=this.registerDataInput("maxExecutions",r),this.executionCount=this.registerDataOutput("executionCount",r,new e(0))}_execute(t,l){if(l===this.reset)this.executionCount.setValue(this.config.startIndex,t);else{let i=this.executionCount.getValue(t);if(i.value<this.maxExecutions.getValue(t).value)this.executionCount.setValue(new e(i.value+1),t),this.out._activateSignal(t)}}getClassName(){return"FlowGraphDoNBlock"}}var o=!1;function n(){if(o)return;o=!0,s("FlowGraphDoNBlock",a)}n();
export{a as sp,n as tp};

//# debugId=BA2344F37AB38ECE64756E2164756E21
//# sourceMappingURL=site-7dt4a6dw.js.map
