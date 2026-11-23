import{Ye}from"./site-bs4qmp9a.js";import{oi,He}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class ex extends Ye{constructor(t){super(t);this.event=this.registerDataInput("event",oi),this.stopImmediate=this.registerDataInput("stopImmediate",He,!1)}_execute(t){let i=this.event.getValue(t),a=this.stopImmediate.getValue(t);t.configuration.coordinator.stopEventPropagation(i,a),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopEventPropagationBlock"}}var e=!1;function tx(){if(e)return;e=!0,o("FlowGraphStopEventPropagationBlock",ex)}
export{ex,tx};

//# debugId=86FF521C3739AF2E64756E2164756E21
//# sourceMappingURL=site-ve8a88ja.js.map
