import{be}from"./site-3s1j98fr.js";import{A,k,je}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class zm extends be{constructor(s){super(s);this.body=this.registerDataInput("body",A),this.mass=this.registerDataOutput("mass",k),this.centerOfMass=this.registerDataOutput("centerOfMass",je),this.inertia=this.registerDataOutput("inertia",je)}_updateOutputs(s){let t=this.body.getValue(s);if(!t)return;let e=t.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var r=!1;function Gm(){if(r)return;r=!0,o("FlowGraphGetPhysicsMassPropertiesBlock",zm)}
export{zm,Gm};

//# debugId=0381727896D520B564756E2164756E21
//# sourceMappingURL=site-6ysa139w.js.map
