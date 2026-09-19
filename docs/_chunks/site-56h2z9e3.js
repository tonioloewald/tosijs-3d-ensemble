import{xu as a}from"./site-gx4ww0cp.js";import{Nu as s,Su as o}from"./site-p0rrvqfa.js";import{jF as i}from"./site-6873nq4n.js";class l extends a{constructor(t){super(t);this.body=this.registerDataInput("body",s),this.force=this.registerDataInput("force",o),this.location=this.registerDataInput("location",o)}_execute(t,n){let r=this.body.getValue(t);if(!r){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let p=this.force.getValue(t),h=this.location.getValue(t);r.applyForce(p,h),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var e=!1;function c(){if(e)return;e=!0,i("FlowGraphApplyForceBlock",l)}c();
export{l as nn,c as on};

//# debugId=3000E87ABEB963AE64756E2164756E21
//# sourceMappingURL=site-56h2z9e3.js.map
