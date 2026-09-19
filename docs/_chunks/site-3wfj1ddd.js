import{Iu as h}from"./site-rab9t16m.js";import{Nu as o,Pu as p,Su as t}from"./site-p0rrvqfa.js";import{jF as a}from"./site-6873nq4n.js";class u extends h{constructor(s){super(s);this.body=this.registerDataInput("body",o),this.mass=this.registerDataOutput("mass",p),this.centerOfMass=this.registerDataOutput("centerOfMass",t),this.inertia=this.registerDataOutput("inertia",t)}_updateOutputs(s){let r=this.body.getValue(s);if(!r)return;let e=r.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var i=!1;function c(){if(i)return;i=!0,a("FlowGraphGetPhysicsMassPropertiesBlock",u)}c();
export{u as Bn,c as Cn};

//# debugId=4BE0D08C7C84AAE164756E2164756E21
//# sourceMappingURL=site-3wfj1ddd.js.map
