import{Xe,jt,Oa}from"./site-4mctpt5x.js";import{Qt}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class $m extends Xe{constructor(e){super(e);this.delayIndex=this.registerDataInput("delayIndex",Qt)}_execute(e,i){let r=jt(this.delayIndex.getValue(e));if(r<0||isNaN(r)||!isFinite(r))return this._reportError(e,"Invalid delay index");let a=e._getGlobalContextVariable("pendingDelays",[]),l=a[r];if(l)l.dispose(),delete a[r],e._setGlobalContextVariable("pendingDelays",a);Oa(e,r),this.out._activateSignal(e)}getClassName(){return"FlowGraphCancelDelayBlock"}}var t=!1;function Ym(){if(t)return;t=!0,o("FlowGraphCancelDelayBlock",$m)}Ym();
export{$m,Ym};

//# debugId=15B529FDD4BE925264756E2164756E21
//# sourceMappingURL=site-3m6yh5n3.js.map
