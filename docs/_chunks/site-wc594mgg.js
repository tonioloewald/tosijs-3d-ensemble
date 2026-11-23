import{Ye,si,Pl}from"./site-bs4qmp9a.js";import{ai}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class kg extends Ye{constructor(e){super(e);this.delayIndex=this.registerDataInput("delayIndex",ai)}_execute(e,l){let a=si(this.delayIndex.getValue(e));if(a<0||isNaN(a)||!isFinite(a)){if(this.config?.ignoreInvalidDelay){this.out._activateSignal(e);return}return this._reportError(e,"Invalid delay index")}let i=e._getGlobalContextVariable("pendingDelays",[]),r=i[a];if(r)r.dispose(),delete i[a],e._setGlobalContextVariable("pendingDelays",i);Pl(e,a),this.out._activateSignal(e)}getClassName(){return"FlowGraphCancelDelayBlock"}}var t=!1;function Vg(){if(t)return;t=!0,o("FlowGraphCancelDelayBlock",kg)}
export{kg,Vg};

//# debugId=15A7D643FFCE418B64756E2164756E21
//# sourceMappingURL=site-wc594mgg.js.map
