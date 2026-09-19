import{RC as o}from"./site-eq33q5cn.js";var e="gaussianSplattingFragmentDeclaration",n=`fn gaussianColor(inColor: vec4f,inPosition: vec2f)->vec4f
{var A : f32=-dot(inPosition,inPosition);if (A>-4.0)
{var B: f32=exp(A)*inColor.a;
#include<logDepthFragment>
var color: vec3f=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4f(color,B);} else {return vec4f(0.0);}}
`;if(!o.IncludesShadersStoreWGSL[e])o.IncludesShadersStoreWGSL[e]=n;var a={name:e,shader:n};
export{a as sz};

//# debugId=0E25E8E39F785CB064756E2164756E21
//# sourceMappingURL=site-7bmbqsnn.js.map
