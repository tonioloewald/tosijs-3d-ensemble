import{xu as u}from"./site-gx4ww0cp.js";import{_u as r}from"./site-p0rrvqfa.js";import{ev as e}from"./site-8hb0g46e.js";import{jF as s}from"./site-6873nq4n.js";class a extends u{constructor(t={}){super(t);this.config=t,this.config.startIndex=t.startIndex??new e(0),this.reset=this._registerSignalInput("reset"),this.maxExecutions=this.registerDataInput("maxExecutions",r),this.executionCount=this.registerDataOutput("executionCount",r,new e(0))}_execute(t,l){if(l===this.reset)this.executionCount.setValue(this.config.startIndex,t);else{let i=this.executionCount.getValue(t);if(i.value<this.maxExecutions.getValue(t).value)this.executionCount.setValue(new e(i.value+1),t),this.out._activateSignal(t)}}getClassName(){return"FlowGraphDoNBlock"}}var o=!1;function n(){if(o)return;o=!0,s("FlowGraphDoNBlock",a)}n();
export{a as qp,n as rp};

//# debugId=F2A7D207982A38DD64756E2164756E21
//# sourceMappingURL=site-ryzw7v6g.js.map
