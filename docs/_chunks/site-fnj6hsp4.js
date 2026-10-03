import{He}from"./site-x7zr027n.js";import{R,lt}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class Vd extends He{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",lt)}_execute(t,i){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setAngularVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetAngularVelocityBlock"}}var r=!1;function zd(){if(r)return;r=!0,o("FlowGraphSetAngularVelocityBlock",Vd)}zd();
export{Vd,zd};

//# debugId=BB4D983EE30C3E8D64756E2164756E21
//# sourceMappingURL=site-fnj6hsp4.js.map
