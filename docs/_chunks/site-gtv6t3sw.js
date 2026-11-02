import{Ne}from"./site-4mctpt5x.js";import{R,Qt}from"./site-pddhyj91.js";import{Te}from"./site-vr8xgfg5.js";import{o}from"./site-8nsc0rx2.js";class np extends Ne{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",R),this.array=this.registerDataInput("array",R),this.index=this.registerDataOutput("index",Qt,new Te(-1))}_updateOutputs(e){let i=this.object.getValue(e),r=this.array.getValue(e);if(r)this.index.setValue(new Te(r.indexOf(i)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var t=!1;function op(){if(t)return;t=!0,o("FlowGraphIndexOfBlock",np)}op();
export{np,op};

//# debugId=3376708AC30B7F9064756E2164756E21
//# sourceMappingURL=site-gtv6t3sw.js.map
