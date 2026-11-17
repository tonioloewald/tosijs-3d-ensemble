import{Ye}from"./site-3s1j98fr.js";import{oi,He}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class ex extends Ye{constructor(t){super(t);this.event=this.registerDataInput("event",oi),this.stopImmediate=this.registerDataInput("stopImmediate",He,!1)}_execute(t){let i=this.event.getValue(t),a=this.stopImmediate.getValue(t);t.configuration.coordinator.stopEventPropagation(i,a),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopEventPropagationBlock"}}var e=!1;function tx(){if(e)return;e=!0,o("FlowGraphStopEventPropagationBlock",ex)}
export{ex,tx};

//# debugId=86FF521C3739AF2E64756E2164756E21
//# sourceMappingURL=site-xysks4f3.js.map
