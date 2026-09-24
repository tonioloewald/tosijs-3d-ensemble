import{zu as l}from"./site-s1smryc8.js";import{Pu as r,Uu as e}from"./site-y0mephjk.js";import{lF as o}from"./site-54y5gp1n.js";class p extends l{constructor(t){super(t);this.body=this.registerDataInput("body",r),this.impulse=this.registerDataInput("impulse",e),this.location=this.registerDataInput("location",e)}_execute(t,h){let i=this.body.getValue(t);if(!i){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let u=this.impulse.getValue(t),c=this.location.getValue(t);i.applyImpulse(u,c),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var s=!1;function a(){if(s)return;s=!0,o("FlowGraphApplyImpulseBlock",p)}a();
export{p as rn,a as sn};

//# debugId=E63EB99A887EA9B264756E2164756E21
//# sourceMappingURL=site-h6fqjxm4.js.map
