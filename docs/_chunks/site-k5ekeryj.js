import{i}from"./site-1yf4ncc8.js";var t="logDepthVertex",e=`#ifdef LOGARITHMICDEPTH
vertexOutputs.vFragmentDepth=1.0+vertexOutputs.position.w;vertexOutputs.position.z=log2(max(0.000001,vertexOutputs.vFragmentDepth))*uniforms.logarithmicDepthConstant;
#endif
`;if(!i.IncludesShadersStoreWGSL[t])i.IncludesShadersStoreWGSL[t]=e;var et={name:t,shader:e};
export{et};

//# debugId=D15A4A3C29F9243264756E2164756E21
//# sourceMappingURL=site-k5ekeryj.js.map
