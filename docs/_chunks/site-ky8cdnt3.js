import{RC as o}from"./site-eq33q5cn.js";var e="fogFragment",r=`#ifdef FOG
float fog=CalcFogFactor();
#ifdef PBR
fog=toLinearSpace(fog);
#endif
color.rgb=mix(vFogColor,color.rgb,fog);
#endif
`;if(!o.IncludesShadersStore[e])o.IncludesShadersStore[e]=r;var t={name:e,shader:r};
export{t as Uz};

//# debugId=4D1E28A8BB02969764756E2164756E21
//# sourceMappingURL=site-ky8cdnt3.js.map
