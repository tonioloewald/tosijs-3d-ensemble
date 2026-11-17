import{i}from"./site-1yf4ncc8.js";var e="fogVertexDeclaration",r=`#ifdef FOG
varying vFogDistance: vec3f;
#endif
`;if(!i.IncludesShadersStoreWGSL[e])i.IncludesShadersStoreWGSL[e]=r;var at={name:e,shader:r};var o="fogVertex",t=`#ifdef FOG
#ifdef SCENE_UBO
vertexOutputs.vFogDistance=(scene.view*worldPos).xyz;
#else
vertexOutputs.vFogDistance=(uniforms.view*worldPos).xyz;
#endif
#endif
`;if(!i.IncludesShadersStoreWGSL[o])i.IncludesShadersStoreWGSL[o]=t;var pt={name:o,shader:t};
export{at,pt};

//# debugId=54B5AE3B5C78E53F64756E2164756E21
//# sourceMappingURL=site-xvg6m411.js.map
