import{i}from"./site-1yf4ncc8.js";var e="fogVertexDeclaration",r=`#ifdef FOG
varying vFogDistance: vec3f;
#endif
`;if(!i.IncludesShadersStoreWGSL[e])i.IncludesShadersStoreWGSL[e]=r;var it={name:e,shader:r};var o="fogVertex",t=`#ifdef FOG
#ifdef SCENE_UBO
vertexOutputs.vFogDistance=(scene.view*worldPos).xyz;
#else
vertexOutputs.vFogDistance=(uniforms.view*worldPos).xyz;
#endif
#endif
`;if(!i.IncludesShadersStoreWGSL[o])i.IncludesShadersStoreWGSL[o]=t;var ct={name:o,shader:t};
export{it,ct};

//# debugId=CEF74C7D6C86B87864756E2164756E21
//# sourceMappingURL=site-vc4jxf6y.js.map
