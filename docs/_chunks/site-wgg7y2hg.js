import{zu as a}from"./site-s1smryc8.js";import{Pu as s,Uu as o}from"./site-y0mephjk.js";import{lF as i}from"./site-54y5gp1n.js";class l extends a{constructor(t){super(t);this.body=this.registerDataInput("body",s),this.force=this.registerDataInput("force",o),this.location=this.registerDataInput("location",o)}_execute(t,n){let r=this.body.getValue(t);if(!r){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let p=this.force.getValue(t),h=this.location.getValue(t);r.applyForce(p,h),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var e=!1;function c(){if(e)return;e=!0,i("FlowGraphApplyForceBlock",l)}c();
export{l as pn,c as qn};

//# debugId=B694239C9831F17164756E2164756E21
//# sourceMappingURL=site-wgg7y2hg.js.map
