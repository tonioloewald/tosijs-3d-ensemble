import{Bl as d}from"./site-jpy93jm3.js";import{RC as e}from"./site-eq33q5cn.js";var n="kernelBlurVertex",t="sampleCoord{X}=sampleCenter+delta*KERNEL_OFFSET{X};";if(!e.IncludesShadersStore[n])e.IncludesShadersStore[n]=t;var a={name:n,shader:t};var o="kernelBlurVertexShader",i=`attribute vec2 position;uniform vec2 delta;varying vec2 sampleCenter;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
sampleCenter=(position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;if(!e.ShadersStore[o])e.ShadersStore[o]=i;var l=[d,a];for(let r of l)if(!e.IncludesShadersStore[r.name])e.IncludesShadersStore[r.name]=r.shader;var f={name:o,shader:i};
export{f as nl};

//# debugId=622169D34C1AE6F464756E2164756E21
//# sourceMappingURL=site-ndpbd62h.js.map
