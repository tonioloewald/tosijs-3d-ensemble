import{xu as a}from"./site-gx4ww0cp.js";import{Ou as r,Qu as i}from"./site-p0rrvqfa.js";import{jF as o}from"./site-6873nq4n.js";class p extends a{constructor(t){super(t);this.event=this.registerDataInput("event",r),this.stopImmediate=this.registerDataInput("stopImmediate",i,!1)}_execute(t){let n=this.event.getValue(t),l=this.stopImmediate.getValue(t);t.configuration.coordinator.stopEventPropagation(n,l),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopEventPropagationBlock"}}var e=!1;function s(){if(e)return;e=!0,o("FlowGraphStopEventPropagationBlock",p)}s();
export{p as Fs,s as Gs};

//# debugId=03214E06A5B0F30564756E2164756E21
//# sourceMappingURL=site-jssy8h6n.js.map
