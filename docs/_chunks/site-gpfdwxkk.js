import{Le}from"./site-enc8r1rf.js";import{w,N,ct}from"./site-j2m5wc1b.js";import{o}from"./site-whc0p6f0.js";class Yd extends Le{constructor(s){super(s);this.body=this.registerDataInput("body",w),this.mass=this.registerDataOutput("mass",N),this.centerOfMass=this.registerDataOutput("centerOfMass",ct),this.inertia=this.registerDataOutput("inertia",ct)}_updateOutputs(s){let t=this.body.getValue(s);if(!t)return;let e=t.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var r=!1;function jd(){if(r)return;r=!0,o("FlowGraphGetPhysicsMassPropertiesBlock",Yd)}jd();
export{Yd,jd};

//# debugId=F7BDCAC73B1B865064756E2164756E21
//# sourceMappingURL=site-gpfdwxkk.js.map
