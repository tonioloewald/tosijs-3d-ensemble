import{He}from"./site-dkd9tveg.js";import{Qt}from"./site-jw81twe3.js";import{ye}from"./site-g5md7x77.js";import{o}from"./site-mkftt73g.js";class qm extends He{constructor(t={}){super(t);this.config=t,this.config.startIndex=t.startIndex??new ye(0),this.reset=this._registerSignalInput("reset"),this.maxExecutions=this.registerDataInput("maxExecutions",Qt),this.executionCount=this.registerDataOutput("executionCount",Qt,new ye(0))}_execute(t,i){if(i===this.reset)this.executionCount.setValue(this.config.startIndex,t);else{let e=this.executionCount.getValue(t);if(e.value<this.maxExecutions.getValue(t).value)this.executionCount.setValue(new ye(e.value+1),t),this.out._activateSignal(t)}}getClassName(){return"FlowGraphDoNBlock"}}var r=!1;function Zm(){if(r)return;r=!0,o("FlowGraphDoNBlock",qm)}Zm();
export{qm,Zm};

//# debugId=2B65CE1A0F2665C964756E2164756E21
//# sourceMappingURL=site-dcnwn5yg.js.map
