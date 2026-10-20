import{Le}from"./site-3hrxh888.js";import{w,Qt}from"./site-phrx5rwy.js";import{ye}from"./site-rtda73qh.js";import{o}from"./site-300ftf42.js";class tp extends Le{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",w),this.array=this.registerDataInput("array",w),this.index=this.registerDataOutput("index",Qt,new ye(-1))}_updateOutputs(e){let i=this.object.getValue(e),r=this.array.getValue(e);if(r)this.index.setValue(new ye(r.indexOf(i)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var t=!1;function ip(){if(t)return;t=!0,o("FlowGraphIndexOfBlock",tp)}ip();
export{tp,ip};

//# debugId=FD22579A2D72FDB764756E2164756E21
//# sourceMappingURL=site-a29qc7r5.js.map
