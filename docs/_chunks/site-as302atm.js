import{Fe}from"./site-gh92gf7j.js";import{R,Zt}from"./site-j8hq6r34.js";import{Ee}from"./site-n6f5fqea.js";import{o}from"./site-jx9g7gwh.js";class vp extends Fe{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",R),this.array=this.registerDataInput("array",R),this.index=this.registerDataOutput("index",Zt,new Ee(-1))}_updateOutputs(e){let i=this.object.getValue(e),r=this.array.getValue(e);if(r)this.index.setValue(new Ee(r.indexOf(i)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var t=!1;function bp(){if(t)return;t=!0,o("FlowGraphIndexOfBlock",vp)}bp();
export{vp,bp};

//# debugId=6B7CBAF497DA05DD64756E2164756E21
//# sourceMappingURL=site-as302atm.js.map
