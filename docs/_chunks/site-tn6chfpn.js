function bd(t){if(!t)return null;if(typeof t==="string")return t;if(typeof t.play==="function")return null;let n=t.name;return typeof n==="string"?n:null}function us(t,n){if(n&&typeof n.play==="function")return n;let o=bd(n);return o!==null?t.configuration.coordinator.getSoundAsset(o):null}
export{bd,us};

//# debugId=94ED76429C1BFC7064756E2164756E21
//# sourceMappingURL=site-tn6chfpn.js.map
