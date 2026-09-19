import{xu as l}from"./site-gx4ww0cp.js";import{Nu as r,Su as e}from"./site-p0rrvqfa.js";import{jF as o}from"./site-6873nq4n.js";class p extends l{constructor(t){super(t);this.body=this.registerDataInput("body",r),this.impulse=this.registerDataInput("impulse",e),this.location=this.registerDataInput("location",e)}_execute(t,h){let i=this.body.getValue(t);if(!i){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let u=this.impulse.getValue(t),c=this.location.getValue(t);i.applyImpulse(u,c),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var s=!1;function a(){if(s)return;s=!0,o("FlowGraphApplyImpulseBlock",p)}a();
export{p as pn,a as qn};

//# debugId=8CF614A67085183E64756E2164756E21
//# sourceMappingURL=site-7ksdt1w4.js.map
