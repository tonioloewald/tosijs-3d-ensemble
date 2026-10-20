import{He,jt,Ma}from"./site-enc8r1rf.js";import{Qt}from"./site-j2m5wc1b.js";import{o}from"./site-whc0p6f0.js";class Um extends He{constructor(e){super(e);this.delayIndex=this.registerDataInput("delayIndex",Qt)}_execute(e,i){let r=jt(this.delayIndex.getValue(e));if(r<0||isNaN(r)||!isFinite(r))return this._reportError(e,"Invalid delay index");let a=e._getGlobalContextVariable("pendingDelays",[]),l=a[r];if(l)l.dispose(),delete a[r],e._setGlobalContextVariable("pendingDelays",a);Ma(e,r),this.out._activateSignal(e)}getClassName(){return"FlowGraphCancelDelayBlock"}}var t=!1;function Wm(){if(t)return;t=!0,o("FlowGraphCancelDelayBlock",Um)}Wm();
export{Um,Wm};

//# debugId=076353FF0334237564756E2164756E21
//# sourceMappingURL=site-05veyqfa.js.map
