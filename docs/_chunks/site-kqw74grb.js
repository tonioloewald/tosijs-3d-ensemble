import{He,qt,Oa}from"./site-x7zr027n.js";import{Zt}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class Um extends He{constructor(e){super(e);this.delayIndex=this.registerDataInput("delayIndex",Zt)}_execute(e,i){let r=qt(this.delayIndex.getValue(e));if(r<0||isNaN(r)||!isFinite(r))return this._reportError(e,"Invalid delay index");let a=e._getGlobalContextVariable("pendingDelays",[]),l=a[r];if(l)l.dispose(),delete a[r],e._setGlobalContextVariable("pendingDelays",a);Oa(e,r),this.out._activateSignal(e)}getClassName(){return"FlowGraphCancelDelayBlock"}}var t=!1;function Wm(){if(t)return;t=!0,o("FlowGraphCancelDelayBlock",Um)}Wm();
export{Um,Wm};

//# debugId=F30DB8589A50B9FC64756E2164756E21
//# sourceMappingURL=site-kqw74grb.js.map
