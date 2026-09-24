import{TC as t}from"./site-qntg4d3x.js";var e="logDepthVertex",r=`#ifdef LOGARITHMICDEPTH
vertexOutputs.vFragmentDepth=1.0+vertexOutputs.position.w;vertexOutputs.position.z=log2(max(0.000001,vertexOutputs.vFragmentDepth))*uniforms.logarithmicDepthConstant;
#endif
`;if(!t.IncludesShadersStoreWGSL[e])t.IncludesShadersStoreWGSL[e]=r;var s={name:e,shader:r};
export{s as tA};

//# debugId=88E484DA0D436DA564756E2164756E21
//# sourceMappingURL=site-6ba65z6z.js.map
