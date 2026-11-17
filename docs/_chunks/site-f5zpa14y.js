import{Ye}from"./site-3s1j98fr.js";import{He}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";import{c}from"./site-h3pwfkan.js";class au extends Ye{constructor(t){super(t);this.config=t,this.condition=this.registerDataInput("condition",He),this.executionFlow=this._registerSignalOutput("executionFlow"),this.completed=this._registerSignalOutput("completed"),this._unregisterSignalOutput("out")}_execute(t,r){let i=this.condition.getValue(t);if(this.config?.doWhile&&!i)this.executionFlow._activateSignal(t);let e=0;while(i){if(this.executionFlow._activateSignal(t),++e,e>=au.MaxLoopCount){c.Warn("FlowGraphWhileLoopBlock: Max loop count reached. Breaking.");break}i=this.condition.getValue(t)}this.completed._activateSignal(t)}getClassName(){return"FlowGraphWhileLoopBlock"}}au.MaxLoopCount=1000;var l=!1;function C_(){if(l)return;l=!0,o("FlowGraphWhileLoopBlock",au)}
export{au,C_};

//# debugId=CFE576AB635F3A4A64756E2164756E21
//# sourceMappingURL=site-f5zpa14y.js.map
