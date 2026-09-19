import{Vz as a}from"./site-fypy0ssm.js";import{Wz as r}from"./site-9re6xjgb.js";import{RC as e}from"./site-eq33q5cn.js";import"./site-dmc53f0j.js";var n="selectionPixelShader",d=`#ifdef INSTANCES
flat varying float vSelectionId;
#else
uniform float selectionId;
#endif
#ifdef STORE_CAMERASPACE_Z
varying float vViewPosZ;
#else
varying float vDepthMetric;
#endif
#ifdef ALPHATEST
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
discard;
#endif
#ifdef INSTANCES
float id=vSelectionId;
#else
float id=selectionId;
#endif
#ifdef STORE_CAMERASPACE_Z
gl_FragColor=vec4(id,vViewPosZ,0.0,1.0);
#else
gl_FragColor=vec4(id,vDepthMetric,0.0,1.0);
#endif
#define CUSTOM_FRAGMENT_MAIN_END
}
`;if(!e.ShadersStore[n])e.ShadersStore[n]=d;var o=[r,a];for(let i of o)if(!e.IncludesShadersStore[i.name])e.IncludesShadersStore[i.name]=i.shader;var S={name:n,shader:d};export{S as selectionPixelShader};

//# debugId=968B03A77CCECAD364756E2164756E21
//# sourceMappingURL=selection.fragment-wr5wpjv9.js.map
