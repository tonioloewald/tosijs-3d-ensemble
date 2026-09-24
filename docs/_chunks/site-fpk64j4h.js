import{TC as e}from"./site-qntg4d3x.js";var o="fogVertex",t=`#ifdef FOG
#ifdef SCENE_UBO
vertexOutputs.vFogDistance=(scene.view*worldPos).xyz;
#else
vertexOutputs.vFogDistance=(uniforms.view*worldPos).xyz;
#endif
#endif
`;if(!e.IncludesShadersStoreWGSL[o])e.IncludesShadersStoreWGSL[o]=t;var s={name:o,shader:t};
export{s as hB};

//# debugId=3C0FBFA8233C04C964756E2164756E21
//# sourceMappingURL=site-fpk64j4h.js.map
