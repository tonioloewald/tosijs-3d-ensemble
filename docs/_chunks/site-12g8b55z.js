import{TC as a}from"./site-qntg4d3x.js";var r="shadowMapFragmentSoftTransparentShadow",o=`#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x*alpha) discard;
#endif
`;if(!a.IncludesShadersStore[r])a.IncludesShadersStore[r]=o;var t={name:r,shader:o};
export{t as nk};

//# debugId=E3DC158B80FC1AA264756E2164756E21
//# sourceMappingURL=site-12g8b55z.js.map
