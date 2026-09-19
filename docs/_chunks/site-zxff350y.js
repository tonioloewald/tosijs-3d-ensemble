import{RC as o}from"./site-eq33q5cn.js";var r="fogFragment",e=`#ifdef FOG
var fog: f32=CalcFogFactor();
#ifdef PBR
fog=toLinearSpace(fog);
#endif
color= vec4f(mix(uniforms.vFogColor,color.rgb,fog),color.a);
#endif
`;if(!o.IncludesShadersStoreWGSL[r])o.IncludesShadersStoreWGSL[r]=e;var a={name:r,shader:e};
export{a as lB};

//# debugId=70A30A730B6A643064756E2164756E21
//# sourceMappingURL=site-zxff350y.js.map
