import{He}from"./site-e2p70xxb.js";import{Zt}from"./site-pb29jqm8.js";import{Ce}from"./site-9zkrtmwf.js";import{o}from"./site-jv0cbgr5.js";class Gm extends He{constructor(t={}){super(t);this.config=t,this.config.startIndex=t.startIndex??new Ce(0),this.reset=this._registerSignalInput("reset"),this.maxExecutions=this.registerDataInput("maxExecutions",Zt),this.executionCount=this.registerDataOutput("executionCount",Zt,new Ce(0))}_execute(t,i){if(i===this.reset)this.executionCount.setValue(this.config.startIndex,t);else{let e=this.executionCount.getValue(t);if(e.value<this.maxExecutions.getValue(t).value)this.executionCount.setValue(new Ce(e.value+1),t),this.out._activateSignal(t)}}getClassName(){return"FlowGraphDoNBlock"}}var r=!1;function zm(){if(r)return;r=!0,o("FlowGraphDoNBlock",Gm)}zm();
export{Gm,zm};

//# debugId=16C88A8C48D9CCA464756E2164756E21
//# sourceMappingURL=site-2fccsk9w.js.map
