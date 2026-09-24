import{TC as o}from"./site-qntg4d3x.js";import"./site-mqm1jg4s.js";var r="oitFinalSimpleBlendPixelShader",e=`precision highp float;uniform sampler2D uFrontColor;void main() {ivec2 fragCoord=ivec2(gl_FragCoord.xy);vec4 frontColor=texelFetch(uFrontColor,fragCoord,0);glFragColor=frontColor;}
`;if(!o.ShadersStore[r])o.ShadersStore[r]=e;var l={name:r,shader:e};export{l as oitFinalSimpleBlendPixelShader};

//# debugId=91D18AA9C26996E064756E2164756E21
//# sourceMappingURL=oitFinalSimpleBlend.fragment-1rv6zf7z.js.map
