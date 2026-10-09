import{He}from"./site-228z8wgn.js";import{Ye}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";import{l}from"./site-sqgademg.js";class Xc extends He{constructor(t){super(t);this.config=t,this.condition=this.registerDataInput("condition",Ye),this.executionFlow=this._registerSignalOutput("executionFlow"),this.completed=this._registerSignalOutput("completed"),this._unregisterSignalOutput("out")}_execute(t,a){let i=this.condition.getValue(t);if(this.config?.doWhile&&!i)this.executionFlow._activateSignal(t);let e=0;while(i){if(this.executionFlow._activateSignal(t),++e,e>=Xc.MaxLoopCount){l.Warn("FlowGraphWhileLoopBlock: Max loop count reached. Breaking.");break}i=this.condition.getValue(t)}this.completed._activateSignal(t)}getClassName(){return"FlowGraphWhileLoopBlock"}}Xc.MaxLoopCount=1000;var r=!1;function wm(){if(r)return;r=!0,o("FlowGraphWhileLoopBlock",Xc)}wm();
export{Xc,wm};

//# debugId=27F99CE1C001545564756E2164756E21
//# sourceMappingURL=site-k5v2wx3n.js.map
