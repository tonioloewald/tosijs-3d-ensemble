import{He,qt,Ma}from"./site-gh92gf7j.js";import{Zt}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class Pm extends He{constructor(e){super(e);this.delayIndex=this.registerDataInput("delayIndex",Zt)}_execute(e,i){let r=qt(this.delayIndex.getValue(e));if(r<0||isNaN(r)||!isFinite(r))return this._reportError(e,"Invalid delay index");let a=e._getGlobalContextVariable("pendingDelays",[]),l=a[r];if(l)l.dispose(),delete a[r],e._setGlobalContextVariable("pendingDelays",a);Ma(e,r),this.out._activateSignal(e)}getClassName(){return"FlowGraphCancelDelayBlock"}}var t=!1;function Dm(){if(t)return;t=!0,o("FlowGraphCancelDelayBlock",Pm)}Dm();
export{Pm,Dm};

//# debugId=8449FABB53027FF764756E2164756E21
//# sourceMappingURL=site-qbztnbkb.js.map
