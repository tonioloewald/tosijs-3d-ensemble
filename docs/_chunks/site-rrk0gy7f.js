import{Xe}from"./site-4mctpt5x.js";import{Li,je}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class hg extends Xe{constructor(t){super(t);this.event=this.registerDataInput("event",Li),this.stopImmediate=this.registerDataInput("stopImmediate",je,!1)}_execute(t){let r=this.event.getValue(t),i=this.stopImmediate.getValue(t);t.configuration.coordinator.stopEventPropagation(r,i),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopEventPropagationBlock"}}var e=!1;function ug(){if(e)return;e=!0,o("FlowGraphStopEventPropagationBlock",hg)}ug();
export{hg,ug};

//# debugId=C1BB11000A73A0B464756E2164756E21
//# sourceMappingURL=site-rrk0gy7f.js.map
