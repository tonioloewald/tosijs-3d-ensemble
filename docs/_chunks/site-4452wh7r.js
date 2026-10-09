import{He}from"./site-228z8wgn.js";import{Pi,Ye}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class og extends He{constructor(t){super(t);this.event=this.registerDataInput("event",Pi),this.stopImmediate=this.registerDataInput("stopImmediate",Ye,!1)}_execute(t){let r=this.event.getValue(t),i=this.stopImmediate.getValue(t);t.configuration.coordinator.stopEventPropagation(r,i),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopEventPropagationBlock"}}var e=!1;function ag(){if(e)return;e=!0,o("FlowGraphStopEventPropagationBlock",og)}ag();
export{og,ag};

//# debugId=72CE7381DD0CFAAD64756E2164756E21
//# sourceMappingURL=site-4452wh7r.js.map
