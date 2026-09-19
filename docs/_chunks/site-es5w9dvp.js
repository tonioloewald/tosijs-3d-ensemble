import{xu as s}from"./site-gx4ww0cp.js";import{Nu as o,Su as l}from"./site-p0rrvqfa.js";import{jF as r}from"./site-6873nq4n.js";class a extends s{constructor(e){super(e);this.body=this.registerDataInput("body",o),this.velocity=this.registerDataInput("velocity",l)}_execute(e,p){let t=this.body.getValue(e);if(!t){this._reportError(e,"No physics body provided"),this.out._activateSignal(e);return}t.setLinearVelocity(this.velocity.getValue(e)),this.out._activateSignal(e)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function c(){if(i)return;i=!0,r("FlowGraphSetLinearVelocityBlock",a)}c();
export{a as rn,c as sn};

//# debugId=ADA47156170E632864756E2164756E21
//# sourceMappingURL=site-es5w9dvp.js.map
