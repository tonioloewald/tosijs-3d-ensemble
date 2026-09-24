import{Ku as p}from"./site-18c2qzzn.js";import{Pu as t,av as a}from"./site-y0mephjk.js";import{gv as r}from"./site-e7a247s4.js";import{lF as o}from"./site-54y5gp1n.js";class l extends p{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",t),this.array=this.registerDataInput("array",t),this.index=this.registerDataOutput("index",a,new r(-1))}_updateOutputs(e){let h=this.object.getValue(e),i=this.array.getValue(e);if(i)this.index.setValue(new r(i.indexOf(h)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var s=!1;function n(){if(s)return;s=!0,o("FlowGraphIndexOfBlock",l)}n();
export{l as Kn,n as Ln};

//# debugId=CB724D824AFCF3CB64756E2164756E21
//# sourceMappingURL=site-mcdq7eky.js.map
