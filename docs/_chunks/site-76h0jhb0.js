import{Xe}from"./site-4mctpt5x.js";import{Qt}from"./site-pddhyj91.js";import{Te}from"./site-vr8xgfg5.js";import{o}from"./site-8nsc0rx2.js";class eg extends Xe{constructor(t={}){super(t);this.config=t,this.config.startIndex=t.startIndex??new Te(0),this.reset=this._registerSignalInput("reset"),this.maxExecutions=this.registerDataInput("maxExecutions",Qt),this.executionCount=this.registerDataOutput("executionCount",Qt,new Te(0))}_execute(t,i){if(i===this.reset)this.executionCount.setValue(this.config.startIndex,t);else{let e=this.executionCount.getValue(t);if(e.value<this.maxExecutions.getValue(t).value)this.executionCount.setValue(new Te(e.value+1),t),this.out._activateSignal(t)}}getClassName(){return"FlowGraphDoNBlock"}}var r=!1;function tg(){if(r)return;r=!0,o("FlowGraphDoNBlock",eg)}tg();
export{eg,tg};

//# debugId=3D30975AD2A613C664756E2164756E21
//# sourceMappingURL=site-76h0jhb0.js.map
