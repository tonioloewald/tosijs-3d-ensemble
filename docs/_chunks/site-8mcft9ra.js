import{RC as a}from"./site-eq33q5cn.js";var r="shadowMapFragmentSoftTransparentShadow",o=`#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(((fragmentInputs.position.xy)%(8.0)))))/64.0>=uniforms.softTransparentShadowSM.x*alpha) {discard;}
#endif
`;if(!a.IncludesShadersStoreWGSL[r])a.IncludesShadersStoreWGSL[r]=o;var t={name:r,shader:o};
export{t as fk};

//# debugId=A1A2510E6EF14AD364756E2164756E21
//# sourceMappingURL=site-8mcft9ra.js.map
