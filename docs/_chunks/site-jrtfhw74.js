import{He}from"./site-e2p70xxb.js";import{A,lt}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class sp extends He{constructor(t){super(t);this.body=this.registerDataInput("body",A),this.force=this.registerDataInput("force",lt),this.location=this.registerDataInput("location",lt)}_execute(t,a){let r=this.body.getValue(t);if(!r){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);r.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var e=!1;function np(){if(e)return;e=!0,o("FlowGraphApplyForceBlock",sp)}np();
export{sp,np};

//# debugId=C3FCF04146BB017F64756E2164756E21
//# sourceMappingURL=site-jrtfhw74.js.map
