import{Ye}from"./site-bs4qmp9a.js";import{R,je}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class Om extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",je)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setAngularVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetAngularVelocityBlock"}}var i=!1;function Dm(){if(i)return;i=!0,o("FlowGraphSetAngularVelocityBlock",Om)}
export{Om,Dm};

//# debugId=0B3265A11F77AAA064756E2164756E21
//# sourceMappingURL=site-vecr7dd9.js.map
