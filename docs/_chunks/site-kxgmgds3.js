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
`;if(!i.IncludesShadersStoreWGSL[o])i.IncludesShadersStoreWGSL[o]=t;var ct={name:o,shader:t};
export{rt,ct};

//# debugId=76F3EF64694E9EB064756E2164756E21
//# sourceMappingURL=site-kxgmgds3.js.map
