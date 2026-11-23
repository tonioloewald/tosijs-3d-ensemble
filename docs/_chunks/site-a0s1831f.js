function bd(t){if(!t)return null;if(typeof t==="string")return t;if(typeof t.play==="function")return null;let n=t.name;return typeof n==="string"?n:null}function hs(t,n){if(n&&typeof n.play==="function")return n;let o=bd(n);return o!==null?t.configuration.coordinator.getSoundAsset(o):null}
export{bd,hs};

//# debugId=1BB707A2D622B05F64756E2164756E21
//# sourceMappingURL=site-a0s1831f.js.map
