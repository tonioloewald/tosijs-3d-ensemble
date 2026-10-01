import{He}from"./site-gh92gf7j.js";import{Ye}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";import{l}from"./site-sqgademg.js";class Xc extends He{constructor(t){super(t);this.config=t,this.condition=this.registerDataInput("condition",Ye),this.executionFlow=this._registerSignalOutput("executionFlow"),this.completed=this._registerSignalOutput("completed"),this._unregisterSignalOutput("out")}_execute(t,a){let i=this.condition.getValue(t);if(this.config?.doWhile&&!i)this.executionFlow._activateSignal(t);let e=0;while(i){if(this.executionFlow._activateSignal(t),++e,e>=Xc.MaxLoopCount){l.Warn("FlowGraphWhileLoopBlock: Max loop count reached. Breaking.");break}i=this.condition.getValue(t)}this.completed._activateSignal(t)}getClassName(){return"FlowGraphWhileLoopBlock"}}Xc.MaxLoopCount=1000;var r=!1;function Tm(){if(r)return;r=!0,o("FlowGraphWhileLoopBlock",Xc)}Tm();
export{Xc,Tm};

//# debugId=12E988DEB6C7974264756E2164756E21
//# sourceMappingURL=site-tnevbxn9.js.map
