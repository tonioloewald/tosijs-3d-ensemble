import{TC as e}from"./site-qntg4d3x.js";var d="depthPrePass",r=`#ifdef DEPTHPREPASS
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color= vec4f(0.,0.,0.,1.0);
#endif
#ifndef DEPTHPREPASS_SKIP_EARLY_RETURN
return fragmentOutputs;
#endif
#endif
`;if(!e.IncludesShadersStoreWGSL[d])e.IncludesShadersStoreWGSL[d]=r;var S={name:d,shader:r};
export{S as HA};

//# debugId=53C5D3A7A3D4256364756E2164756E21
//# sourceMappingURL=site-s2s9nc60.js.map
