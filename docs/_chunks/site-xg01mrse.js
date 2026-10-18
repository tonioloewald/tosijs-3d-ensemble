import{He}from"./site-3q4gqkf5.js";import{Di,Ye}from"./site-9g37ftzw.js";import{o}from"./site-16qs5rck.js";class og extends He{constructor(t){super(t);this.event=this.registerDataInput("event",Di),this.stopImmediate=this.registerDataInput("stopImmediate",Ye,!1)}_execute(t){let r=this.event.getValue(t),i=this.stopImmediate.getValue(t);t.configuration.coordinator.stopEventPropagation(r,i),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopEventPropagationBlock"}}var e=!1;function ag(){if(e)return;e=!0,o("FlowGraphStopEventPropagationBlock",og)}ag();
export{og,ag};

//# debugId=84470EABBB1CBEAB64756E2164756E21
//# sourceMappingURL=site-xg01mrse.js.map
