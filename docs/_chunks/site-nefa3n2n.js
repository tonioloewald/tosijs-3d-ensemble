import{Fe}from"./site-e2p70xxb.js";import{A,Zt}from"./site-pb29jqm8.js";import{Ce}from"./site-9zkrtmwf.js";import{o}from"./site-jv0cbgr5.js";class vp extends Fe{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",A),this.array=this.registerDataInput("array",A),this.index=this.registerDataOutput("index",Zt,new Ce(-1))}_updateOutputs(e){let i=this.object.getValue(e),r=this.array.getValue(e);if(r)this.index.setValue(new Ce(r.indexOf(i)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var t=!1;function bp(){if(t)return;t=!0,o("FlowGraphIndexOfBlock",vp)}bp();
export{vp,bp};

//# debugId=3AE6477DAD032BC364756E2164756E21
//# sourceMappingURL=site-nefa3n2n.js.map
