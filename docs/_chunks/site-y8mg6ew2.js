import{Dz as l}from"./site-231618cv.js";import{TC as e}from"./site-qntg4d3x.js";var r="copyTextureToTexturePixelShader",t=`uniform float conversion;uniform sampler2D textureSampler;uniform float lodLevel;varying vec2 vUV;
#include<helperFunctions>
void main(void) 
{
#ifdef NO_SAMPLER
vec4 color=texelFetch(textureSampler,ivec2(gl_FragCoord.xy),0);
#else
vec4 color=textureLod(textureSampler,vUV,lodLevel);
#endif
#ifdef DEPTH_TEXTURE
gl_FragDepth=color.r;
#else
if (conversion==1.) {color=toLinearSpace(color);} else if (conversion==2.) {color=toGammaSpace(color);}
gl_FragColor=color;
#endif
}
`;if(!e.ShadersStore[r])e.ShadersStore[r]=t;var c=[l];for(let o of c)if(!e.IncludesShadersStore[o.name])e.IncludesShadersStore[o.name]=o.shader;var a={name:r,shader:t};
export{a as El};

//# debugId=5C6A26445D167B7D64756E2164756E21
//# sourceMappingURL=site-y8mg6ew2.js.map
