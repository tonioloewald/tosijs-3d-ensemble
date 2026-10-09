import{Le}from"./site-228z8wgn.js";import{R,Qt}from"./site-qrpgd9aj.js";import{ye}from"./site-x5hpt1ja.js";import{o}from"./site-nky97gw9.js";class tp extends Le{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",R),this.array=this.registerDataInput("array",R),this.index=this.registerDataOutput("index",Qt,new ye(-1))}_updateOutputs(e){let i=this.object.getValue(e),r=this.array.getValue(e);if(r)this.index.setValue(new ye(r.indexOf(i)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var t=!1;function ip(){if(t)return;t=!0,o("FlowGraphIndexOfBlock",tp)}ip();
export{tp,ip};

//# debugId=13A6F022CB08B84B64756E2164756E21
//# sourceMappingURL=site-3wra5y75.js.map
