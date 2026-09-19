import{xu as s}from"./site-gx4ww0cp.js";import{Nu as o,Su as l}from"./site-p0rrvqfa.js";import{jF as i}from"./site-6873nq4n.js";class a extends s{constructor(t){super(t);this.body=this.registerDataInput("body",o),this.velocity=this.registerDataInput("velocity",l)}_execute(t,p){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setAngularVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetAngularVelocityBlock"}}var r=!1;function c(){if(r)return;r=!0,i("FlowGraphSetAngularVelocityBlock",a)}c();
export{a as tn,c as un};

//# debugId=6FCFC07303FCEA5B64756E2164756E21
//# sourceMappingURL=site-q9anneg4.js.map
