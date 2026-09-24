import{Ur as p}from"./site-s6xb5zxm.js";import{Fs as n}from"./site-efy4jtqr.js";import{zu as s}from"./site-s1smryc8.js";import{av as o}from"./site-y0mephjk.js";import{lF as i}from"./site-54y5gp1n.js";class c extends s{constructor(e){super(e);this.delayIndex=this.registerDataInput("delayIndex",o)}_execute(e,m){let r=n(this.delayIndex.getValue(e));if(r<0||isNaN(r)||!isFinite(r))return this._reportError(e,"Invalid delay index");let a=e._getGlobalContextVariable("pendingDelays",[]),l=a[r];if(l)l.dispose(),delete a[r],e._setGlobalContextVariable("pendingDelays",a);p(e,r),this.out._activateSignal(e)}getClassName(){return"FlowGraphCancelDelayBlock"}}var t=!1;function d(){if(t)return;t=!0,i("FlowGraphCancelDelayBlock",c)}d();
export{c as Rr,d as Sr};

//# debugId=B9BB59D04C42A80E64756E2164756E21
//# sourceMappingURL=site-p0yqbv5r.js.map
