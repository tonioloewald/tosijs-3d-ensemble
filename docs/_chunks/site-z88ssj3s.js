import{Sr as p}from"./site-0j30pnt2.js";import{Ds as n}from"./site-3fcadxwq.js";import{xu as s}from"./site-gx4ww0cp.js";import{_u as o}from"./site-p0rrvqfa.js";import{jF as i}from"./site-6873nq4n.js";class c extends s{constructor(e){super(e);this.delayIndex=this.registerDataInput("delayIndex",o)}_execute(e,m){let r=n(this.delayIndex.getValue(e));if(r<0||isNaN(r)||!isFinite(r))return this._reportError(e,"Invalid delay index");let a=e._getGlobalContextVariable("pendingDelays",[]),l=a[r];if(l)l.dispose(),delete a[r],e._setGlobalContextVariable("pendingDelays",a);p(e,r),this.out._activateSignal(e)}getClassName(){return"FlowGraphCancelDelayBlock"}}var t=!1;function d(){if(t)return;t=!0,i("FlowGraphCancelDelayBlock",c)}d();
export{c as Pr,d as Qr};

//# debugId=FB721F2D9408FB5E64756E2164756E21
//# sourceMappingURL=site-z88ssj3s.js.map
