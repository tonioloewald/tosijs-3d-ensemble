var c=new WeakMap,l=new WeakMap,p=new WeakMap;function i(e){return e==="selectable"?p:l}function s(e,t){return i(t).get(e)??!0}function d(e,t){let n=e;while(n){if(!s(n,t))return!1;n=n.parent}return!0}function a(e,t,n){if(t==="selectable")e.isPickable=n;else e._isPointerMovePickable=n}function f(e,t){let n=d(e,t),r=e._primitiveBabylonMeshes??[];for(let u of r)a(u,t,n);let o=e._babylonTransformNode;if(o&&"isPickable"in o)a(o,t,n)}function N(e,t){let n=e;while(n){if(n===t)return!0;n=n.parent}return!1}function Kh(e,t,n){let r=i(t);for(let o of e)c.set(o,e),r.set(o,n(o)??!0);for(let o of e)f(o,t)}function Jh(e,t){return s(e,t)}function ef(e,t,n){i(t).set(e,n);let r=c.get(e)??[e];for(let o of r)if(N(o,e))f(o,t)}function Iu(e){let t=e?._babylonTransformNode;return{className:t?.getClassName(),id:t?.id,uniqueId:t?.uniqueId}}
export{Kh,Jh,ef,Iu};

//# debugId=1948087A4E9437CE64756E2164756E21
//# sourceMappingURL=site-wt7p6g5j.js.map
