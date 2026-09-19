import{RC as o}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var r="oitFinalSimpleBlendPixelShader",e=`precision highp float;uniform sampler2D uFrontColor;void main() {ivec2 fragCoord=ivec2(gl_FragCoord.xy);vec4 frontColor=texelFetch(uFrontColor,fragCoord,0);glFragColor=frontColor;}
`;if(!o.ShadersStore[r])o.ShadersStore[r]=e;var l={name:r,shader:e};export{l as oitFinalSimpleBlendPixelShader};

//# debugId=BF4FC9EF0291410164756E2164756E21
//# sourceMappingURL=oitFinalSimpleBlend.fragment-kr8yy38b.js.map
