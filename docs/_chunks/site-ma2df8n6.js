import{He,qt,Ma}from"./site-e2p70xxb.js";import{Zt}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class wm extends He{constructor(e){super(e);this.delayIndex=this.registerDataInput("delayIndex",Zt)}_execute(e,i){let r=qt(this.delayIndex.getValue(e));if(r<0||isNaN(r)||!isFinite(r))return this._reportError(e,"Invalid delay index");let a=e._getGlobalContextVariable("pendingDelays",[]),l=a[r];if(l)l.dispose(),delete a[r],e._setGlobalContextVariable("pendingDelays",a);Ma(e,r),this.out._activateSignal(e)}getClassName(){return"FlowGraphCancelDelayBlock"}}var t=!1;function Dm(){if(t)return;t=!0,o("FlowGraphCancelDelayBlock",wm)}Dm();
export{wm,Dm};

//# debugId=6E41F1DFE54FD4C064756E2164756E21
//# sourceMappingURL=site-ma2df8n6.js.map
