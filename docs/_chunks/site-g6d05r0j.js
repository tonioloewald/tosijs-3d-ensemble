import{i}from"./site-1yf4ncc8.js";var e="fogVertexDeclaration",r=`#ifdef FOG
varying vFogDistance: vec3f;
#endif
`;if(!i.IncludesShadersStoreWGSL[e])i.IncludesShadersStoreWGSL[e]=r;var rt={name:e,shader:r};var o="fogVertex",t=`#ifdef FOG
#ifdef SCENE_UBO
vertexOutputs.vFogDistance=(scene.view*worldPos).xyz;
#else
vertexOutputs.vFogDistance=(uniforms.view*worldPos).xyz;
#endif
#endif
`;if(!i.IncludesShadersStoreWGSL[o])i.IncludesShadersStoreWGSL[o]=t;var ht={name:o,shader:t};
export{rt,ht};

//# debugId=35B163B7F97F18D964756E2164756E21
//# sourceMappingURL=site-g6d05r0j.js.map
