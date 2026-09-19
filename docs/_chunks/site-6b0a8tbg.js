import{RC as e}from"./site-eq33q5cn.js";var d="depthPrePass",r=`#ifdef DEPTHPREPASS
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color= vec4f(0.,0.,0.,1.0);
#endif
#ifndef DEPTHPREPASS_SKIP_EARLY_RETURN
return fragmentOutputs;
#endif
#endif
`;if(!e.IncludesShadersStoreWGSL[d])e.IncludesShadersStoreWGSL[d]=r;var S={name:d,shader:r};
export{S as FA};

//# debugId=41CAD96702308F9064756E2164756E21
//# sourceMappingURL=site-6b0a8tbg.js.map
