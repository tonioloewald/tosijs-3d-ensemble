import{Ye}from"./site-bs4qmp9a.js";import{R,je}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class o_ extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",je)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setLinearVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function a_(){if(i)return;i=!0,o("FlowGraphSetLinearVelocityBlock",o_)}
export{o_,a_};

//# debugId=3C76A32A213EE2D064756E2164756E21
//# sourceMappingURL=site-hsak43qx.js.map
