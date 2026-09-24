import{Ku as h}from"./site-18c2qzzn.js";import{Pu as o,Ru as p,Uu as t}from"./site-y0mephjk.js";import{lF as a}from"./site-54y5gp1n.js";class u extends h{constructor(s){super(s);this.body=this.registerDataInput("body",o),this.mass=this.registerDataOutput("mass",p),this.centerOfMass=this.registerDataOutput("centerOfMass",t),this.inertia=this.registerDataOutput("inertia",t)}_updateOutputs(s){let r=this.body.getValue(s);if(!r)return;let e=r.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var i=!1;function c(){if(i)return;i=!0,a("FlowGraphGetPhysicsMassPropertiesBlock",u)}c();
export{u as Dn,c as En};

//# debugId=7D4C36E77D78C7DE64756E2164756E21
//# sourceMappingURL=site-tpbe1agt.js.map
