import{TC as r}from"./site-qntg4d3x.js";var i="lightProxyPixelShader",o=`flat varying vec2 vLimits;flat varying highp uint vMask;void main(void) {if (gl_FragCoord.y<vLimits.x || gl_FragCoord.y>vLimits.y) {discard;}
gl_FragColor=vec4(vMask,0,0,1);}
`;if(!r.ShadersStore[i])r.ShadersStore[i]=o;var t={name:i,shader:o};
export{t as Vh};

//# debugId=2126BA9C2095E10064756E2164756E21
//# sourceMappingURL=site-5srwpwsf.js.map
