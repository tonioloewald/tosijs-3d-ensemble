import{He}from"./site-rzgrmjyd.js";import{w,lt}from"./site-ws3bshz1.js";import{o}from"./site-pmpcb5qm.js";class cp extends He{constructor(t){super(t);this.body=this.registerDataInput("body",w),this.force=this.registerDataInput("force",lt),this.location=this.registerDataInput("location",lt)}_execute(t,a){let r=this.body.getValue(t);if(!r){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);r.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var e=!1;function hp(){if(e)return;e=!0,o("FlowGraphApplyForceBlock",cp)}hp();
export{cp,hp};

//# debugId=3EA649A815CA657364756E2164756E21
//# sourceMappingURL=site-a0js8yvv.js.map
