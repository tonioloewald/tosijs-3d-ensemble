import{TC as o}from"./site-qntg4d3x.js";var r="fogFragment",e=`#ifdef FOG
var fog: f32=CalcFogFactor();
#ifdef PBR
fog=toLinearSpace(fog);
#endif
color= vec4f(mix(uniforms.vFogColor,color.rgb,fog),color.a);
#endif
`;if(!o.IncludesShadersStoreWGSL[r])o.IncludesShadersStoreWGSL[r]=e;var a={name:r,shader:e};
export{a as nB};

//# debugId=4593B178C775AAD964756E2164756E21
//# sourceMappingURL=site-qyq8ndc8.js.map
