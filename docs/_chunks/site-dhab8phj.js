import{TC as o}from"./site-qntg4d3x.js";var e="fogFragment",r=`#ifdef FOG
float fog=CalcFogFactor();
#ifdef PBR
fog=toLinearSpace(fog);
#endif
color.rgb=mix(vFogColor,color.rgb,fog);
#endif
`;if(!o.IncludesShadersStore[e])o.IncludesShadersStore[e]=r;var t={name:e,shader:r};
export{t as Wz};

//# debugId=3DDDC59CF9B6ADA864756E2164756E21
//# sourceMappingURL=site-dhab8phj.js.map
