import{RC as o}from"./site-eq33q5cn.js";var e="gaussianSplattingFragmentDeclaration",r=`vec4 gaussianColor(vec4 inColor)
{float A=-dot(vPosition,vPosition);if (A<-4.0) discard;float B=exp(A)*inColor.a;
#include<logDepthFragment>
vec3 color=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4(color,B);}
`;if(!o.IncludesShadersStore[e])o.IncludesShadersStore[e]=r;var i={name:e,shader:r};
export{i as uz};

//# debugId=A87914FDCAADC59A64756E2164756E21
//# sourceMappingURL=site-09ma2t46.js.map
