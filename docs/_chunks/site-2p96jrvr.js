import{He}from"./site-td3n9zy5.js";import{R,ct}from"./site-zgpxnm1e.js";import{o}from"./site-8ek23vdm.js";class cp extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.force=this.registerDataInput("force",ct),this.location=this.registerDataInput("location",ct)}_execute(t,a){let r=this.body.getValue(t);if(!r){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);r.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var e=!1;function hp(){if(e)return;e=!0,o("FlowGraphApplyForceBlock",cp)}hp();
export{cp,hp};

//# debugId=AE0B16BC88AC984064756E2164756E21
//# sourceMappingURL=site-2p96jrvr.js.map
