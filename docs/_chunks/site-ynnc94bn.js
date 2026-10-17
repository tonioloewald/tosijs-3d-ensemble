import{Le}from"./site-vc4knhgc.js";import{w,N,lt}from"./site-1fkjz1t9.js";import{o}from"./site-bg3xbkq8.js";class Yd extends Le{constructor(s){super(s);this.body=this.registerDataInput("body",w),this.mass=this.registerDataOutput("mass",N),this.centerOfMass=this.registerDataOutput("centerOfMass",lt),this.inertia=this.registerDataOutput("inertia",lt)}_updateOutputs(s){let t=this.body.getValue(s);if(!t)return;let e=t.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var r=!1;function jd(){if(r)return;r=!0,o("FlowGraphGetPhysicsMassPropertiesBlock",Yd)}jd();
export{Yd,jd};

//# debugId=BBD2F4C6D85DE74D64756E2164756E21
//# sourceMappingURL=site-ynnc94bn.js.map
