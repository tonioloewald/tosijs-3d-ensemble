import{He}from"./site-dkd9tveg.js";import{Di,Ye}from"./site-jw81twe3.js";import{o}from"./site-mkftt73g.js";class og extends He{constructor(t){super(t);this.event=this.registerDataInput("event",Di),this.stopImmediate=this.registerDataInput("stopImmediate",Ye,!1)}_execute(t){let r=this.event.getValue(t),i=this.stopImmediate.getValue(t);t.configuration.coordinator.stopEventPropagation(r,i),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopEventPropagationBlock"}}var e=!1;function ag(){if(e)return;e=!0,o("FlowGraphStopEventPropagationBlock",og)}ag();
export{og,ag};

//# debugId=84470EABBB1CBEAB64756E2164756E21
//# sourceMappingURL=site-tearq6e6.js.map
