import{Ye,si,Ml}from"./site-3s1j98fr.js";import{ai}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class F_ extends Ye{constructor(e){super(e);this.delayIndex=this.registerDataInput("delayIndex",ai)}_execute(e,l){let a=si(this.delayIndex.getValue(e));if(a<0||isNaN(a)||!isFinite(a)){if(this.config?.ignoreInvalidDelay){this.out._activateSignal(e);return}return this._reportError(e,"Invalid delay index")}let i=e._getGlobalContextVariable("pendingDelays",[]),r=i[a];if(r)r.dispose(),delete i[a],e._setGlobalContextVariable("pendingDelays",i);Ml(e,a),this.out._activateSignal(e)}getClassName(){return"FlowGraphCancelDelayBlock"}}var t=!1;function V_(){if(t)return;t=!0,o("FlowGraphCancelDelayBlock",F_)}
export{F_,V_};

//# debugId=5FB04685BDEC987B64756E2164756E21
//# sourceMappingURL=site-n8j6qnnn.js.map
