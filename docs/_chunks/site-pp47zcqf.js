import{He,jt,Oa}from"./site-3q4gqkf5.js";import{Qt}from"./site-9g37ftzw.js";import{o}from"./site-16qs5rck.js";class Um extends He{constructor(e){super(e);this.delayIndex=this.registerDataInput("delayIndex",Qt)}_execute(e,i){let r=jt(this.delayIndex.getValue(e));if(r<0||isNaN(r)||!isFinite(r))return this._reportError(e,"Invalid delay index");let a=e._getGlobalContextVariable("pendingDelays",[]),l=a[r];if(l)l.dispose(),delete a[r],e._setGlobalContextVariable("pendingDelays",a);Oa(e,r),this.out._activateSignal(e)}getClassName(){return"FlowGraphCancelDelayBlock"}}var t=!1;function Wm(){if(t)return;t=!0,o("FlowGraphCancelDelayBlock",Um)}Wm();
export{Um,Wm};

//# debugId=C5D440973953F75C64756E2164756E21
//# sourceMappingURL=site-pp47zcqf.js.map
