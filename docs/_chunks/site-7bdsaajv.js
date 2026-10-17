import{He}from"./site-vc4knhgc.js";import{Ye}from"./site-1fkjz1t9.js";import{o}from"./site-bg3xbkq8.js";import{c}from"./site-h3pwfkan.js";class Xc extends He{constructor(t){super(t);this.config=t,this.condition=this.registerDataInput("condition",Ye),this.executionFlow=this._registerSignalOutput("executionFlow"),this.completed=this._registerSignalOutput("completed"),this._unregisterSignalOutput("out")}_execute(t,l){let i=this.condition.getValue(t);if(this.config?.doWhile&&!i)this.executionFlow._activateSignal(t);let e=0;while(i){if(this.executionFlow._activateSignal(t),++e,e>=Xc.MaxLoopCount){c.Warn("FlowGraphWhileLoopBlock: Max loop count reached. Breaking.");break}i=this.condition.getValue(t)}this.completed._activateSignal(t)}getClassName(){return"FlowGraphWhileLoopBlock"}}Xc.MaxLoopCount=1000;var r=!1;function wm(){if(r)return;r=!0,o("FlowGraphWhileLoopBlock",Xc)}wm();
export{Xc,wm};

//# debugId=2A409D277EE9D60064756E2164756E21
//# sourceMappingURL=site-7bdsaajv.js.map
