import{He}from"./site-vc4knhgc.js";import{w,lt}from"./site-1fkjz1t9.js";import{o}from"./site-bg3xbkq8.js";class Vd extends He{constructor(t){super(t);this.body=this.registerDataInput("body",w),this.velocity=this.registerDataInput("velocity",lt)}_execute(t,i){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setAngularVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetAngularVelocityBlock"}}var r=!1;function zd(){if(r)return;r=!0,o("FlowGraphSetAngularVelocityBlock",Vd)}zd();
export{Vd,zd};

//# debugId=EC10BDCDD18FE76664756E2164756E21
//# sourceMappingURL=site-2zqmxme1.js.map
