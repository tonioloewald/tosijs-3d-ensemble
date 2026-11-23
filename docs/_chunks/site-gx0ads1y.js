import{i}from"./site-1yf4ncc8.js";var e="prePassDeclaration",r=`#ifdef PREPASS
#ifndef PREPASS_CUSTOM_VARYINGS
#ifdef PREPASS_LOCAL_POSITION
varying vPosition : vec3f;
#endif
#ifdef PREPASS_DEPTH
varying vViewPos: vec3f;
#endif
#ifdef PREPASS_NORMALIZED_VIEW_DEPTH
varying vNormViewDepth: f32;
#endif
#if (defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR)) && !defined(PREPASS_VELOCITY_ZERO)
varying vCurrentPosition: vec4f;varying vPreviousPosition: vec4f;
#endif
#endif
#ifdef PREPASS_OBJECT_ID
uniform objectId: f32;
#include<objectIdFunctions>
#endif
#ifdef PREPASS_MESH_BLEND_TAG
uniform meshBlendTag: i32;
#endif
#endif
`;if(!i.IncludesShadersStoreWGSL[e])i.IncludesShadersStoreWGSL[e]=r;var Es={name:e,shader:r};var t="logDepthFragment",S=`#ifdef LOGARITHMICDEPTH
fragmentOutputs.fragDepth=log2(fragmentInputs.vFragmentDepth)*uniforms.logarithmicDepthConstant*0.5;
#endif
`;if(!i.IncludesShadersStoreWGSL[t])i.IncludesShadersStoreWGSL[t]=S;var Ke={name:t,shader:S};var n="meshBlendTagFragmentOutput",f=`#if SCENE_MRT_COUNT>{X}
#if defined(PREPASS_MESH_BLEND_TAG) && PREPASS_MESH_BLEND_TAG_INDEX=={X}
fragmentOutputs.fragData{X}=meshBlendTagOutput;
#else
fragmentOutputs.fragData{X}=fragData[{X}];
#endif
#endif
`;if(!i.IncludesShadersStoreWGSL[n])i.IncludesShadersStoreWGSL[n]=f;var Rs={name:n,shader:f};
export{Es,Ke,Rs};

//# debugId=8D8DE65D519F16DD64756E2164756E21
//# sourceMappingURL=site-gx0ads1y.js.map
