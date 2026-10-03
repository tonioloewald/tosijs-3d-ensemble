import{Fe}from"./site-x7zr027n.js";import{R,Zt}from"./site-0860aw80.js";import{Ee}from"./site-0fa9tw7q.js";import{o}from"./site-j9pt9hg9.js";class tp extends Fe{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",R),this.array=this.registerDataInput("array",R),this.index=this.registerDataOutput("index",Zt,new Ee(-1))}_updateOutputs(e){let i=this.object.getValue(e),r=this.array.getValue(e);if(r)this.index.setValue(new Ee(r.indexOf(i)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var t=!1;function ip(){if(t)return;t=!0,o("FlowGraphIndexOfBlock",tp)}ip();
export{tp,ip};

//# debugId=D6D1F446DE11098264756E2164756E21
//# sourceMappingURL=site-c97cwax2.js.map
