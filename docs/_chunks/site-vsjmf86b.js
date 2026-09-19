import{RC as r}from"./site-eq33q5cn.js";var i="lightProxyPixelShader",o=`flat varying vec2 vLimits;flat varying highp uint vMask;void main(void) {if (gl_FragCoord.y<vLimits.x || gl_FragCoord.y>vLimits.y) {discard;}
gl_FragColor=vec4(vMask,0,0,1);}
`;if(!r.ShadersStore[i])r.ShadersStore[i]=o;var t={name:i,shader:o};
export{t as Th};

//# debugId=099C9E8E94A3479D64756E2164756E21
//# sourceMappingURL=site-vsjmf86b.js.map
