import{Ye}from"./site-bs4qmp9a.js";import{He}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";import{c}from"./site-h3pwfkan.js";class ah extends Ye{constructor(t){super(t);this.config=t,this.condition=this.registerDataInput("condition",He),this.executionFlow=this._registerSignalOutput("executionFlow"),this.completed=this._registerSignalOutput("completed"),this._unregisterSignalOutput("out")}_execute(t,r){let i=this.condition.getValue(t);if(this.config?.doWhile&&!i)this.executionFlow._activateSignal(t);let e=0;while(i){if(this.executionFlow._activateSignal(t),++e,e>=ah.MaxLoopCount){c.Warn("FlowGraphWhileLoopBlock: Max loop count reached. Breaking.");break}i=this.condition.getValue(t)}this.completed._activateSignal(t)}getClassName(){return"FlowGraphWhileLoopBlock"}}ah.MaxLoopCount=1000;var l=!1;function Cg(){if(l)return;l=!0,o("FlowGraphWhileLoopBlock",ah)}
export{ah,Cg};

//# debugId=D360355855292A0864756E2164756E21
//# sourceMappingURL=site-axwsxp8r.js.map
