import{RC as t}from"./site-eq33q5cn.js";var e="logDepthVertex",r=`#ifdef LOGARITHMICDEPTH
vertexOutputs.vFragmentDepth=1.0+vertexOutputs.position.w;vertexOutputs.position.z=log2(max(0.000001,vertexOutputs.vFragmentDepth))*uniforms.logarithmicDepthConstant;
#endif
`;if(!t.IncludesShadersStoreWGSL[e])t.IncludesShadersStoreWGSL[e]=r;var s={name:e,shader:r};
export{s as rA};

//# debugId=E6BC4CD13A90103B64756E2164756E21
//# sourceMappingURL=site-7b4wqcsz.js.map
