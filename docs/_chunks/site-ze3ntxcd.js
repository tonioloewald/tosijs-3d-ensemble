import{TC as a}from"./site-qntg4d3x.js";var r="shadowMapFragmentSoftTransparentShadow",o=`#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(((fragmentInputs.position.xy)%(8.0)))))/64.0>=uniforms.softTransparentShadowSM.x*alpha) {discard;}
#endif
`;if(!a.IncludesShadersStoreWGSL[r])a.IncludesShadersStoreWGSL[r]=o;var t={name:r,shader:o};
export{t as hk};

//# debugId=61747D87D984521564756E2164756E21
//# sourceMappingURL=site-ze3ntxcd.js.map
