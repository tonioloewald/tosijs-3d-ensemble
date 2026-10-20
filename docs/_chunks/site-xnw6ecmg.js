import{Le}from"./site-0215gf70.js";import{w,Qt}from"./site-afz29jnp.js";import{ye}from"./site-zazmkdpe.js";import{o}from"./site-ky7rmxkt.js";class tp extends Le{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",w),this.array=this.registerDataInput("array",w),this.index=this.registerDataOutput("index",Qt,new ye(-1))}_updateOutputs(e){let i=this.object.getValue(e),r=this.array.getValue(e);if(r)this.index.setValue(new ye(r.indexOf(i)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var t=!1;function ip(){if(t)return;t=!0,o("FlowGraphIndexOfBlock",tp)}ip();
export{tp,ip};

//# debugId=FD22579A2D72FDB764756E2164756E21
//# sourceMappingURL=site-xnw6ecmg.js.map
