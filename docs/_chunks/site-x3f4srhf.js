import{RC as a}from"./site-eq33q5cn.js";var r="shadowMapFragmentSoftTransparentShadow",o=`#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x*alpha) discard;
#endif
`;if(!a.IncludesShadersStore[r])a.IncludesShadersStore[r]=o;var t={name:r,shader:o};
export{t as lk};

//# debugId=91671F89531B275A64756E2164756E21
//# sourceMappingURL=site-x3f4srhf.js.map
