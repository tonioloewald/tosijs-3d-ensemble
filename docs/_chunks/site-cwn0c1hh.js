import{zu as s}from"./site-s1smryc8.js";import{Pu as o,Uu as l}from"./site-y0mephjk.js";import{lF as r}from"./site-54y5gp1n.js";class a extends s{constructor(e){super(e);this.body=this.registerDataInput("body",o),this.velocity=this.registerDataInput("velocity",l)}_execute(e,p){let t=this.body.getValue(e);if(!t){this._reportError(e,"No physics body provided"),this.out._activateSignal(e);return}t.setLinearVelocity(this.velocity.getValue(e)),this.out._activateSignal(e)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function c(){if(i)return;i=!0,r("FlowGraphSetLinearVelocityBlock",a)}c();
export{a as tn,c as un};

//# debugId=1D54E2DD67F12C8E64756E2164756E21
//# sourceMappingURL=site-cwn0c1hh.js.map
