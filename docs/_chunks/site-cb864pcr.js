import{Ne}from"./site-4mctpt5x.js";import{R,B,ct}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class Zd extends Ne{constructor(s){super(s);this.body=this.registerDataInput("body",R),this.mass=this.registerDataOutput("mass",B),this.centerOfMass=this.registerDataOutput("centerOfMass",ct),this.inertia=this.registerDataOutput("inertia",ct)}_updateOutputs(s){let t=this.body.getValue(s);if(!t)return;let e=t.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var r=!1;function Kd(){if(r)return;r=!0,o("FlowGraphGetPhysicsMassPropertiesBlock",Zd)}Kd();
export{Zd,Kd};

//# debugId=C19D1F504222FD9464756E2164756E21
//# sourceMappingURL=site-cb864pcr.js.map
