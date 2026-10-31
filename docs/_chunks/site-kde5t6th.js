import{He}from"./site-td3n9zy5.js";import{Ye}from"./site-zgpxnm1e.js";import{o}from"./site-8ek23vdm.js";import{c}from"./site-h3pwfkan.js";class Xc extends He{constructor(t){super(t);this.config=t,this.condition=this.registerDataInput("condition",Ye),this.executionFlow=this._registerSignalOutput("executionFlow"),this.completed=this._registerSignalOutput("completed"),this._unregisterSignalOutput("out")}_execute(t,l){let i=this.condition.getValue(t);if(this.config?.doWhile&&!i)this.executionFlow._activateSignal(t);let e=0;while(i){if(this.executionFlow._activateSignal(t),++e,e>=Xc.MaxLoopCount){c.Warn("FlowGraphWhileLoopBlock: Max loop count reached. Breaking.");break}i=this.condition.getValue(t)}this.completed._activateSignal(t)}getClassName(){return"FlowGraphWhileLoopBlock"}}Xc.MaxLoopCount=1000;var r=!1;function Rm(){if(r)return;r=!0,o("FlowGraphWhileLoopBlock",Xc)}Rm();
export{Xc,Rm};

//# debugId=D42DA0E2D51DF27C64756E2164756E21
//# sourceMappingURL=site-kde5t6th.js.map
