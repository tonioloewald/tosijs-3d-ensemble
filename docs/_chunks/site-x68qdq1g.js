import{He}from"./site-x7zr027n.js";import{Zt}from"./site-0860aw80.js";import{Ee}from"./site-0fa9tw7q.js";import{o}from"./site-j9pt9hg9.js";class qm extends He{constructor(t={}){super(t);this.config=t,this.config.startIndex=t.startIndex??new Ee(0),this.reset=this._registerSignalInput("reset"),this.maxExecutions=this.registerDataInput("maxExecutions",Zt),this.executionCount=this.registerDataOutput("executionCount",Zt,new Ee(0))}_execute(t,i){if(i===this.reset)this.executionCount.setValue(this.config.startIndex,t);else{let e=this.executionCount.getValue(t);if(e.value<this.maxExecutions.getValue(t).value)this.executionCount.setValue(new Ee(e.value+1),t),this.out._activateSignal(t)}}getClassName(){return"FlowGraphDoNBlock"}}var r=!1;function Zm(){if(r)return;r=!0,o("FlowGraphDoNBlock",qm)}Zm();
export{qm,Zm};

//# debugId=FDFEE30881AD4E2064756E2164756E21
//# sourceMappingURL=site-x68qdq1g.js.map
