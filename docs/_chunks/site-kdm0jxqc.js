import{He}from"./site-gh92gf7j.js";import{Zt}from"./site-j8hq6r34.js";import{Ee}from"./site-n6f5fqea.js";import{o}from"./site-jx9g7gwh.js";class zm extends He{constructor(t={}){super(t);this.config=t,this.config.startIndex=t.startIndex??new Ee(0),this.reset=this._registerSignalInput("reset"),this.maxExecutions=this.registerDataInput("maxExecutions",Zt),this.executionCount=this.registerDataOutput("executionCount",Zt,new Ee(0))}_execute(t,i){if(i===this.reset)this.executionCount.setValue(this.config.startIndex,t);else{let e=this.executionCount.getValue(t);if(e.value<this.maxExecutions.getValue(t).value)this.executionCount.setValue(new Ee(e.value+1),t),this.out._activateSignal(t)}}getClassName(){return"FlowGraphDoNBlock"}}var r=!1;function Gm(){if(r)return;r=!0,o("FlowGraphDoNBlock",zm)}Gm();
export{zm,Gm};

//# debugId=7EAA6E2FBEBECACA64756E2164756E21
//# sourceMappingURL=site-kdm0jxqc.js.map
