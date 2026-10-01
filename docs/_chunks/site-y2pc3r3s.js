import{He}from"./site-gh92gf7j.js";import{Di,Ye}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class qm extends He{constructor(t){super(t);this.event=this.registerDataInput("event",Di),this.stopImmediate=this.registerDataInput("stopImmediate",Ye,!1)}_execute(t){let r=this.event.getValue(t),i=this.stopImmediate.getValue(t);t.configuration.coordinator.stopEventPropagation(r,i),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopEventPropagationBlock"}}var e=!1;function Zm(){if(e)return;e=!0,o("FlowGraphStopEventPropagationBlock",qm)}Zm();
export{qm,Zm};

//# debugId=4451A0BEF69A7F9264756E2164756E21
//# sourceMappingURL=site-y2pc3r3s.js.map
