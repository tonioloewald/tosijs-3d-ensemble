function l(t){let e=t._getGlobalContextVariable("activeDelayIndices",null);if(!e)e=new Set,t._setGlobalContextVariable("activeDelayIndices",e);return e}function a(t,e){l(t).add(e)}function i(t,e){t._getGlobalContextVariable("activeDelayIndices",null)?.delete(e)}function n(t,e){return t._getGlobalContextVariable("activeDelayIndices",null)?.has(e)??!1}
export{a as Rr,i as Sr,n as Tr};

//# debugId=A56910486F75BFCC64756E2164756E21
//# sourceMappingURL=site-0j30pnt2.js.map
