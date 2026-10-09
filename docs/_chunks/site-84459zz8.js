import{Le}from"./site-228z8wgn.js";import{R,N,lt}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class Yd extends Le{constructor(s){super(s);this.body=this.registerDataInput("body",R),this.mass=this.registerDataOutput("mass",N),this.centerOfMass=this.registerDataOutput("centerOfMass",lt),this.inertia=this.registerDataOutput("inertia",lt)}_updateOutputs(s){let t=this.body.getValue(s);if(!t)return;let e=t.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var r=!1;function jd(){if(r)return;r=!0,o("FlowGraphGetPhysicsMassPropertiesBlock",Yd)}jd();
export{Yd,jd};

//# debugId=FC4451654452311264756E2164756E21
//# sourceMappingURL=site-84459zz8.js.map
