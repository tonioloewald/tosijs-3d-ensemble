import{zu as s}from"./site-s1smryc8.js";import{Pu as o,Uu as l}from"./site-y0mephjk.js";import{lF as i}from"./site-54y5gp1n.js";class a extends s{constructor(t){super(t);this.body=this.registerDataInput("body",o),this.velocity=this.registerDataInput("velocity",l)}_execute(t,p){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setAngularVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetAngularVelocityBlock"}}var r=!1;function c(){if(r)return;r=!0,i("FlowGraphSetAngularVelocityBlock",a)}c();
export{a as vn,c as wn};

//# debugId=902A43338560EA1364756E2164756E21
//# sourceMappingURL=site-wbnwp83h.js.map
