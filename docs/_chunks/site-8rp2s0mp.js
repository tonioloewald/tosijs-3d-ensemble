import{RC as o}from"./site-eq33q5cn.js";var r="oitBackBlendPixelShader",e=`precision highp float;uniform sampler2D uBackColor;void main() {glFragColor=texelFetch(uBackColor,ivec2(gl_FragCoord.xy),0);if (glFragColor.a==0.0) { 
discard;}}`;if(!o.ShadersStore[r])o.ShadersStore[r]=e;var i={name:r,shader:e};
export{i as Ym};

//# debugId=17787977C1BB85D164756E2164756E21
//# sourceMappingURL=site-8rp2s0mp.js.map
