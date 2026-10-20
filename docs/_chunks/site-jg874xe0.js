import{He}from"./site-dkd9tveg.js";import{w,ct}from"./site-jw81twe3.js";import{o}from"./site-mkftt73g.js";class Vd extends He{constructor(t){super(t);this.body=this.registerDataInput("body",w),this.velocity=this.registerDataInput("velocity",ct)}_execute(t,i){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setAngularVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetAngularVelocityBlock"}}var r=!1;function zd(){if(r)return;r=!0,o("FlowGraphSetAngularVelocityBlock",Vd)}zd();
export{Vd,zd};

//# debugId=9D3CA3129F8B12C864756E2164756E21
//# sourceMappingURL=site-jg874xe0.js.map
