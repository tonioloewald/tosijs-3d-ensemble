import{TC as e}from"./site-qntg4d3x.js";var r="iblCdfxPixelShader",i=`precision highp sampler2D;
#define PI 3.1415927
varying vec2 vUV;uniform sampler2D cdfy;void main(void) {ivec2 cdfyRes=textureSize(cdfy,0);ivec2 currentPixel=ivec2(gl_FragCoord.xy);float cdfx=0.0;for (int x=1; x<=currentPixel.x; x++) {cdfx+=texelFetch(cdfy,ivec2(x-1,cdfyRes.y-1),0).x;}
gl_FragColor=vec4(vec3(cdfx),1.0);}`;if(!e.ShadersStore[r])e.ShadersStore[r]=i;var d={name:r,shader:i};
export{d as Hi};

//# debugId=C4C59808A846823164756E2164756E21
//# sourceMappingURL=site-h0jeknyp.js.map
