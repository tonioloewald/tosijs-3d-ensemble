import{Iu as p}from"./site-rab9t16m.js";import{Nu as t,_u as a}from"./site-p0rrvqfa.js";import{ev as r}from"./site-8hb0g46e.js";import{jF as o}from"./site-6873nq4n.js";class l extends p{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",t),this.array=this.registerDataInput("array",t),this.index=this.registerDataOutput("index",a,new r(-1))}_updateOutputs(e){let h=this.object.getValue(e),i=this.array.getValue(e);if(i)this.index.setValue(new r(i.indexOf(h)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var s=!1;function n(){if(s)return;s=!0,o("FlowGraphIndexOfBlock",l)}n();
export{l as In,n as Jn};

//# debugId=02258712C2E7603A64756E2164756E21
//# sourceMappingURL=site-58zkhnz2.js.map
