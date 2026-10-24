import{Le}from"./site-7z4hmt54.js";import{w,k,ct}from"./site-169k801a.js";import{o}from"./site-g2k0zkaa.js";class Yd extends Le{constructor(s){super(s);this.body=this.registerDataInput("body",w),this.mass=this.registerDataOutput("mass",k),this.centerOfMass=this.registerDataOutput("centerOfMass",ct),this.inertia=this.registerDataOutput("inertia",ct)}_updateOutputs(s){let t=this.body.getValue(s);if(!t)return;let e=t.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var r=!1;function jd(){if(r)return;r=!0,o("FlowGraphGetPhysicsMassPropertiesBlock",Yd)}jd();
export{Yd,jd};

//# debugId=6EC75C73D313AEA464756E2164756E21
//# sourceMappingURL=site-hdkkwk0f.js.map
