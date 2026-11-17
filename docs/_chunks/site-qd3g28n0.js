function cn(r,e){let n=r._getGlobalContextVariable("animationGroupObserverSets",new Map),o=n.get(e.uniqueId);if(!o)return;return e.onAnimationGroupEndObservable.remove(o.groupEnd),e.onAnimationEndObservable.remove(o.animationEnd),e.onAnimationLoopObservable.remove(o.animationLoop),e.onAnimationGroupLoopObservable.remove(o.groupLoop),n.delete(e.uniqueId),r._setGlobalContextVariable("animationGroupObserverSets",n),o.block}
export{cn};

//# debugId=3654B3EA22808D8764756E2164756E21
//# sourceMappingURL=site-qd3g28n0.js.map
