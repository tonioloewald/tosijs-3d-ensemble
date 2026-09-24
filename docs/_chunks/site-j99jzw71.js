import{TC as o}from"./site-qntg4d3x.js";var r="oitBackBlendPixelShader",e=`precision highp float;uniform sampler2D uBackColor;void main() {glFragColor=texelFetch(uBackColor,ivec2(gl_FragCoord.xy),0);if (glFragColor.a==0.0) { 
discard;}}`;if(!o.ShadersStore[r])o.ShadersStore[r]=e;var i={name:r,shader:e};
export{i as _m};

//# debugId=1881CD482252899264756E2164756E21
//# sourceMappingURL=site-j99jzw71.js.map
