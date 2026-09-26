import{He}from"./site-e2p70xxb.js";import{A,lt}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class op extends He{constructor(t){super(t);this.body=this.registerDataInput("body",A),this.impulse=this.registerDataInput("impulse",lt),this.location=this.registerDataInput("location",lt)}_execute(t,l){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let s=this.impulse.getValue(t),r=this.location.getValue(t);e.applyImpulse(s,r),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var i=!1;function ap(){if(i)return;i=!0,o("FlowGraphApplyImpulseBlock",op)}ap();
export{op,ap};

//# debugId=9F95D803667FFFE564756E2164756E21
//# sourceMappingURL=site-0hq26bqa.js.map
