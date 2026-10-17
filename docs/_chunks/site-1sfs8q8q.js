import{He}from"./site-vc4knhgc.js";import{Di,Ye}from"./site-1fkjz1t9.js";import{o}from"./site-bg3xbkq8.js";class og extends He{constructor(t){super(t);this.event=this.registerDataInput("event",Di),this.stopImmediate=this.registerDataInput("stopImmediate",Ye,!1)}_execute(t){let r=this.event.getValue(t),i=this.stopImmediate.getValue(t);t.configuration.coordinator.stopEventPropagation(r,i),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopEventPropagationBlock"}}var e=!1;function ag(){if(e)return;e=!0,o("FlowGraphStopEventPropagationBlock",og)}ag();
export{og,ag};

//# debugId=84470EABBB1CBEAB64756E2164756E21
//# sourceMappingURL=site-1sfs8q8q.js.map
