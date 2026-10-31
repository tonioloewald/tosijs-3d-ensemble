import{He}from"./site-td3n9zy5.js";import{R,ct}from"./site-zgpxnm1e.js";import{o}from"./site-8ek23vdm.js";class Vd extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",ct)}_execute(t,i){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setAngularVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetAngularVelocityBlock"}}var r=!1;function zd(){if(r)return;r=!0,o("FlowGraphSetAngularVelocityBlock",Vd)}zd();
export{Vd,zd};

//# debugId=2BF7E1314F66EBEC64756E2164756E21
//# sourceMappingURL=site-24hgra30.js.map
