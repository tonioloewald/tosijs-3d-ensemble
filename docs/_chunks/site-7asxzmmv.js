import{He}from"./site-e2p70xxb.js";import{Di,Ye}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class qm extends He{constructor(t){super(t);this.event=this.registerDataInput("event",Di),this.stopImmediate=this.registerDataInput("stopImmediate",Ye,!1)}_execute(t){let r=this.event.getValue(t),i=this.stopImmediate.getValue(t);t.configuration.coordinator.stopEventPropagation(r,i),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopEventPropagationBlock"}}var e=!1;function Zm(){if(e)return;e=!0,o("FlowGraphStopEventPropagationBlock",qm)}Zm();
export{qm,Zm};

//# debugId=4451A0BEF69A7F9264756E2164756E21
//# sourceMappingURL=site-7asxzmmv.js.map
