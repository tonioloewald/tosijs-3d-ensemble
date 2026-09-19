import{RC as e}from"./site-eq33q5cn.js";var o="fogVertex",t=`#ifdef FOG
#ifdef SCENE_UBO
vertexOutputs.vFogDistance=(scene.view*worldPos).xyz;
#else
vertexOutputs.vFogDistance=(uniforms.view*worldPos).xyz;
#endif
#endif
`;if(!e.IncludesShadersStoreWGSL[o])e.IncludesShadersStoreWGSL[o]=t;var s={name:o,shader:t};
export{s as fB};

//# debugId=E8E652C0DF93FE3B64756E2164756E21
//# sourceMappingURL=site-w3a7hzs8.js.map
