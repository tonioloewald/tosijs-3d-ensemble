import{aa}from"./site-1bb6313h.js";import{u,o,g,e,R,d,a,h,x,r,t,s,Ft,v,Y,gi}from"./site-ny31phz1.js";import{Cr}from"./site-jk051cbj.js";import{Bs}from"./site-j2v5hv04.js";import{N}from"./site-nfmnnk88.js";import{vs}from"./site-543j09ns.js";import{af,lf,cf,hf}from"./site-vckht0d9.js";import{de,Bp}from"./site-gc7fn9d1.js";import{he}from"./site-t4bgahmf.js";import{Pr,Xr}from"./site-63h2wcpq.js";import{M,K,Yh,Xc,p}from"./site-vb8s0ev7.js";import{qe}from"./site-37a1epc6.js";import{ue}from"./site-hdn1zzmq.js";import{di,B}from"./site-kt4f6v5h.js";import{_}from"./site-6fm5q70t.js";import{Ci,Gn,Vs,ht,gr,eh,br,En,QE,Mm,ss,Om}from"./site-wj925gx8.js";import{C}from"./site-n8ftgwz5.js";import{n,ds}from"./site-814ppfq4.js";import{c}from"./site-h3pwfkan.js";import{i}from"./site-1yf4ncc8.js";var Re="gaussianPointSplattingBlitVertexShader",Je=`attribute position: vec3f;varying vScreenUv: vec2f;
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.position=vec4f(vertexInputs.position.xy,0.0,1.0);vertexOutputs.vScreenUv=vertexInputs.position.xy*0.5+vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!i.ShadersStoreWGSL[Re])i.ShadersStoreWGSL[Re]=Je;var QP={name:Re,shader:Je};var Be="gaussianPointSplattingBlitPixelShader",et=`uniform resolution: vec2f;uniform projZ: vec4f;uniform inverseProjection: mat4x4f;uniform useInverseProjection: f32;uniform logarithmicDepthConstant: f32;varying vScreenUv: vec2f;var<storage,read> accumBuffer : array<vec4f>;var<storage,read> accumDepth : array<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
let res=uniforms.resolution;let uv=clamp(fragmentInputs.vScreenUv,vec2f(0.0,0.0),vec2f(0.99999,0.99999));let pixel=vec2u(uv*res);let idx=pixel.y*u32(res.x)+pixel.x;let accumulated=accumBuffer[idx];if (accumulated.w<0.0015) {discard;}
fragmentOutputs.color=vec4f(accumulated.rgb,accumulated.w);var depth=accumDepth[idx];if (uniforms.logarithmicDepthConstant>0.0) {var clipW : f32;if (uniforms.useInverseProjection>0.5) {let ndcXY=(vec2f(pixel)+0.5)/res*2.0-1.0;let unprojected=uniforms.inverseProjection*vec4f(ndcXY,depth,1.0);clipW=1.0/unprojected.w;} else {let vz=(depth*uniforms.projZ.w-uniforms.projZ.z)/(uniforms.projZ.x-depth*uniforms.projZ.y);clipW=uniforms.projZ.y*vz+uniforms.projZ.w;}
depth=log2(max(0.000001,1.0+clipW))*uniforms.logarithmicDepthConstant*0.5;}
fragmentOutputs.fragDepth=depth;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;if(!i.ShadersStoreWGSL[Be])i.ShadersStoreWGSL[Be]=et;var qP={name:Be,shader:et};var Te="gaussianPointSplattingDepthBlitPixelShader",tt=`uniform resolution: vec2f;uniform depthValues: vec2f;uniform projZ: vec4f;uniform inverseProjection: mat4x4f;uniform useInverseProjection: f32;uniform reverseDepth: f32;varying vScreenUv: vec2f;var<storage,read> accumBuffer : array<vec4f>;var<storage,read> accumDepth : array<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
let res=uniforms.resolution;let uv=clamp(fragmentInputs.vScreenUv,vec2f(0.0,0.0),vec2f(0.99999,0.99999));let pixel=vec2u(uv*res);let idx=pixel.y*u32(res.x)+pixel.x;if (accumBuffer[idx].w<0.0015) {discard;}
let ndc=accumDepth[idx];var clipZ : f32;if (uniforms.useInverseProjection>0.5) {let ndcXY=(vec2f(pixel)+0.5)/res*2.0-1.0;let unprojected=uniforms.inverseProjection*vec4f(ndcXY,ndc,1.0);clipZ=ndc/unprojected.w;} else {let denom=uniforms.projZ.x-ndc*uniforms.projZ.y;let vz=(ndc*uniforms.projZ.w-uniforms.projZ.z)/denom;clipZ=uniforms.projZ.x*vz+uniforms.projZ.z;}
let signedClipZ=select(clipZ,-clipZ,uniforms.reverseDepth>0.5);let metric=(signedClipZ+uniforms.depthValues.x)/uniforms.depthValues.y;fragmentOutputs.color=vec4f(metric,0.0,0.0,1.0);fragmentOutputs.fragDepth=ndc;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;if(!i.ShadersStoreWGSL[Te])i.ShadersStoreWGSL[Te]=tt;var KP={name:Te,shader:tt};var Ee="gaussianPointSplatting",st=`const GPS_DEPTH_CLEAR : u32=0xFFFFFFFFu;const GPS_DEPTH_MAX_CODE : u32=65534u;const GPS_TWO_PI : f32=6.2831853071795864;const GPS_U32_TO_UNIT : f32=2.3283064365386963e-10; 
const GPS_PARTITION_BUCKETS : u32=65536u;struct GpsUniforms {view : mat4x4f,
viewProjection : mat4x4f,
resNearFar : vec4f,
params0 : vec4f, 
focal : vec4f, 
camPosDeg : vec4f, 
depthNorm : vec4f, 
hiZInfo : vec4f, 
misc : vec4f, 
pixelMap : vec4f, 
projection : mat4x4f,
inverseProjection : mat4x4f,
projectedDepth : vec4f,};fn gpsProjectedDepth(inverseProjection : mat4x4f,ndcXY : vec2f,viewZ : f32)->vec2f {let origin=inverseProjection*vec4f(ndcXY,0.0,1.0);let direction=inverseProjection[2];let depth=(viewZ*origin.w-origin.z)/(direction.z-viewZ*direction.w);return vec2f(depth,1.0/(origin.w+depth*direction.w));}
fn gpsCov2D(covA : vec3f,covB : vec3f,modelView : mat4x4f,projection : mat4x4f,clip : vec4f,pixelScale : vec2f)->mat3x3f {let rowW=vec3f(projection[0].w,projection[1].w,projection[2].w);let rowX=vec3f(projection[0].x,projection[1].x,projection[2].x);let rowY=vec3f(projection[0].y,projection[1].y,projection[2].y);let jx=(rowX-clip.x/clip.w*rowW)*(0.5*pixelScale.x/clip.w);let jy=(rowY-clip.y/clip.w*rowW)*(0.5*pixelScale.y/clip.w);let J=mat3x3f(jx,jy,vec3f(0.0));let T=transpose(mat3x3f(modelView[0].xyz,modelView[1].xyz,modelView[2].xyz))*J;let covariance=mat3x3f(covA.x,covA.y,covA.z,covA.y,covB.x,covB.y,covA.z,covB.y,covB.z);return transpose(T)*covariance*T;}
struct GpsPart {world : mat4x4f,
vis : vec4f, 
dbg0 : vec4f, 
dbg1 : vec4f, 
dbg2 : vec4f, 
dbg3 : vec4f, 
dbg4 : vec4f, };fn gpsInverseMat3(inMatrix : mat3x3f)->mat3x3f {let a00=inMatrix[0][0]; let a01=inMatrix[0][1]; let a02=inMatrix[0][2];let a10=inMatrix[1][0]; let a11=inMatrix[1][1]; let a12=inMatrix[1][2];let a20=inMatrix[2][0]; let a21=inMatrix[2][1]; let a22=inMatrix[2][2];let b01=a22*a11-a12*a21;let b11=-a22*a10+a12*a20;let b21=a21*a10-a11*a20;let det=a00*b01+a01*b11+a02*b21;return mat3x3f(b01/det,(-a22*a01+a02*a21)/det,(a12*a01-a02*a11)/det,
b11/det,(a22*a00-a02*a20)/det,(-a12*a00+a02*a10)/det,
b21/det,(-a21*a00+a01*a20)/det,(a11*a00-a01*a10)/det);}
struct GpsScreen {pmConicXY : vec4f,
conicZChol : vec4f,
colorOp : vec4f, 
depth : vec4u, };const GPS_FLAG_SATURATE : u32=1u; 
const GPS_FLAG_SCREEN_RECT : u32=2u;const GPS_MAX_ALPHA : f32=0.999;fn gpsPointIntensity(alpha : f32)->f32 {return -log(1.0-min(alpha,GPS_MAX_ALPHA));}
fn gpsGetPixelMean(s : GpsScreen)->vec2f { return s.pmConicXY.xy; }
fn gpsGetConic(s : GpsScreen)->vec3f { return vec3f(s.pmConicXY.z,s.pmConicXY.w,s.conicZChol.x); }
fn gpsGetChol(s : GpsScreen)->vec3f { return s.conicZChol.yzw; }
fn gpsPackRGB565(c : vec3f)->u32 {let r=u32(clamp(c.r,0.0,1.0)*31.0+0.5);let g=u32(clamp(c.g,0.0,1.0)*63.0+0.5);let b=u32(clamp(c.b,0.0,1.0)*31.0+0.5);return (r<<11u) | (g<<5u) | b;}
fn gpsUnpackRGB565(v : u32)->vec3f {return vec3f(
f32((v>>11u) & 31u)/31.0,
f32((v>>5u) & 63u)/63.0,
f32(v & 31u)/31.0
);}
fn gpsPackKey(depthKey : u32,colorKey : u32)->u32 {return (depthKey<<16u) | (colorKey & 0xFFFFu);}
fn gpsKeyColor(key : u32,mask : u32)->vec3f {return gpsUnpackRGB565((key ^ mask) & 0xFFFFu);}
fn gpsPcg(vIn : u32)->u32 {let state=vIn*747796405u+2891336453u;let word=((state>>((state>>28u)+4u)) ^ state)*277803737u;return (word>>22u) ^ word;}
fn gpsHash2(a : u32,b : u32)->u32 {return gpsPcg(a ^ gpsPcg(b));}
fn gpsUnit(state : u32)->f32 {return f32(state)*GPS_U32_TO_UNIT;}
fn gpsBoxMuller(u1 : f32,u2 : f32)->vec2f {let r=sqrt(-2.0*log(max(1e-7,u1)));let theta=GPS_TWO_PI*u2;return vec2f(r*cos(theta),r*sin(theta));}
const GPS_LI2_MAX : f32=1.6449340668482264; 
fn gpsDilog(x : f32)->f32 {var y=-6.09201442e-01;y=y*x+1.79126616e+00;y=y*x+-2.14953223e+00;y=y*x+1.26304372e+00;y=y*x+-4.59069895e-01;y=y*x+-1.87417414e-01;y=y*x+1.99603130e+00;y=y*x+5.99669467e-05;let s=1.0-x;if (s>0.0) {y+=s*log(max(s,1e-37));}
return y;}
fn gpsInvDilog(x : f32)->f32 {let t=min(x/GPS_LI2_MAX,1.0);var y=-1.27463503e+01;y=y*t+5.88993459e+01;y=y*t+-1.16025780e+02;y=y*t+1.26945827e+02;y=y*t+-8.43108826e+01;y=y*t+3.48799862e+01;y=y*t+-8.89606235e+00;y=y*t+1.38640936e+00;y=y*t+-7.80640876e-01;y=y*t+1.64841888e+00;y=y*t+-2.82836687e-05;return y;}
fn gpsCorrectedBoxMuller(u1 : f32,u2 : f32,alpha : f32)->vec2f {var a=(1.0/max(alpha,1e-37))*gpsInvDilog((1.0-u1)*gpsDilog(alpha));a=clamp(a,1e-37,1.0);let r=sqrt(max(-2.0*log(a),0.0));let theta=GPS_TWO_PI*u2;return vec2f(r*cos(theta),r*sin(theta));}
const GPS_POISSON_SMALL_MEAN : f32=12.0;fn gpsPoisson(seed : u32,lambda : f32)->u32 {let st1=gpsPcg(seed);if (lambda<GPS_POISSON_SMALL_MEAN) {let u=gpsUnit(st1);var p=exp(-lambda);var cdf=p;var k=0u;loop {if (u<cdf || (f32(k)>lambda && p<1e-7)) {break;}
k=k+1u;p=p*lambda/f32(k);cdf=cdf+p;}
return k;}
let st2=gpsPcg(st1);let w=gpsBoxMuller(gpsUnit(st1),gpsUnit(st2)).x;let w2=w*w;let w3=w2*w;let w4=w2*w2;let s=sqrt(lambda);let invS=1.0/s;let invL=1.0/lambda;var kf=lambda+s*w+(w2-1.0)/6.0;kf+=invS*(-(1.0/36.0)*w-(1.0/72.0)*w3);kf+=invL*(-(8.0/405.0)+(7.0/810.0)*w2+(1.0/270.0)*w4);return u32(max(i32(round(kf)),0));}
fn gpsGaussianValue(conic : vec3f,d : vec2f)->f32 {let power=-0.5*(conic.x*d.x*d.x+conic.z*d.y*d.y)-conic.y*d.x*d.y;return exp(power);}
`;if(!i.IncludesShadersStoreWGSL[Ee])i.IncludesShadersStoreWGSL[Ee]=st;var pe={name:Ee,shader:st};var Ae="gpsPreprocessComputeShader",it=`#include<gaussianPointSplatting>
#include<gaussianSplattingShared>
@group(0) @binding(0) var<storage,read> means : array<vec4f>;@group(0) @binding(1) var<storage,read> colorOpacity : array<u32>;@group(0) @binding(2) var<storage,read_write> weights : array<u32>;@group(0) @binding(3) var<storage,read_write> gsData : array<GpsScreen>;@group(0) @binding(4) var<uniform> uniforms : GpsUniforms;@group(0) @binding(5) var<storage,read> cov3d : array<u32>; 
@group(0) @binding(6) var<storage,read> sh : array<u32>; 
@group(0) @binding(7) var<storage,read> parts : array<GpsPart>; 
@group(0) @binding(8) var<storage,read> hiZ : array<f32>; 
fn gpsHiZLevelOffset(l : u32,baseW : u32,baseH : u32)->u32 {var off=0u;for (var i=0u; i<l; i=i+1u) {off+=max(1u,baseW>>i)*max(1u,baseH>>i);}
return off;}
fn gpsHiZOccluded(center : vec2f,footR : f32,viewDepth : f32)->bool {let baseW=u32(uniforms.hiZInfo.x);let baseH=u32(uniforms.hiZInfo.y);let numLevels=u32(uniforms.hiZInfo.z);let minx=i32(floor(center.x-footR));let maxx=i32(ceil(center.x+footR));let miny=i32(floor(center.y-footR));let maxy=i32(ceil(center.y+footR));let d=f32(max(maxx-minx,maxy-miny)+1);var lod=i32(ceil(log2(max(d,1.0)*0.5)));lod=clamp(lod,0,i32(numLevels)-1);let L=u32(lod);let lw=max(1u,baseW>>L);let lh=max(1u,baseH>>L);let tile=1u<<L;let off=gpsHiZLevelOffset(L,baseW,baseH);let tx0=min(u32(max(minx,0))/tile,lw-1u);let tx1=min(u32(max(maxx,0))/tile,lw-1u);let ty0=min(u32(max(miny,0))/tile,lh-1u);let ty1=min(u32(max(maxy,0))/tile,lh-1u);var zMax=0.0;for (var ty=ty0; ty<=ty1; ty=ty+1u) {let row=off+ty*lw;for (var tx=tx0; tx<=tx1; tx=tx+1u) {zMax=max(zMax,hiZ[row+tx]);}}
return zMax<viewDepth;}
#if SH_DEGREE>0
#if SH_DEGREE==1
const GPS_SH_WORDS : u32=3u; 
#elif SH_DEGREE==2
const GPS_SH_WORDS : u32=6u; 
#elif SH_DEGREE==3
const GPS_SH_WORDS : u32=12u; 
#else
const GPS_SH_WORDS : u32=18u; 
#endif
fn gpsShByte(baseWord : u32,s : u32)->f32 {let w=sh[baseWord+(s>>2u)];let b=(w>>(8u*(s & 3u))) & 0xFFu;return f32(b)*(2.0/255.0)-1.0;}
fn gpsShCoeff(baseWord : u32,j : u32)->vec3f {let s=j*3u;return vec3f(gpsShByte(baseWord,s),gpsShByte(baseWord,s+1u),gpsShByte(baseWord,s+2u));}
#if SH_DEGREE==1
const GPS_SH_DIM : u32=3u;
#elif SH_DEGREE==2
const GPS_SH_DIM : u32=8u;
#elif SH_DEGREE==3
const GPS_SH_DIM : u32=15u;
#else
const GPS_SH_DIM : u32=24u;
#endif
fn gpsEvalShDelta(g : u32,dir : vec3f,so1 : f32,so2 : f32,so3 : f32,so4 : f32)->vec3f {let base=g*GPS_SH_WORDS;var coeffs : array<vec3<f32>,25>;for (var j=0u; j<GPS_SH_DIM; j=j+1u) {coeffs[1u+j]=gpsShCoeff(base,j);}
return computeColorFromSHDegree(dir,coeffs,so1,so2,so3,so4);}
#endif
@compute @workgroup_size(256,1,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let g=gid.y*65535u*256u+gid.x;let count=u32(uniforms.params0.x);if (g>=count) {return;}
weights[g]=0u;let mean=means[g].xyz;let partIndex=u32(means[g].w);let pdata=parts[partIndex];let partWorld=pdata.world;let near=uniforms.resNearFar.z;let far=uniforms.resNearFar.w;let worldPos=(partWorld*vec4f(mean,1.0)).xyz;let camspace=uniforms.view*vec4f(worldPos,1.0);let clip=uniforms.viewProjection*vec4f(worldPos,1.0);if (clip.w<=0.0) {return;}
let viewDepth=select(camspace.z,-camspace.z,uniforms.focal.z>0.5);let projectedDepth=(u32(uniforms.misc.w) & 2u) != 0u;if (!projectedDepth && (viewDepth<=near || (far>0.0 && viewDepth>=far))) {return;}
let ndc=clip.xyz/clip.w;if (ndc.x<-1.3 || ndc.x>1.3 || ndc.y<-1.3 || ndc.y>1.3) {return;}
let px=(ndc.x*0.5+0.5)*uniforms.pixelMap.x+uniforms.pixelMap.z;let py=(ndc.y*0.5+0.5)*uniforms.pixelMap.y+uniforms.pixelMap.w;let covFactor=bitcast<f32>(cov3d[4u*g+3u]);let p0=unpack2x16float(cov3d[4u*g+0u])*covFactor; 
let p1=unpack2x16float(cov3d[4u*g+1u])*covFactor; 
let p2=unpack2x16float(cov3d[4u*g+2u])*covFactor; 
let covA=vec3f(p0.x,p0.y,p1.x); 
let covB=vec3f(p1.y,p2.x,p2.y); 
let isOrtho=uniforms.focal.w>0.5;let modelView=uniforms.view*partWorld;var cov2d : mat3x3f;if ((u32(uniforms.misc.w) & 1u) != 0u) {cov2d=gpsCov2D(covA,covB,modelView,uniforms.projection,clip,uniforms.pixelMap.xy);} else {cov2d=computeCov2D(covA,covB,modelView,camspace.xyz,uniforms.focal.xy,isOrtho);}
cov2d=cov2d*0.25;let detOrig=cov2d[0][0]*cov2d[1][1]-cov2d[0][1]*cov2d[0][1];let kernelSize=uniforms.params0.y;cov2d[0][0]+=kernelSize;cov2d[1][1]+=kernelSize;let a=cov2d[0][0];let b=cov2d[0][1];let cc=cov2d[1][1];let det=a*cc-b*b;if (det<=0.0) {return;}
let lambda1=(a+cc)*0.5+length(vec2f((a-cc)*0.5,b));let minPixelSize=uniforms.misc.y;if (minPixelSize>0.0 && 4.0*uniforms.misc.x*sqrt(2.0*lambda1)<minPixelSize) {return;}
if (uniforms.hiZInfo.w>0.5) {let footR=3.0*sqrt(max(lambda1,0.0)); 
var nearestDepth=viewDepth;if (projectedDepth) {let low=((vec2f(px,py)-footR-uniforms.pixelMap.zw)/uniforms.pixelMap.xy)*2.0-1.0;let high=((vec2f(px,py)+footR-uniforms.pixelMap.zw)/uniforms.pixelMap.xy)*2.0-1.0;var depths=vec4f(
gpsProjectedDepth(uniforms.inverseProjection,low,camspace.z).x,
gpsProjectedDepth(uniforms.inverseProjection,high,camspace.z).x,
gpsProjectedDepth(uniforms.inverseProjection,vec2f(low.x,high.y),camspace.z).x,
gpsProjectedDepth(uniforms.inverseProjection,vec2f(high.x,low.y),camspace.z).x);if ((u32(uniforms.misc.w) & 4u) != 0u) {depths=vec4f(1.0)-depths;}
nearestDepth=min(min(depths.x,depths.y),min(depths.z,depths.w));}
if (gpsHiZOccluded(vec2f(px,py),footR,nearestDepth)) {return;}}
let compensation=select(1.0,sqrt(max(0.0,detOrig/det)),uniforms.depthNorm.w>0.5);let invDet=1.0/det;let conic=vec3f(cc*invDet,-b*invDet,a*invDet);let chol0=sqrt(a);let chol1=b/chol0;let chol2=sqrt(max(0.0,cc-chol1*chol1));let rgba=colorOpacity[g];let baseColor=vec3f(f32(rgba & 0xFFu),f32((rgba>>8u) & 0xFFu),f32((rgba>>16u) & 0xFFu))/255.0;let baseOpacity=f32((rgba>>24u) & 0xFFu)/255.0;if (baseOpacity==0.0) {return;}
if (uniforms.depthNorm.z>0.5) {let clipMin=pdata.dbg0.xyz;let clipMax=vec3f(pdata.dbg0.w,pdata.dbg1.x,pdata.dbg1.y);if (any(worldPos<clipMin) || any(worldPos>clipMax)) {return;}
if (baseOpacity<pdata.dbg1.z || baseOpacity>pdata.dbg1.w) {return;}
let det3d=p0.x*(p1.y*p2.y-p2.x*p2.x)-p0.y*(p0.y*p2.y-p2.x*p1.x)+p1.x*(p0.y*p2.x-p1.y*p1.x);let splatSize=pow(abs(det3d),1.0/6.0);if (splatSize<pdata.dbg2.x || splatSize>pdata.dbg2.y) {return;}}
var color=baseColor*pdata.dbg3.x;var opacity=clamp(baseOpacity*pdata.vis.x*pdata.dbg2.z*compensation,0.0,1.0);let saturate=pdata.dbg2.w>0.5;
#if SH_DEGREE>0
{let worldRot=mat3x3f(partWorld[0].xyz,partWorld[1].xyz,partWorld[2].xyz);let dir=normalize(gpsInverseMat3(worldRot)*(worldPos-uniforms.camPosDeg.xyz));color+=gpsEvalShDelta(g,dir,pdata.dbg3.y,pdata.dbg3.z,pdata.dbg3.w,pdata.dbg4.x);}
#endif
let lambdaMax=gpsPointIntensity(opacity);var importance : f32;if (saturate) {importance=4.0*GPS_TWO_PI*sqrt(det)*lambdaMax*uniforms.params0.z;} else {importance=GPS_TWO_PI*sqrt(det)*gpsDilog(opacity)*uniforms.params0.z;}
let res=uniforms.resNearFar.xy;let halfExtent=sqrt(8.0*vec2f(a,cc));let rectMin=clamp(floor(vec2f(px,py)-halfExtent),vec2f(0.0),res);let rectMax=clamp(ceil(vec2f(px,py)+halfExtent),vec2f(0.0),res);let rectSize=rectMax-rectMin;let rectImportance=lambdaMax*rectSize.x*rectSize.y*uniforms.params0.z;let useRect=rectImportance<importance;let chosen=select(importance,rectImportance,useRect);if (chosen<1e-4) {return;}
let seed=gpsHash2(g,u32(uniforms.params0.w));let numPoints=gpsPoisson(gpsPcg(seed),chosen);if (numPoints==0u) {return;}
var s : GpsScreen;s.pmConicXY=vec4f(px,py,conic.x,conic.y);s.conicZChol=vec4f(conic.z,chol0,chol1,chol2);s.colorOp=vec4f(color,opacity);let dmin=uniforms.depthNorm.x;let dmax=uniforms.depthNorm.y;let dord=clamp((viewDepth-dmin)/max(dmax-dmin,1e-6),0.0,1.0);let flags=select(0u,GPS_FLAG_SATURATE,saturate) | select(0u,GPS_FLAG_SCREEN_RECT,useRect);let rmin=vec2u(rectMin);let rmax=vec2u(rectMax);let depthKey=select(u32(dord*f32(GPS_DEPTH_MAX_CODE)),bitcast<u32>(camspace.z),projectedDepth);s.depth=vec4u(depthKey,flags,rmin.x | (rmin.y<<16u),rmax.x | (rmax.y<<16u));gsData[g]=s;weights[g]=numPoints;}
`;if(!i.ShadersStoreWGSL[Ae])i.ShadersStoreWGSL[Ae]=it;var Jt=[pe,aa];for(let l of Jt)if(!i.IncludesShadersStoreWGSL[l.name])i.IncludesShadersStoreWGSL[l.name]=l.shader;var ZP={name:Ae,shader:it};var Oe="gaussianPointSplattingScan",rt=`const GpsMaxPointCount : u32=0xFFFFFF00u;fn gpsSaturatingAdd(a : u32,b : u32)->u32 {let sum=a+b;return select(GpsMaxPointCount,sum,sum>=a && sum<=GpsMaxPointCount);}
var<workgroup> gpsScanTemp : array<u32,512>;fn gpsScanExclusive512(t : u32)->u32 {var offset=1u;for (var d=256u; d>0u; d=d>>1u) {workgroupBarrier();if (t<d) {let ai=offset*(2u*t+1u)-1u;let bi=offset*(2u*t+2u)-1u;gpsScanTemp[bi]=gpsSaturatingAdd(gpsScanTemp[bi],gpsScanTemp[ai]);}
offset=offset<<1u;}
var total=0u;if (t==0u) {total=gpsScanTemp[511];gpsScanTemp[511]=0u; }
for (var d=1u; d<512u; d=d<<1u) {offset=offset>>1u;workgroupBarrier();if (t<d) {let ai=offset*(2u*t+1u)-1u;let bi=offset*(2u*t+2u)-1u;let s=gpsScanTemp[ai];gpsScanTemp[ai]=gpsScanTemp[bi];gpsScanTemp[bi]=gpsSaturatingAdd(gpsScanTemp[bi],s);}}
workgroupBarrier();return total;}
`;if(!i.IncludesShadersStoreWGSL[Oe])i.IncludesShadersStoreWGSL[Oe]=rt;var Se={name:Oe,shader:rt};var Le="gpsScanBlocksComputeShader",at=`#include<gaussianPointSplattingScan>
@group(0) @binding(0) var<storage,read> weights : array<u32>;@group(0) @binding(1) var<storage,read_write> cdf : array<u32>;@group(0) @binding(2) var<storage,read_write> blockSums : array<u32>;@compute @workgroup_size(256,1,1)
fn main(@builtin(local_invocation_id) lid : vec3u,@builtin(workgroup_id) wid : vec3u) {let t=lid.x;let block=wid.y*65535u+wid.x;let base=block*512u;let n=arrayLength(&weights);let i0=base+2u*t;let i1=base+2u*t+1u;gpsScanTemp[2u*t]=select(0u,weights[i0],i0<n);gpsScanTemp[2u*t+1u]=select(0u,weights[i1],i1<n);let total=gpsScanExclusive512(t);if (t==0u) {blockSums[block]=total;}
if (i0<n) {cdf[i0]=gpsScanTemp[2u*t];}
if (i1<n) {cdf[i1]=gpsScanTemp[2u*t+1u];}}
`;if(!i.ShadersStoreWGSL[Le])i.ShadersStoreWGSL[Le]=at;var es=[Se];for(let l of es)if(!i.IncludesShadersStoreWGSL[l.name])i.IncludesShadersStoreWGSL[l.name]=l.shader;var JP={name:Le,shader:at};var Fe="gpsScanSumsComputeShader",nt=`#include<gaussianPointSplattingScan>
@group(0) @binding(0) var<storage,read_write> blockSums : array<u32>;@group(0) @binding(1) var<storage,read_write> pointCount : array<u32>;@group(0) @binding(2) var<storage,read_write> indirectArgs : array<u32>;var<workgroup> wgCarry : u32;var<workgroup> wgChunkTotal : u32;@compute @workgroup_size(256,1,1)
fn main(@builtin(local_invocation_id) lid : vec3u) {let t=lid.x;let n=arrayLength(&blockSums);if (t==0u) {wgCarry=0u;}
workgroupBarrier();var chunk=0u;loop {if (chunk>=n) {break;}
let i0=chunk+2u*t;let i1=chunk+2u*t+1u;gpsScanTemp[2u*t]=select(0u,blockSums[i0],i0<n);gpsScanTemp[2u*t+1u]=select(0u,blockSums[i1],i1<n);let total=gpsScanExclusive512(t);if (t==0u) {wgChunkTotal=total;}
workgroupBarrier();if (i0<n) {blockSums[i0]=gpsSaturatingAdd(gpsScanTemp[2u*t],wgCarry);}
if (i1<n) {blockSums[i1]=gpsSaturatingAdd(gpsScanTemp[2u*t+1u],wgCarry);}
workgroupBarrier();if (t==0u) {wgCarry=gpsSaturatingAdd(wgCarry,wgChunkTotal);}
workgroupBarrier();chunk=chunk+512u;}
if (t==0u) {let totalGroups=wgCarry/256u+select(0u,1u,(wgCarry % 256u) != 0u);let gx=min(totalGroups,65535u);let gy=totalGroups/65535u+select(0u,1u,(totalGroups % 65535u) != 0u);pointCount[0]=wgCarry; 
pointCount[1]=totalGroups; 
indirectArgs[0]=gx;indirectArgs[1]=gy;indirectArgs[2]=1u;}}
`;if(!i.ShadersStoreWGSL[Fe])i.ShadersStoreWGSL[Fe]=nt;var ts=[Se];for(let l of ts)if(!i.IncludesShadersStoreWGSL[l.name])i.IncludesShadersStoreWGSL[l.name]=l.shader;var e2={name:Fe,shader:nt};var Ge="gpsScanAddComputeShader",ot=`#include<gaussianPointSplattingScan>
@group(0) @binding(0) var<storage,read_write> cdf : array<u32>;@group(0) @binding(1) var<storage,read> blockSums : array<u32>;@compute @workgroup_size(256,1,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let i=gid.y*65535u*256u+gid.x;if (i>=arrayLength(&cdf)) {return;}
cdf[i]=gpsSaturatingAdd(cdf[i],blockSums[i/512u]);}
`;if(!i.ShadersStoreWGSL[Ge])i.ShadersStoreWGSL[Ge]=ot;var is=[Se];for(let l of is)if(!i.IncludesShadersStoreWGSL[l.name])i.IncludesShadersStoreWGSL[l.name]=l.shader;var t2={name:Ge,shader:ot};var ke="gpsPartitionComputeShader",lt=`#include<gaussianPointSplatting>
@group(0) @binding(0) var<storage,read> cdf : array<u32>;@group(0) @binding(1) var<storage,read> pointCount : array<u32>;@group(0) @binding(2) var<storage,read_write> partTable : array<u32>;fn gpsFindGaussian(p : u32,count : u32)->u32 {var lo=0u;var hi=count;loop {if (lo+1u>=hi) {break;}
let mid=(lo+hi)>>1u;if (cdf[mid]<=p) {lo=mid;} else {hi=mid;}}
return lo;}
@compute @workgroup_size(256,1,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let k=gid.x;if (k>GPS_PARTITION_BUCKETS) {return;}
let total=pointCount[0];let count=arrayLength(&cdf);if (total==0u || count==0u) {partTable[k]=0u;return;}
var pk=u32(f32(k)/f32(GPS_PARTITION_BUCKETS)*f32(total));if (pk>total-1u) {pk=total-1u;}
partTable[k]=gpsFindGaussian(pk,count);}
`;if(!i.ShadersStoreWGSL[ke])i.ShadersStoreWGSL[ke]=lt;var rs=[pe];for(let l of rs)if(!i.IncludesShadersStoreWGSL[l.name])i.IncludesShadersStoreWGSL[l.name]=l.shader;var i2={name:ke,shader:lt};var ze="gpsSplatComputeShader",ut=`#include<gaussianPointSplatting>
@group(0) @binding(0) var<storage,read> cdf : array<u32>;@group(0) @binding(1) var<storage,read> gsData : array<GpsScreen>;@group(0) @binding(2) var<storage,read_write> imageBuffer : array<atomic<u32>>;@group(0) @binding(3) var<uniform> uniforms : GpsUniforms;@group(0) @binding(4) var<storage,read> pointCount : array<u32>;@group(0) @binding(5) var<storage,read> partTable : array<u32>; 
fn gpsFindGaussian(p : u32,loInit : u32,hiInit : u32)->u32 {var lo=loInit;var hi=hiInit;loop {if (lo+1u>=hi) {break;}
let mid=(lo+hi)>>1u;if (cdf[mid]<=p) {lo=mid;} else {hi=mid;}}
return lo;}
@compute @workgroup_size(256,1,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let p=gid.y*65535u*256u+gid.x;let total=pointCount[0];if (p>=total) {return;}
let count=u32(uniforms.params0.x);let bucket=min(u32(max(f32(p)/f32(total)*f32(GPS_PARTITION_BUCKETS),0.0)),GPS_PARTITION_BUCKETS-1u);let loB=select(bucket-1u,0u,bucket==0u);let hiB=min(bucket+2u,GPS_PARTITION_BUCKETS);let g=gpsFindGaussian(p,partTable[loB],min(partTable[hiB]+1u,count));let s=gsData[g];let pixelMean=gpsGetPixelMean(s);let conic=gpsGetConic(s);let chol=gpsGetChol(s);let opacity=s.colorOp.w;let saturate=(s.depth.y & GPS_FLAG_SATURATE) != 0u;var st=gpsHash2(p,u32(uniforms.params0.w));st=gpsPcg(st);let u1=gpsUnit(st);st=gpsPcg(st);let u2=gpsUnit(st);var offset : vec2f;if ((s.depth.y & GPS_FLAG_SCREEN_RECT) != 0u) {let rectMin=vec2f(f32(s.depth.z & 0xFFFFu),f32(s.depth.z>>16u));let rectMax=vec2f(f32(s.depth.w & 0xFFFFu),f32(s.depth.w>>16u));offset=mix(rectMin,rectMax,vec2f(u1,u2))-pixelMean;} else {var z : vec2f;if (saturate) {let r=sqrt(u1)*2.8284271; 
let ang=GPS_TWO_PI*u2;z=vec2f(r*cos(ang),r*sin(ang));} else {z=gpsCorrectedBoxMuller(u1,u2,opacity);}
offset=vec2f(chol.x*z.x,chol.y*z.x+chol.z*z.y);}
let mahalanobis2=conic.x*offset.x*offset.x+2.0*conic.y*offset.x*offset.y+conic.z*offset.y*offset.y;if (mahalanobis2>8.0) {return;}
let pixel=floor(pixelMean+offset);let x=i32(pixel.x);let y=i32(pixel.y);let res=vec2i(vec2u(uniforms.resNearFar.xy));if (x<0 || y<0 || x>=res.x || y>=res.y) {return;}
let alpha=select(opacity*exp(-0.5*mahalanobis2),opacity,saturate);if (alpha<0.00392) { 
return;}
if ((s.depth.y & GPS_FLAG_SCREEN_RECT) != 0u) {st=gpsPcg(st);if (gpsUnit(st)*gpsPointIntensity(opacity)>=gpsPointIntensity(alpha)) {return;}}
st=gpsPcg(st);let dr=gpsUnit(st)-0.5;st=gpsPcg(st);let dg=gpsUnit(st)-0.5;st=gpsPcg(st);let db=gpsUnit(st)-0.5;let dithered=s.colorOp.rgb/uniforms.projectedDepth.z+vec3f(dr/31.0,dg/63.0,db/31.0);var depthKey=s.depth.x;if ((u32(uniforms.misc.w) & 2u) != 0u) {let ndcXY=((pixel+0.5-uniforms.pixelMap.zw)/uniforms.pixelMap.xy)*2.0-1.0;let projected=gpsProjectedDepth(uniforms.inverseProjection,ndcXY,bitcast<f32>(s.depth.x));if (!(projected.x>=0.0 && projected.x<=1.0 && projected.y>0.0)) {return;}
let ordered=select(projected.x,1.0-projected.x,(u32(uniforms.misc.w) & 4u) != 0u);let normalized=clamp((ordered-uniforms.projectedDepth.x)/max(uniforms.projectedDepth.y-uniforms.projectedDepth.x,1e-6),0.0,1.0);depthKey=u32(normalized*f32(GPS_DEPTH_MAX_CODE));}
let key=gpsPackKey(depthKey,gpsPackRGB565(dithered) ^ u32(uniforms.misc.z));let idx=u32(y)*u32(res.x)+u32(x);if (atomicLoad(&imageBuffer[idx])<=key) {return;}
atomicMin(&imageBuffer[idx],key);}
`;if(!i.ShadersStoreWGSL[ze])i.ShadersStoreWGSL[ze]=ut;var as=[pe];for(let l of as)if(!i.IncludesShadersStoreWGSL[l.name])i.IncludesShadersStoreWGSL[l.name]=l.shader;var r2={name:ze,shader:ut};var Ie="gpsResolveComputeShader",ct=`#include<gaussianPointSplatting>
struct GpsResolveParams {resolution : vec2f, 
outResolution : vec2f,
depthNorm : vec2f, 
colorMask : vec2f, 
upsample : vec4f, 
misc2 : vec4f, 
projZ : vec4f, 
inverseProjection : mat4x4f,
occlusion : vec4f, };@group(0) @binding(0) var<storage,read_write> accumBuffer : array<vec4f>;@group(0) @binding(1) var<uniform> params : GpsResolveParams;@group(0) @binding(2) var<storage,read_write> imageBuffer : array<atomic<u32>>;@group(0) @binding(3) var<storage,read_write> accumDepth : array<f32>;@group(0) @binding(4) var<storage,read_write> hiZ : array<f32>; 
@group(0) @binding(5) var<storage,read_write> accumCount : array<u32>; 
const GPS_HIZ_FAR : f32=1e30; 
@compute @workgroup_size(8,8,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let res=vec2u(params.resolution); 
if (gid.x>=res.x || gid.y>=res.y) {return;}
let idx=gid.y*res.x+gid.x; 
let raw=atomicLoad(&imageBuffer[idx]);var hitColor=vec3f(0.0,0.0,0.0);var hit=0.0;var depth=1.0;var occlVz=GPS_HIZ_FAR;var viewZ=0.0;if (raw != GPS_DEPTH_CLEAR) {hitColor=gpsKeyColor(raw,u32(params.colorMask.x))*params.colorMask.y;hit=1.0;let dq=f32(raw>>16u)/f32(GPS_DEPTH_MAX_CODE);let vz=params.depthNorm.x+dq*(params.depthNorm.y-params.depthNorm.x);occlVz=vz+(params.depthNorm.y-params.depthNorm.x)/f32(GPS_DEPTH_MAX_CODE);depth=(params.projZ.x*vz+params.projZ.z)/(params.projZ.y*vz+params.projZ.w);if (params.misc2.w>0.5) {depth=select(vz,1.0-vz,params.misc2.z>0.5);let outputPixel=vec2f(gid.xy)*params.upsample.x+params.upsample.yz+0.5;let ndcXY=outputPixel/params.outResolution*2.0-1.0;let unprojected=params.inverseProjection*vec4f(ndcXY,depth,1.0);viewZ=unprojected.z/unprojected.w;}}
if (params.occlusion.x>0.5) {hiZ[idx]=occlVz;}
atomicStore(&imageBuffer[idx],GPS_DEPTH_CLEAR);let n=u32(params.upsample.x);let outRes=vec2u(params.outResolution);let gen=u32(params.upsample.w);let premult=hitColor*hit;if (params.misc2.y>0.5) {for (var dy=0u; dy<n; dy=dy+1u) {for (var dx=0u; dx<n; dx=dx+1u) {let ox2=gid.x*n+dx;let oy2=gid.y*n+dy;if (ox2<outRes.x && oy2<outRes.y) {let oi=oy2*outRes.x+ox2;var outputDepth=depth;var outputHit=hit;if (params.misc2.w>0.5 && hit>0.5) {let ndcXY=(vec2f(f32(ox2),f32(oy2))+0.5)/params.outResolution*2.0-1.0;let projected=gpsProjectedDepth(params.inverseProjection,ndcXY,viewZ);outputDepth=projected.x;outputHit=select(0.0,hit,projected.x>=0.0 && projected.x<=1.0 && projected.y>0.0);}
accumBuffer[oi]=vec4f(hitColor*outputHit,outputHit);accumCount[oi]=(gen<<16u) | 1u;accumDepth[oi]=select(1.0,outputDepth,outputHit>0.5);}}}
return;}
let ox=select(0u,u32(params.upsample.y),n>1u);let oy=select(0u,u32(params.upsample.z),n>1u);let outX=gid.x*n+ox;let outY=gid.y*n+oy;if (outX>=outRes.x || outY>=outRes.y) {return;}
let outIdx=outY*outRes.x+outX;let packed=accumCount[outIdx];let count=select(0u,packed & 0xFFFFu,(packed>>16u)==gen);let t=select(1.0/(f32(count)+1.0),1.0,count==0u);let prev=accumBuffer[outIdx];let newRgb=mix(prev.rgb,premult,t);let newCov=mix(prev.w,hit,t);accumBuffer[outIdx]=vec4f(newRgb,newCov);accumCount[outIdx]=(gen<<16u) | min(count+1u,u32(params.misc2.x));if (hit>0.5) {accumDepth[outIdx]=depth;} else if (count==0u) {accumDepth[outIdx]=1.0;}}
`;if(!i.ShadersStoreWGSL[Ie])i.ShadersStoreWGSL[Ie]=ct;var ns=[pe];for(let l of ns)if(!i.IncludesShadersStoreWGSL[l.name])i.IncludesShadersStoreWGSL[l.name]=l.shader;var s2={name:Ie,shader:ct};var We="gpsHiZBuildComputeShader",dt=`struct GpsHiZParams {src : vec4u,
dst : vec4u,};@group(0) @binding(0) var<storage,read_write> hiZ : array<f32>;@group(0) @binding(1) var<uniform> params : GpsHiZParams;@compute @workgroup_size(8,8,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let dstW=params.dst.y;let dstH=params.dst.z;if (gid.x>=dstW || gid.y>=dstH) {return;}
let srcW=params.src.y;let srcH=params.src.z;let sx=gid.x*2u;let sy=gid.y*2u;let sxEnd=select(min(sx+1u,srcW-1u),srcW-1u,gid.x==dstW-1u);let syEnd=select(min(sy+1u,srcH-1u),srcH-1u,gid.y==dstH-1u);let base=params.src.x;var m=0.0;for (var y=sy; y<=syEnd; y=y+1u) {let row=base+y*srcW;for (var x=sx; x<=sxEnd; x=x+1u) {m=max(m,hiZ[row+x]);}}
hiZ[params.dst.x+gid.y*dstW+gid.x]=m;}
`;if(!i.ShadersStoreWGSL[We])i.ShadersStoreWGSL[We]=dt;var n2={name:We,shader:dt};var Me={name:"splat",extensions:{".splat":{isBinary:!0},".ply":{isBinary:!0},".spz":{isBinary:!0},".json":{isBinary:!1},".sog":{isBinary:!0}}};Bs();QE();var ft=256,os=512,xe=65535,ls=4294967295,pt=65536;function qu(l){let f=l.m;return f[2]!==0||f[6]!==0||f[3]!==0||f[7]!==0}function wp(l){if(l<1)return 0;return Math.ceil((l===1?3:l===2?8:l===3?15:24)*3/4)*4}class Rp{_getMaxStorageBufferSize(){let f=this._engine.currentLimits;if(!f)return 134217728;return Math.min(f.maxStorageBufferBindingSize||134217728,f.maxBufferSize||134217728)}supportsWorkload(l,f,m,S){let b=this._getMaxStorageBufferSize(),w=Math.max(64,wp(f));return l*w<=b&&m*S*4*Float32Array.BYTES_PER_ELEMENT<=b}constructor(l){this._preprocessShDegree=-1,this._means=null,this._colorOpacity=null,this._cov3d=null,this._sh=null,this._shDegree=0,this._weights=null,this._gsData=null,this._cdf=null,this._blockSums=null,this._gaussianCount=0,this._numBlocks=0,this.pointScale=1,this.kernelSize=0.3,this.minPixelSize=0,this.rightHandedSystem=!1,this.debugActive=0,this.isOrthographic=!1,this.compensation=!1,this.occlusionCulling=!1,this._imageBuffer=null,this._accumBuffer=null,this._accumDepth=null,this._accumCount=null,this._hiZ=null,this._hiZLevels=[],this._hiZBuildParams=[],this._boundHiZParams=null,this._width=0,this._height=0,this._outWidth=0,this._outHeight=0,this._upsampleN=1,this._jitterX=0,this._jitterY=0,this._view=null,this._viewProjection=null,this._projection=null,this._inverseProjection=null,this._projectedDepth=!1,this._reverseDepth=!1,this._projectedDepthSpan=new Float32Array([0,1]),this._near=0.1,this._far=1000,this._focalX=1000,this._focalY=1000,this._camX=0,this._camY=0,this._camZ=0,this._viewZMin=0.1,this._viewZMax=1000,this._projZ=new Float32Array([0,1,0,0]),this._frameIndex=0,this._parts=null,this._partBuffers=[],this._partUseFrames=[],this._partSlot=0,this._partCount=0,this._prevPartData=new Float32Array(0),this._accumGeneration=0,this._lastRenderedGeneration=-1,this._prevVp=new Float32Array(16),this._hasPrevVp=!1,this.maxAccumFrames=255,this._engine=l,this._preprocessBindings={means:{group:0,binding:0},colorOpacity:{group:0,binding:1},weights:{group:0,binding:2},gsData:{group:0,binding:3},uniforms:{group:0,binding:4},cov3d:{group:0,binding:5},sh:{group:0,binding:6},parts:{group:0,binding:7},hiZ:{group:0,binding:8}},this._scanBlocksCs=new gr("gpsScanBlocks",l,"gpsScanBlocks",{bindingsMapping:{weights:{group:0,binding:0},cdf:{group:0,binding:1},blockSums:{group:0,binding:2}}}),this._scanSumsCs=new gr("gpsScanSums",l,"gpsScanSums",{bindingsMapping:{blockSums:{group:0,binding:0},pointCount:{group:0,binding:1},indirectArgs:{group:0,binding:2}}}),this._scanAddCs=new gr("gpsScanAdd",l,"gpsScanAdd",{bindingsMapping:{cdf:{group:0,binding:0},blockSums:{group:0,binding:1}}}),this._partitionCs=new gr("gpsPartition",l,"gpsPartition",{bindingsMapping:{cdf:{group:0,binding:0},pointCount:{group:0,binding:1},partTable:{group:0,binding:2}}}),this._hiZBuildCs=new gr("gpsHiZBuild",l,"gpsHiZBuild",{bindingsMapping:{hiZ:{group:0,binding:0},params:{group:0,binding:1}}});let f={cdf:{group:0,binding:0},gsData:{group:0,binding:1},imageBuffer:{group:0,binding:2},uniforms:{group:0,binding:3},pointCount:{group:0,binding:4},partTable:{group:0,binding:5}};this._splatCs=new gr("gpsSplat",l,"gpsSplat",{bindingsMapping:f});let m={accumBuffer:{group:0,binding:0},params:{group:0,binding:1},imageBuffer:{group:0,binding:2},accumDepth:{group:0,binding:3},hiZ:{group:0,binding:4},accumCount:{group:0,binding:5}};this._resolveCs=new gr("gpsResolve",l,"gpsResolve",{bindingsMapping:m}),this._uniforms=new Y(l),this._uniforms.addUniform("view",16),this._uniforms.addUniform("viewProjection",16),this._uniforms.addUniform("resNearFar",4),this._uniforms.addUniform("params0",4),this._uniforms.addUniform("focal",4),this._uniforms.addUniform("camPosDeg",4),this._uniforms.addUniform("depthNorm",4),this._uniforms.addUniform("hiZInfo",4),this._uniforms.addUniform("misc",4),this._uniforms.addUniform("pixelMap",4),this._uniforms.addUniform("projection",16),this._uniforms.addUniform("inverseProjection",16),this._uniforms.addUniform("projectedDepth",4),this._resolveParams=new Y(l),this._resolveParams.addUniform("resolution",2),this._resolveParams.addUniform("outResolution",2),this._resolveParams.addUniform("depthNorm",2),this._resolveParams.addUniform("colorMask",2),this._resolveParams.addUniform("upsample",4),this._resolveParams.addUniform("misc2",4),this._resolveParams.addUniform("projZ",4),this._resolveParams.addUniform("inverseProjection",16),this._resolveParams.addUniform("occlusion",4),this._pointCount=new Ci(l,4*Uint32Array.BYTES_PER_ELEMENT),this._indirectArgs=new Ci(l,3*Uint32Array.BYTES_PER_ELEMENT,98),this._partition=new Ci(l,(pt+1)*Uint32Array.BYTES_PER_ELEMENT),this._createPreprocessCs(0),this._splatCs.setUniformBuffer("uniforms",this._uniforms),this._resolveCs.setUniformBuffer("params",this._resolveParams),this._scanSumsCs.setStorageBuffer("pointCount",this._pointCount),this._scanSumsCs.setStorageBuffer("indirectArgs",this._indirectArgs),this._partitionCs.setStorageBuffer("pointCount",this._pointCount),this._partitionCs.setStorageBuffer("partTable",this._partition),this._splatCs.setStorageBuffer("pointCount",this._pointCount),this._splatCs.setStorageBuffer("partTable",this._partition)}_createPreprocessCs(l){this._preprocessShDegree=l;let f={...this._preprocessBindings};if(l<=0)delete f.sh;if(this._preprocessCs=new gr("gpsPreprocess",this._engine,"gpsPreprocess",{bindingsMapping:f,defines:["#define SH_DEGREE "+l]}),this._preprocessCs.setUniformBuffer("uniforms",this._uniforms),this._parts)this._preprocessCs.setStorageBuffer("parts",this._parts);if(this._hiZ)this._preprocessCs.setStorageBuffer("hiZ",this._hiZ)}get accumBuffer(){return this._accumBuffer}get accumDepthBuffer(){return this._accumDepth}get renderedFrameCount(){return this._frameIndex}get accumulationVersion(){return this._accumGeneration}get pixelCycleLength(){return this._upsampleN*this._upsampleN}async readPointCountAsync(){let l=await this._pointCount.read(0,Uint32Array.BYTES_PER_ELEMENT);return new Uint32Array(l.buffer,l.byteOffset,1)[0]}get width(){return this._width}get height(){return this._height}get outputWidth(){return this._outWidth}get outputHeight(){return this._outHeight}get gaussianCount(){return this._gaussianCount}isReady(){return this._preprocessCs.isReady()&&this._scanBlocksCs.isReady()&&this._scanSumsCs.isReady()&&this._scanAddCs.isReady()&&this._partitionCs.isReady()&&this._splatCs.isReady()&&this._resolveCs.isReady()&&(!this.occlusionCulling||this._hiZBuildCs.isReady())}updateSplats(l,f,m,S,b,w){if(this._disposeGaussianBuffers(),this._gaussianCount=w,this._shDegree=S?b:0,this._shDegree!==this._preprocessShDegree)this._createPreprocessCs(this._shDegree);if(w===0)return;this._numBlocks=Math.ceil(w/os);let y=this._engine;if(this._means=new Ci(y,w*4*Float32Array.BYTES_PER_ELEMENT),this._means.update(l),this._cov3d=new Ci(y,w*4*Uint32Array.BYTES_PER_ELEMENT),this._cov3d.update(f),S&&this._shDegree>0)this._sh=new Ci(y,S.byteLength),this._sh.update(S);else this._sh=new Ci(y,Float32Array.BYTES_PER_ELEMENT);if(this._colorOpacity=new Ci(y,w*Uint32Array.BYTES_PER_ELEMENT),this._colorOpacity.update(m),this._weights=new Ci(y,w*Uint32Array.BYTES_PER_ELEMENT),this._cdf=new Ci(y,w*Uint32Array.BYTES_PER_ELEMENT),this._blockSums=new Ci(y,this._numBlocks*Uint32Array.BYTES_PER_ELEMENT),this._gsData=new Ci(y,w*64),this._preprocessCs.setStorageBuffer("means",this._means),this._preprocessCs.setStorageBuffer("colorOpacity",this._colorOpacity),this._preprocessCs.setStorageBuffer("weights",this._weights),this._preprocessCs.setStorageBuffer("gsData",this._gsData),this._preprocessCs.setStorageBuffer("cov3d",this._cov3d),this._shDegree>0)this._preprocessCs.setStorageBuffer("sh",this._sh);this._scanBlocksCs.setStorageBuffer("weights",this._weights),this._scanBlocksCs.setStorageBuffer("cdf",this._cdf),this._scanBlocksCs.setStorageBuffer("blockSums",this._blockSums),this._scanSumsCs.setStorageBuffer("blockSums",this._blockSums),this._scanAddCs.setStorageBuffer("cdf",this._cdf),this._scanAddCs.setStorageBuffer("blockSums",this._blockSums),this._partitionCs.setStorageBuffer("cdf",this._cdf),this._splatCs.setStorageBuffer("cdf",this._cdf),this._splatCs.setStorageBuffer("gsData",this._gsData),this.resetAccumulation()}resetAccumulation(){this._accumGeneration=this._accumGeneration+1&65535}setCamera(l,f,m,S,b,w,y,D,P,T,E){this._view=l,this._viewProjection=f,this._near=m,this._far=S,this._focalX=b,this._focalY=w,this._camX=y,this._camY=D,this._camZ=P,this._viewZMin=T,this._viewZMax=E}setProjectionZ(l,f,m,S){this._projZ[0]=l,this._projZ[1]=f,this._projZ[2]=m,this._projZ[3]=S,this._projection=null,this._inverseProjection=null,this._projectedDepth=!1}setProjectionMatrix(l,f,m=!1){let S=l.m;this.setProjectionZ(S[10],S[11],S[14],S[15]),this._projection=l,this._inverseProjection=f,this._projectedDepth=qu(l),this._reverseDepth=m}_getProjectedDepthSpan(l=1,f=1){let m=this._inverseProjection.m,S=this.rightHandedSystem?-1:1,b=S*this._viewZMin,w=S*this._viewZMax,y=m[10]-b*m[11],D=m[10]-w*m[11];if(y*D<=0)return this._projectedDepthSpan[0]=0,this._projectedDepthSpan[1]=1,this._projectedDepthSpan;let P=1,T=0;for(let E=0;E<8;E++){let L=E&1?l:-1,A=E&2?f:-1,O=E&4?w:b,k=(O*(m[3]*L+m[7]*A+m[15])-(m[2]*L+m[6]*A+m[14]))/(m[10]-O*m[11]),W=Math.max(0,Math.min(1,this._reverseDepth?1-k:k));P=Math.min(P,W),T=Math.max(T,W)}return this._projectedDepthSpan[0]=P,this._projectedDepthSpan[1]=Math.max(P+0.000001,T),this._projectedDepthSpan}_matchesPartData(l,f){let m=f*40;if(!this._parts||this._partCount!==f||this._prevPartData.length!==m)return!1;for(let S=0;S<m;S++)if(this._prevPartData[S]!==l[S])return!1;return!0}setPartData(l,f){let m=this._engine,S=f*40,b=!this._matchesPartData(l,f);if(this._partCount!==f)this._disposePartBuffers(),this._partCount=f;let w=m.frameId;if(!b){if(this._parts)this._partUseFrames[this._partSlot]=w;return}if(this._prevPartData.length!==S)this._prevPartData=new Float32Array(S);if(this._prevPartData.set(l),this.resetAccumulation(),!this._parts||this._partUseFrames[this._partSlot]===w){let y=0;while(y<this._partBuffers.length&&this._partUseFrames[y]===w)y++;if(y===this._partBuffers.length)this._partBuffers.push(new Ci(m,S*Float32Array.BYTES_PER_ELEMENT)),this._partUseFrames.push(-1);this._partSlot=y,this._parts=this._partBuffers[y],this._preprocessCs.setStorageBuffer("parts",this._parts)}this._partUseFrames[this._partSlot]=w,this._parts.update(l)}_disposePartBuffers(){for(let l of this._partBuffers)l.dispose();this._partBuffers.length=0,this._partUseFrames.length=0,this._partSlot=0,this._parts=null}_ensurePixelBuffers(l,f,m,S){let b=this._engine,w=l!==this._width||f!==this._height||!this._imageBuffer,y=m!==this._outWidth||S!==this._outHeight||!this._accumBuffer;if(w){this._width=l,this._height=f;let D=l*f;this._imageBuffer?.dispose(),this._imageBuffer=new Ci(b,D*Uint32Array.BYTES_PER_ELEMENT);let P=new Uint32Array(D);P.fill(ls),this._imageBuffer.update(P),this._splatCs.setStorageBuffer("imageBuffer",this._imageBuffer),this._resolveCs.setStorageBuffer("imageBuffer",this._imageBuffer)}if(!this._hiZ||this.occlusionCulling!==this._hiZLevels.length>0||this.occlusionCulling&&w){this._hiZLevels=[];let D=1;if(this.occlusionCulling){D=0;let P=Math.floor(Math.log2(Math.max(l,f)))+1;for(let T=0;T<P;T++){let E=Math.max(1,l>>T),L=Math.max(1,f>>T);this._hiZLevels.push({offset:D,w:E,h:L}),D+=E*L}}this._hiZ?.dispose(),this._hiZ=new Ci(b,D*Float32Array.BYTES_PER_ELEMENT),this._hiZ.update(new Float32Array(D).fill(1000000000000000000000000000000)),this._preprocessCs.setStorageBuffer("hiZ",this._hiZ),this._resolveCs.setStorageBuffer("hiZ",this._hiZ),this._hiZBuildCs.setStorageBuffer("hiZ",this._hiZ);for(let P of this._hiZBuildParams)P.dispose();this._hiZBuildParams=[],this._boundHiZParams=null;for(let P=1;P<this._hiZLevels.length;P++){let T=this._hiZLevels[P-1],E=this._hiZLevels[P],L=new Y(b);L.addUniform("src",4),L.addUniform("dst",4),L.updateUInt4("src",T.offset,T.w,T.h,0),L.updateUInt4("dst",E.offset,E.w,E.h,0),L.update(),this._hiZBuildParams.push(L)}}if(y){this._outWidth=m,this._outHeight=S;let D=m*S;this._accumBuffer?.dispose(),this._accumBuffer=new Ci(b,D*4*Float32Array.BYTES_PER_ELEMENT),this._accumDepth?.dispose(),this._accumDepth=new Ci(b,D*Float32Array.BYTES_PER_ELEMENT),this._accumCount?.dispose(),this._accumCount=new Ci(b,D*Uint32Array.BYTES_PER_ELEMENT),this._resolveCs.setStorageBuffer("accumBuffer",this._accumBuffer),this._resolveCs.setStorageBuffer("accumDepth",this._accumDepth),this._resolveCs.setStorageBuffer("accumCount",this._accumCount),this.resetAccumulation()}}renderToBuffer(l,f,m=l,S=f,b=1,w=0,y=0){if(l<=0||f<=0||m<=0||S<=0)return!1;if(this._upsampleN=Math.max(1,Math.round(b)),this._jitterX=w,this._jitterY=y,this._ensurePixelBuffers(l,f,m,S),this._gaussianCount===0||!this._parts||!this._view||!this._viewProjection||!this.isReady())return!1;let D=this._viewProjection.m,P=!this._hasPrevVp;for(let G=0;G<16;G++)if(Math.abs(D[G]-this._prevVp[G])>0.00001){P=!0;break}if(P)this.resetAccumulation(),this._prevVp.set(D),this._hasPrevVp=!0;let T=this._accumGeneration!==this._lastRenderedGeneration;this._lastRenderedGeneration=this._accumGeneration;let E=this._upsampleN,L=(E/2-this._jitterX-0.5)/E,A=(E/2-this._jitterY-0.5)/E,O=Math.imul(this._frameIndex+1,2654435761)>>>16&65535,k=this._shDegree>0?8:1;this._uniforms.updateMatrix("view",this._view),this._uniforms.updateMatrix("viewProjection",this._viewProjection),this._uniforms.updateFloat4("resNearFar",l,f,this._near,this._far),this._uniforms.updateFloat4("params0",this._gaussianCount,this.kernelSize*0.25/(E*E),this.pointScale,this._frameIndex%65536),this._uniforms.updateFloat4("focal",this._focalX,this._focalY,this.rightHandedSystem?1:0,this.isOrthographic?1:0),this._uniforms.updateFloat4("camPosDeg",this._camX,this._camY,this._camZ,this._shDegree),this._uniforms.updateFloat4("depthNorm",this._viewZMin,this._viewZMax,this.debugActive,this.compensation?1:0),this._uniforms.updateFloat4("hiZInfo",l,f,this._hiZLevels.length,this.occlusionCulling&&!T?1:0);let W=(this._projection?1:0)|(this._projectedDepth?2:0)|(this._reverseDepth?4:0),q=this._projectedDepth?this._getProjectedDepthSpan(Math.max(1,2*l*E/this._outWidth-1),Math.max(1,2*f*E/this._outHeight-1)):null;if(this._uniforms.updateFloat4("misc",E,this.minPixelSize,O,W),this._uniforms.updateFloat4("pixelMap",this._outWidth/E,this._outHeight/E,L,A),this._projection&&this._inverseProjection)this._uniforms.updateMatrix("projection",this._projection),this._uniforms.updateMatrix("inverseProjection",this._inverseProjection);this._uniforms.updateFloat4("projectedDepth",q?.[0]??0,q?.[1]??1,k,0),this._uniforms.update(),this._resolveParams.updateFloat2("resolution",l,f),this._resolveParams.updateFloat2("outResolution",this._outWidth,this._outHeight),this._resolveParams.updateFloat2("depthNorm",q?.[0]??this._viewZMin,q?.[1]??this._viewZMax),this._resolveParams.updateFloat2("colorMask",O,k),this._resolveParams.updateFloat4("upsample",E,this._jitterX,this._jitterY,this._accumGeneration),this._resolveParams.updateFloat4("misc2",Math.max(1,Math.min(65535,Math.floor(this.maxAccumFrames))),T?1:0,this._reverseDepth?1:0,this._projectedDepth?1:0);let F=this.rightHandedSystem?-1:1;if(this._resolveParams.updateFloat4("projZ",this._projZ[0]*F,this._projZ[1]*F,this._projZ[2],this._projZ[3]),this._inverseProjection)this._resolveParams.updateMatrix("inverseProjection",this._inverseProjection);this._resolveParams.updateFloat4("occlusion",this.occlusionCulling?1:0,0,0,0),this._resolveParams.update();let z=Math.ceil(this._gaussianCount/ft);if(this._partUseFrames[this._partSlot]=this._engine.frameId,this._preprocessCs.dispatch(Math.min(z,xe),Math.ceil(z/xe),1),this._scanBlocksCs.dispatch(Math.min(this._numBlocks,xe),Math.ceil(this._numBlocks/xe),1),this._scanSumsCs.dispatch(1,1,1),this._scanAddCs.dispatch(Math.min(z,xe),Math.ceil(z/xe),1),this._partitionCs.dispatch(Math.ceil((pt+1)/ft),1,1),this._splatCs.dispatchIndirect(this._indirectArgs),this._resolveCs.dispatch(Math.ceil(l/8),Math.ceil(f/8),1),this.occlusionCulling)for(let G=1;G<this._hiZLevels.length;G++){let V=this._hiZLevels[G],I=this._hiZBuildParams[G-1];if(I!==this._boundHiZParams)this._hiZBuildCs.setUniformBuffer("params",I),this._boundHiZParams=I;this._hiZBuildCs.dispatch(Math.ceil(V.w/8),Math.ceil(V.h/8),1)}return this._frameIndex++,!0}_disposeGaussianBuffers(){this._means?.dispose(),this._colorOpacity?.dispose(),this._cov3d?.dispose(),this._sh?.dispose(),this._weights?.dispose(),this._gsData?.dispose(),this._cdf?.dispose(),this._blockSums?.dispose(),this._means=null,this._colorOpacity=null,this._cov3d=null,this._sh=null,this._weights=null,this._gsData=null,this._cdf=null,this._blockSums=null,this._gaussianCount=0,this._numBlocks=0}dispose(){this._disposeGaussianBuffers(),this._imageBuffer?.dispose(),this._accumBuffer?.dispose(),this._accumDepth?.dispose(),this._accumCount?.dispose(),this._accumDepth=null,this._imageBuffer=null,this._accumBuffer=null,this._accumCount=null,this._hiZ?.dispose(),this._hiZ=null,this._hiZLevels=[];for(let l of this._hiZBuildParams)l.dispose();this._hiZBuildParams=[],this._boundHiZParams=null,this._disposePartBuffers(),this._partCount=0,this._pointCount.dispose(),this._indirectArgs.dispose(),this._partition.dispose(),this._uniforms.dispose(),this._resolveParams.dispose(),this._width=0,this._height=0,this._outWidth=0,this._outHeight=0}}class Ep extends de{constructor(l,f){super(l,f,{vertex:"gaussianPointSplattingBlit",fragment:"gaussianPointSplattingBlit"},{attributes:["position"],uniforms:["resolution","projZ","inverseProjection","useInverseProjection","logarithmicDepthConstant"],storageBuffers:["accumBuffer","accumDepth"],shaderLanguage:1,needAlphaBlending:!0});this._resolution=new g,this._projZ=new R,this.backFaceCulling=!1,this.alphaMode=7,this.setFloat("logarithmicDepthConstant",0),this.setFloat("useInverseProjection",0)}setAccumBuffer(l){this.setStorageBuffer("accumBuffer",l)}setAccumDepthBuffer(l){this.setStorageBuffer("accumDepth",l)}setResolution(l,f){this.setVector2("resolution",this._resolution.set(l,f))}setProjectionZ(l,f,m,S){this.setVector4("projZ",this._projZ.set(l,f,m,S)),this.setFloat("useInverseProjection",0)}setInverseProjection(l){this.setMatrix("inverseProjection",l),this.setFloat("useInverseProjection",1)}setLogarithmicDepthConstant(l){this.setFloat("logarithmicDepthConstant",l)}}class Ap extends de{constructor(l,f){super(l,f,{vertex:"gaussianPointSplattingBlit",fragment:"gaussianPointSplattingDepthBlit"},{attributes:["position"],uniforms:["resolution","depthValues","projZ","inverseProjection","useInverseProjection","reverseDepth"],storageBuffers:["accumBuffer","accumDepth"],shaderLanguage:1,needAlphaBlending:!1});this._resolution=new g,this._projZ=new R,this._depthValues=new g,this.backFaceCulling=!1,this.alphaMode=0,this.forceDepthWrite=!0,this.setFloat("useInverseProjection",0)}setAccumBuffer(l){this.setStorageBuffer("accumBuffer",l)}setAccumDepthBuffer(l){this.setStorageBuffer("accumDepth",l)}setResolution(l,f){this.setVector2("resolution",this._resolution.set(l,f))}setProjectionZ(l,f,m,S){this.setVector4("projZ",this._projZ.set(l,f,m,S)),this.setFloat("useInverseProjection",0)}setInverseProjection(l){this.setMatrix("inverseProjection",l),this.setFloat("useInverseProjection",1)}setDepthValues(l,f){this.setVector2("depthValues",this._depthValues.set(l,f))}setReverseDepth(l){this.setFloat("reverseDepth",l?1:0)}}class mt extends ue{constructor(){super(...arguments);this.GS_DBG_ENABLED=!1,this.GS_DBG_CLIP=0,this.GS_DBG_CULL_OPACITY=0,this.GS_DBG_CULL_SIZE=0,this.GS_DBG_OPACITY_SCALE=0,this.GS_DBG_OPACITY_SATURATE=0,this.GS_DBG_SH_DC=1,this.GS_DBG_SH_ORDER1=1,this.GS_DBG_SH_ORDER2=1,this.GS_DBG_SH_ORDER3=1,this.GS_DBG_SH_ORDER4=1}}var Ne=10;class Ra extends qe{constructor(l){super(l,"GaussianSplattingDebug",200,new mt,!0,!0);this._clippingBox=null,this._opacityCulling=null,this._sizeCulling=null,this._opacityScale=1,this._opacitySaturate=!1,this._shDc=!0,this._shOrder1=!0,this._shOrder2=!0,this._shOrder3=!0,this._shOrder4=!0,this._partCount=0,this._partClippingBoxes=[],this._partOpacityCullings=[],this._partSizeCullings=[],this._partOpacityScales=[],this._partOpacitySaturates=[],this._partShDcs=[],this._partShOrder1s=[],this._partShOrder2s=[],this._partShOrder3s=[],this._partShOrder4s=[],this._dbgPartDataTexture=null,this._textureDirty=!1,this._maxPartCount=0,this._resolvedPartData=null,this._mutableValuesSnapshot=null,this._partArrays=[this._partClippingBoxes,this._partOpacityCullings,this._partSizeCullings,this._partOpacityScales,this._partOpacitySaturates,this._partShDcs,this._partShOrder1s,this._partShOrder2s,this._partShOrder3s,this._partShOrder4s]}get isDebugActive(){return this._isAnyFeatureActive()}getResolvedPartData(l,f){if(!this._maxPartCount)this._maxPartCount=Gn(f);let m=this._refreshMutableValuesSnapshot(l);if(!this._resolvedPartData||this._resolvedPartData.partCount!==l||m)this._resolvedPartData={partCount:l,data:this._buildTextureData(l),maxPartCount:this._maxPartCount};return this._resolvedPartData}_refreshMutableValuesSnapshot(l){let f=l+1,m=this._mutableValuesSnapshot,S=!1;if(!m||m.length!==f*Ne)m=new Float64Array(f*Ne),this._mutableValuesSnapshot=m,S=!0;for(let b=0;b<f;b++){let w=b*Ne,y=b<l?this._partClippingBoxes[b]??this._clippingBox:this._clippingBox;if(this._diffMutableValue(m,w,y?y.min.x:0))S=!0;if(this._diffMutableValue(m,w+1,y?y.min.y:0))S=!0;if(this._diffMutableValue(m,w+2,y?y.min.z:0))S=!0;if(this._diffMutableValue(m,w+3,y?y.max.x:0))S=!0;if(this._diffMutableValue(m,w+4,y?y.max.y:0))S=!0;if(this._diffMutableValue(m,w+5,y?y.max.z:0))S=!0;let D=b<l?this._partOpacityCullings[b]??this._opacityCulling:this._opacityCulling;if(this._diffMutableValue(m,w+6,D?D.min:0))S=!0;if(this._diffMutableValue(m,w+7,D?D.max:0))S=!0;let P=b<l?this._partSizeCullings[b]??this._sizeCulling:this._sizeCulling;if(this._diffMutableValue(m,w+8,P?P.min:0))S=!0;if(this._diffMutableValue(m,w+9,P?P.max:0))S=!0}return S}_diffMutableValue(l,f,m){if(l[f]===m)return!1;return l[f]=m,!0}_isAnyFeatureActive(){return this._clippingBox!==null||this._opacityCulling!==null||this._sizeCulling!==null||this._opacityScale!==1||this._opacitySaturate||!this._shDc||!this._shOrder1||!this._shOrder2||!this._shOrder3||!this._shOrder4||this._partClippingBoxes.some((l)=>l!==null)||this._partOpacityCullings.some((l)=>l!==null)||this._partSizeCullings.some((l)=>l!==null)||this._partOpacityScales.some((l)=>l!==null)||this._partOpacitySaturates.some((l)=>l!==null)||this._partShDcs.some((l)=>l!==null)||this._partShOrder1s.some((l)=>l!==null)||this._partShOrder2s.some((l)=>l!==null)||this._partShOrder3s.some((l)=>l!==null)||this._partShOrder4s.some((l)=>l!==null)}_markDirty(){this.markAllDefinesAsDirty(),this._textureDirty=!0,this._resolvedPartData=null}get partCount(){return this._partCount}set partCount(l){if(this._partCount!==l)this._partCount=l,this._markDirty()}setPartOptions(l,f){if(this._partCount===0){c.Error("GaussianSplattingDebugMaterialPlugin.setPartOptions: called on a non-compound mesh. partCount is 0.");return}if(f.clippingBox!==void 0)this._partClippingBoxes[l]=f.clippingBox;if(f.opacityCulling!==void 0)this._partOpacityCullings[l]=f.opacityCulling;if(f.sizeCulling!==void 0)this._partSizeCullings[l]=f.sizeCulling;if(f.opacityScale!==void 0)this._partOpacityScales[l]=f.opacityScale;if(f.opacitySaturate!==void 0)this._partOpacitySaturates[l]=f.opacitySaturate;if(f.shDc!==void 0)this._partShDcs[l]=f.shDc;if(f.shOrder1!==void 0)this._partShOrder1s[l]=f.shOrder1;if(f.shOrder2!==void 0)this._partShOrder2s[l]=f.shOrder2;if(f.shOrder3!==void 0)this._partShOrder3s[l]=f.shOrder3;if(f.shOrder4!==void 0)this._partShOrder4s[l]=f.shOrder4;this._markDirty()}clearPartOptions(l){this._partClippingBoxes[l]=null,this._partOpacityCullings[l]=null,this._partSizeCullings[l]=null,this._partOpacityScales[l]=null,this._partOpacitySaturates[l]=null,this._partShDcs[l]=null,this._partShOrder1s[l]=null,this._partShOrder2s[l]=null,this._partShOrder3s[l]=null,this._partShOrder4s[l]=null,this._markDirty()}shiftPartOptions(l){for(let f of this._partArrays)if(l<f.length)f.splice(l,1);this._markDirty()}get clippingBox(){return this._clippingBox}set clippingBox(l){this._clippingBox=l,this._markDirty()}get opacityCulling(){return this._opacityCulling}set opacityCulling(l){this._opacityCulling=l,this._markDirty()}get sizeCulling(){return this._sizeCulling}set sizeCulling(l){this._sizeCulling=l,this._markDirty()}get opacityScale(){return this._opacityScale}set opacityScale(l){this._opacityScale=l,this._markDirty()}get opacitySaturate(){return this._opacitySaturate}set opacitySaturate(l){this._opacitySaturate=l,this._markDirty()}get shDc(){return this._shDc}set shDc(l){this._shDc=l,this._markDirty()}get shOrder1(){return this._shOrder1}set shOrder1(l){this._shOrder1=l,this._markDirty()}get shOrder2(){return this._shOrder2}set shOrder2(l){this._shOrder2=l,this._markDirty()}get shOrder3(){return this._shOrder3}set shOrder3(l){this._shOrder3=l,this._markDirty()}get shOrder4(){return this._shOrder4}set shOrder4(l){this._shOrder4=l,this._markDirty()}getSamplers(l){l.push("dbgPartData")}getClassName(){return"GaussianSplattingDebugMaterialPlugin"}isCompatible(l){switch(l){case 0:case 1:return!0;default:return!1}}isReadyForSubMesh(l,f,m,S){return!0}prepareDefines(l){l.GS_DBG_ENABLED=this._isAnyFeatureActive(),l.GS_DBG_CLIP=this._clippingBox!==null||this._partClippingBoxes.some((f)=>f!==null)?1:0,l.GS_DBG_CULL_OPACITY=this._opacityCulling!==null||this._partOpacityCullings.some((f)=>f!==null)?1:0,l.GS_DBG_CULL_SIZE=this._sizeCulling!==null||this._partSizeCullings.some((f)=>f!==null)?1:0,l.GS_DBG_OPACITY_SCALE=this._opacityScale!==1||this._partOpacityScales.some((f)=>f!==null)?1:0,l.GS_DBG_OPACITY_SATURATE=this._opacitySaturate||this._partOpacitySaturates.some((f)=>f!==null)?1:0,l.GS_DBG_SH_DC=!this._shDc||this._partShDcs.some((f)=>f!==null)?0:1,l.GS_DBG_SH_ORDER1=!this._shOrder1||this._partShOrder1s.some((f)=>f!==null)?0:1,l.GS_DBG_SH_ORDER2=!this._shOrder2||this._partShOrder2s.some((f)=>f!==null)?0:1,l.GS_DBG_SH_ORDER3=!this._shOrder3||this._partShOrder3s.some((f)=>f!==null)?0:1,l.GS_DBG_SH_ORDER4=!this._shOrder4||this._partShOrder4s.some((f)=>f!==null)?0:1}getCustomCode(l,f=0){if(f===1)return this._getCustomCodeWGSL(l);return this._getCustomCodeGLSL(l)}_getCustomCodeGLSL(l){if(l==="vertex")return{CUSTOM_VERTEX_DEFINITIONS:`
#if defined(GS_DBG_ENABLED) && GS_DBG_CLIP == 1 && !defined(IS_COMPOUND)
uniform vec3 dbgClipMin;
uniform vec3 dbgClipMax;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_OPACITY == 1 && !defined(IS_COMPOUND)
uniform float dbgMinOpacity;
uniform float dbgMaxOpacity;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_SIZE == 1 && !defined(IS_COMPOUND)
uniform float dbgMinSize;
uniform float dbgMaxSize;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SCALE == 1 && !defined(IS_COMPOUND)
uniform float dbgOpacityScale;
#endif
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
uniform sampler2D dbgPartData;
${Vs(0)}
#endif
`,CUSTOM_VERTEX_UPDATE:`
#if defined(GS_DBG_ENABLED) && GS_DBG_CLIP == 1 && !defined(IS_COMPOUND)
    if (worldPos.x < dbgClipMin.x || worldPos.x > dbgClipMax.x ||
        worldPos.y < dbgClipMin.y || worldPos.y > dbgClipMax.y ||
        worldPos.z < dbgClipMin.z || worldPos.z > dbgClipMax.z) {
        scale = vec2(0.0);
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_OPACITY == 1 && !defined(IS_COMPOUND)
    if (splat.color.w < dbgMinOpacity || splat.color.w > dbgMaxOpacity) {
        scale = vec2(0.0);
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_SIZE == 1 && !defined(IS_COMPOUND)
    {
        float _d0 = splat.covA.x; float _d1 = splat.covA.y; float _d2 = splat.covA.z;
        float _d3 = splat.covA.w; float _d4 = splat.covB.x; float _d5 = splat.covB.y;
        float _det = _d0*(_d3*_d5 - _d4*_d4) - _d1*(_d1*_d5 - _d4*_d2) + _d2*(_d1*_d4 - _d3*_d2);
        float _sz = pow(abs(_det), 1.0/6.0);
        if (_sz < dbgMinSize || _sz > dbgMaxSize) {
            scale = vec2(0.0);
        }
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SCALE == 1 && !defined(IS_COMPOUND)
    vColor.w *= dbgOpacityScale;
#endif
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
    {
        int _pIdx = int(splat.partIndex);
        vPartIndex = float(splat.partIndex);
        vec4 _row0 = texelFetch(dbgPartData, ivec2(_pIdx, 0), 0);
        vec4 _row1 = texelFetch(dbgPartData, ivec2(_pIdx, 1), 0);
        vec4 _row2 = texelFetch(dbgPartData, ivec2(_pIdx, 2), 0);
        vec3 _clipMin = _row0.xyz;
        vec3 _clipMax = vec3(_row0.w, _row1.xy);
        float _minOp = _row1.z;
        float _maxOp = _row1.w;
        float _minSz = _row2.x;
        float _maxSz = _row2.y;
        float _opSc  = _row2.z;
        #if GS_DBG_CLIP == 1
        if (worldPos.x < _clipMin.x || worldPos.x > _clipMax.x ||
            worldPos.y < _clipMin.y || worldPos.y > _clipMax.y ||
            worldPos.z < _clipMin.z || worldPos.z > _clipMax.z) {
            scale = vec2(0.0);
        }
        #endif
        #if GS_DBG_CULL_OPACITY == 1
        if (splat.color.w < _minOp || splat.color.w > _maxOp) {
            scale = vec2(0.0);
        }
        #endif
        #if GS_DBG_CULL_SIZE == 1
        {
            float _d0 = splat.covA.x; float _d1 = splat.covA.y; float _d2 = splat.covA.z;
            float _d3 = splat.covA.w; float _d4 = splat.covB.x; float _d5 = splat.covB.y;
            float _det = _d0*(_d3*_d5 - _d4*_d4) - _d1*(_d1*_d5 - _d4*_d2) + _d2*(_d1*_d4 - _d3*_d2);
            float _sz = pow(abs(_det), 1.0/6.0);
            if (_sz < _minSz || _sz > _maxSz) {
                scale = vec2(0.0);
            }
        }
        #endif
        #if GS_DBG_OPACITY_SCALE == 1
        vColor.w *= _opSc;
        #endif
    }
#endif
`};else if(l==="fragment")return{CUSTOM_FRAGMENT_DEFINITIONS:`
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
uniform sampler2D dbgPartData;
${Vs(0)}
#endif
`,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
    if (texelFetch(dbgPartData, ivec2(int(vPartIndex + 0.5), 2), 0).w > 0.5) { finalColor.a = vColor.a; }
#elif defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SATURATE == 1
    finalColor.a = vColor.a;
#endif
`};return null}_getCustomCodeWGSL(l){if(l==="vertex")return{CUSTOM_VERTEX_DEFINITIONS:`
#if defined(GS_DBG_ENABLED) && GS_DBG_CLIP == 1 && !defined(IS_COMPOUND)
uniform dbgClipMin: vec3f;
uniform dbgClipMax: vec3f;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_OPACITY == 1 && !defined(IS_COMPOUND)
uniform dbgMinOpacity: f32;
uniform dbgMaxOpacity: f32;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_SIZE == 1 && !defined(IS_COMPOUND)
uniform dbgMinSize: f32;
uniform dbgMaxSize: f32;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SCALE == 1 && !defined(IS_COMPOUND)
uniform dbgOpacityScale: f32;
#endif
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
var dbgPartData: texture_2d<f32>;
${Vs(1)}
#endif
`,CUSTOM_VERTEX_UPDATE:`
#if defined(GS_DBG_ENABLED) && GS_DBG_CLIP == 1 && !defined(IS_COMPOUND)
    if (worldPos.x < uniforms.dbgClipMin.x || worldPos.x > uniforms.dbgClipMax.x ||
        worldPos.y < uniforms.dbgClipMin.y || worldPos.y > uniforms.dbgClipMax.y ||
        worldPos.z < uniforms.dbgClipMin.z || worldPos.z > uniforms.dbgClipMax.z) {
        scale = vec2f(0.0);
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_OPACITY == 1 && !defined(IS_COMPOUND)
    if (splat.color.w < uniforms.dbgMinOpacity || splat.color.w > uniforms.dbgMaxOpacity) {
        scale = vec2f(0.0);
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_SIZE == 1 && !defined(IS_COMPOUND)
    {
        let _d0 = splat.covA.x; let _d1 = splat.covA.y; let _d2 = splat.covA.z;
        let _d3 = splat.covA.w; let _d4 = splat.covB.x; let _d5 = splat.covB.y;
        let _det = _d0*(_d3*_d5 - _d4*_d4) - _d1*(_d1*_d5 - _d4*_d2) + _d2*(_d1*_d4 - _d3*_d2);
        let _sz = pow(abs(_det), 1.0/6.0);
        if (_sz < uniforms.dbgMinSize || _sz > uniforms.dbgMaxSize) {
            scale = vec2f(0.0);
        }
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SCALE == 1 && !defined(IS_COMPOUND)
    vertexOutputs.vColor.w *= uniforms.dbgOpacityScale;
#endif
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
    {
        let _pIdx = i32(splat.partIndex);
        vertexOutputs.vPartIndex = f32(splat.partIndex);
        let _row0 = textureLoad(dbgPartData, vec2i(_pIdx, 0), 0);
        let _row1 = textureLoad(dbgPartData, vec2i(_pIdx, 1), 0);
        let _row2 = textureLoad(dbgPartData, vec2i(_pIdx, 2), 0);
        let _clipMin = _row0.xyz;
        let _clipMax = vec3f(_row0.w, _row1.xy);
        let _minOp = _row1.z;
        let _maxOp = _row1.w;
        let _minSz = _row2.x;
        let _maxSz = _row2.y;
        let _opSc  = _row2.z;
        #if GS_DBG_CLIP == 1
        if (worldPos.x < _clipMin.x || worldPos.x > _clipMax.x ||
            worldPos.y < _clipMin.y || worldPos.y > _clipMax.y ||
            worldPos.z < _clipMin.z || worldPos.z > _clipMax.z) {
            scale = vec2f(0.0);
        }
        #endif
        #if GS_DBG_CULL_OPACITY == 1
        if (splat.color.w < _minOp || splat.color.w > _maxOp) {
            scale = vec2f(0.0);
        }
        #endif
        #if GS_DBG_CULL_SIZE == 1
        {
            let _d0 = splat.covA.x; let _d1 = splat.covA.y; let _d2 = splat.covA.z;
            let _d3 = splat.covA.w; let _d4 = splat.covB.x; let _d5 = splat.covB.y;
            let _det = _d0*(_d3*_d5 - _d4*_d4) - _d1*(_d1*_d5 - _d4*_d2) + _d2*(_d1*_d4 - _d3*_d2);
            let _sz = pow(abs(_det), 1.0/6.0);
            if (_sz < _minSz || _sz > _maxSz) {
                scale = vec2f(0.0);
            }
        }
        #endif
        #if GS_DBG_OPACITY_SCALE == 1
        vertexOutputs.vColor.w *= _opSc;
        #endif
    }
#endif
`};else if(l==="fragment")return{CUSTOM_FRAGMENT_DEFINITIONS:`
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
var dbgPartData: texture_2d<f32>;
${Vs(1)}
#endif
`,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
    if (textureLoad(dbgPartData, vec2i(i32(fragmentInputs.vPartIndex + 0.5), 2), 0).w > 0.5) {
        let _gsdbgA: f32 = -dot(fragmentInputs.vPosition, fragmentInputs.vPosition);
        if (_gsdbgA > -4.0) { finalColor.a = fragmentInputs.vColor.a; }
    }
#elif defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SATURATE == 1
    {
        let _gsdbgA: f32 = -dot(fragmentInputs.vPosition, fragmentInputs.vPosition);
        if (_gsdbgA > -4.0) {
            finalColor.a = fragmentInputs.vColor.a;
        }
    }
#endif
`};return null}getUniforms(){return{externalUniforms:["dbgClipMin","dbgClipMax","dbgMinOpacity","dbgMaxOpacity","dbgMinSize","dbgMaxSize","dbgOpacityScale"]}}_buildTextureData(l){let f=this._maxPartCount,m=new Float32Array(f*5*4);for(let S=0;S<f;S++){let b=S*4,w=(f+S)*4,y=(f*2+S)*4,D=(f*3+S)*4,P=(f*4+S)*4,T=S<l?this._partClippingBoxes[S]??this._clippingBox:this._clippingBox;if(T)m[b]=T.min.x,m[b+1]=T.min.y,m[b+2]=T.min.z,m[b+3]=T.max.x,m[w]=T.max.y,m[w+1]=T.max.z;else m[b]=-1e9,m[b+1]=-1e9,m[b+2]=-1e9,m[b+3]=1e9,m[w]=1e9,m[w+1]=1e9;let E=S<l?this._partOpacityCullings[S]??this._opacityCulling:this._opacityCulling;m[w+2]=E?E.min:0,m[w+3]=E?E.max:1;let L=S<l?this._partSizeCullings[S]??this._sizeCulling:this._sizeCulling;m[y]=L?L.min:0,m[y+1]=L?L.max:1e9,m[y+2]=S<l?this._partOpacityScales[S]??this._opacityScale:this._opacityScale;let A=S<l?this._partOpacitySaturates[S]??this._opacitySaturate:this._opacitySaturate;m[y+3]=A?1:0,m[D]=(S<l?this._partShDcs[S]??this._shDc:this._shDc)?1:0,m[D+1]=(S<l?this._partShOrder1s[S]??this._shOrder1:this._shOrder1)?1:0,m[D+2]=(S<l?this._partShOrder2s[S]??this._shOrder2:this._shOrder2)?1:0,m[D+3]=(S<l?this._partShOrder3s[S]??this._shOrder3:this._shOrder3)?1:0,m[P]=(S<l?this._partShOrder4s[S]??this._shOrder4:this._shOrder4)?1:0}return m}_updateOrCreateTexture(l){if(!this._maxPartCount)this._maxPartCount=Gn(l.getEngine());let f=this._buildTextureData(this._partCount);if(!this._dbgPartDataTexture)this._dbgPartDataTexture=he.CreateRGBATexture(f,this._maxPartCount,5,l,!1,!1,1,1);else this._dbgPartDataTexture.update(f);this._textureDirty=!1}bindForSubMesh(l,f,m,S){let b=S.effect;if(!b)return;if(this._partCount>0&&this._isAnyFeatureActive()){if(this._textureDirty||!this._dbgPartDataTexture)this._updateOrCreateTexture(f);if(this._dbgPartDataTexture)b.setTexture("dbgPartData",this._dbgPartDataTexture)}else if(this._partCount===0){if(this._clippingBox)b.setVector3("dbgClipMin",this._clippingBox.min),b.setVector3("dbgClipMax",this._clippingBox.max);if(this._opacityCulling)b.setFloat("dbgMinOpacity",this._opacityCulling.min),b.setFloat("dbgMaxOpacity",this._opacityCulling.max);if(this._sizeCulling)b.setFloat("dbgMinSize",this._sizeCulling.min),b.setFloat("dbgMaxSize",this._sizeCulling.max);if(this._opacityScale!==1)b.setFloat("dbgOpacityScale",this._opacityScale)}}dispose(l){this._dbgPartDataTexture?.dispose(),this._dbgPartDataTexture=null}}var _t=!1;function Rb(){if(_t)return;_t=!0,o("BABYLON.GaussianSplattingDebugMaterialPlugin",Ra)}var Yu=(()=>{var l;let f=qe,m=[],S;return l=class extends f{get isEnabled(){return this._isEnabled}set isEnabled(w){if(this._isEnabled===w)return;this._isEnabled=w,this._onIsEnabledChanged()}_onIsEnabledChanged(){}constructor(w,y,D){super(w,"GaussianSplatSolidColor",200);this._partColors=t(this,m),this._isEnabled=!0,this._partColorArray=[],this._partColors=y,this._maxPartCount=D??Gn(w.getScene().getEngine()),this._enable(!0)}updatePartColors(w){this._partColors=w}getClassName(){return"GaussianSplattingSolidColorMaterialPlugin"}isCompatible(w){switch(w){case 0:case 1:return!0;default:return!1}}isReadyForSubMesh(w,y,D,P){return!0}getCustomCode(w,y=0){let D=this._maxPartCount;if(y===1)return this._getCustomCodeWGSL(w,D);return this._getCustomCodeGLSL(w,D)}_getCustomCodeGLSL(w,y){if(w==="vertex")return{CUSTOM_VERTEX_DEFINITIONS:Vs(0),CUSTOM_VERTEX_UPDATE:`
#if IS_COMPOUND
    vPartIndex = float(splat.partIndex);
#else
    vPartIndex = 0.0;
#endif
                `};else if(w==="fragment")return{CUSTOM_FRAGMENT_DEFINITIONS:`
${Vs(0)}
uniform float solidColorEnabled;
uniform vec3 partColors[${y}];
                `,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
if (solidColorEnabled > 0.5) {
    int partIdx = int(vPartIndex + 0.5);
    finalColor = vec4(partColors[partIdx], finalColor.w);
}
                `};return null}_getCustomCodeWGSL(w,y){if(w==="vertex")return{CUSTOM_VERTEX_DEFINITIONS:Vs(1),CUSTOM_VERTEX_UPDATE:`
#if IS_COMPOUND
    vertexOutputs.vPartIndex = f32(splat.partIndex);
#else
    vertexOutputs.vPartIndex = 0.0;
#endif
                `};else if(w==="fragment")return{CUSTOM_FRAGMENT_DEFINITIONS:`
${Vs(1)}
uniform solidColorEnabled: f32;
uniform partColors: array<vec3f, ${y}>;
                `,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
if (uniforms.solidColorEnabled > 0.5) {
    var partIdx: i32 = i32(fragmentInputs.vPartIndex + 0.5);
    finalColor = vec4f(uniforms.partColors[partIdx], finalColor.w);
}
                `};return null}getUniforms(){return{externalUniforms:["partColors","solidColorEnabled"]}}bindForSubMesh(w,y,D,P){let T=P.effect;if(!T)return;T.setFloat("solidColorEnabled",this._isEnabled?1:0);let E=this._partColorArray;E.length=0;for(let L=0;L<this._maxPartCount;L++){let A=this._partColors[L];if(A)E.push(A.r,A.g,A.b);else E.push(0,0,0)}T.setArray3("partColors",E)}},(()=>{let b=typeof Symbol==="function"&&Symbol.metadata?Object.create(f[Symbol.metadata]??null):void 0;if(S=[s()],r(l,null,S,{kind:"getter",name:"isEnabled",static:!1,private:!1,access:{has:(w)=>("isEnabled"in w),get:(w)=>w.isEnabled},metadata:b},null,m),b)Object.defineProperty(l,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:b})})(),l})();var gt=!1;function Eb(){if(gt)return;gt=!0,o("BABYLON.GaussianSplattingSolidColorMaterialPlugin",Yu)}var ju=(()=>{var l;let f=qe,m=[],S,b;return l=class extends f{get isEnabled(){return this._isEnabled}set isEnabled(y){this._isEnabled=y}get sizeScale(){return this._sizeScale}set sizeScale(y){if(!Number.isFinite(y)||y<=0)throw RangeError("sizeScale must be a positive finite number of pixels.");this._sizeScale=y}constructor(y){super(y,"GaussianSplattingSize",210);this._isEnabled=(t(this,m),!0),this._sizeScale=16,this._enable(!0)}getClassName(){return"GaussianSplattingSizeMaterialPlugin"}isCompatible(y){return y===0||y===1}getCustomCode(y,D=0){let P=D===1;if(y==="vertex")return{CUSTOM_VERTEX_DEFINITIONS:P?`varying vSplatSizeBrightness: f32;
uniform splatSizeScale: f32;`:`varying float vSplatSizeBrightness;
uniform float splatSizeScale;`,CUSTOM_VERTEX_UPDATE:P?"vertexOutputs.vSplatSizeBrightness = 0.0;":"vSplatSizeBrightness = 0.0;",CUSTOM_GAUSSIAN_SPLAT_PROJECTED_SIZE:P?"vertexOutputs.vSplatSizeBrightness = uniforms.splatSizeScale / (uniforms.splatSizeScale + 2.0 * max(length(majorAxis * scale), length(minorAxis * scale)));":"vSplatSizeBrightness = splatSizeScale / (splatSizeScale + 2.0 * max(length(majorAxis * scale), length(minorAxis * scale)));"};if(y==="fragment")return{CUSTOM_FRAGMENT_DEFINITIONS:P?`varying vSplatSizeBrightness: f32;
uniform splatSizeEnabled: f32;`:`varying float vSplatSizeBrightness;
uniform float splatSizeEnabled;`,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:P?"if (uniforms.splatSizeEnabled > 0.5) { finalColor = vec4f(vec3f(fragmentInputs.vSplatSizeBrightness), finalColor.a); }":"if (splatSizeEnabled > 0.5) { finalColor = vec4(vec3(vSplatSizeBrightness), finalColor.a); }"};return null}getUniforms(){return{externalUniforms:["splatSizeScale","splatSizeEnabled"]}}bindForSubMesh(y,D,P,T){T.effect?.setFloat("splatSizeScale",this._sizeScale),T.effect?.setFloat("splatSizeEnabled",this._isEnabled?1:0)}},(()=>{let w=typeof Symbol==="function"&&Symbol.metadata?Object.create(f[Symbol.metadata]??null):void 0;if(S=[s()],b=[s()],r(l,null,S,{kind:"getter",name:"isEnabled",static:!1,private:!1,access:{has:(y)=>("isEnabled"in y),get:(y)=>y.isEnabled},metadata:w},null,m),r(l,null,b,{kind:"getter",name:"sizeScale",static:!1,private:!1,access:{has:(y)=>("sizeScale"in y),get:(y)=>y.sizeScale},metadata:w},null,m),w)Object.defineProperty(l,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:w})})(),l})();var St=!1;function Ab(){if(!St)St=!0,o("BABYLON.GaussianSplattingSizeMaterialPlugin",ju)}var Qu=(()=>{var l;let f=qe,m=[],S,b;return l=class extends f{get isEnabled(){return this._isEnabled}set isEnabled(y){if(y===this._isEnabled)return;if(this._isEnabled=y,y)this._originalAlphaMode=this._material.alphaMode,this._originalDisableDepthWrite=this._material.disableDepthWrite,this._originalForceDepthWrite=this._material.forceDepthWrite;this._applyBlendState()}get intensity(){return this._intensity}set intensity(y){if(!Number.isFinite(y)||y<=0)throw RangeError("intensity must be a positive finite number.");this._intensity=y}constructor(y){super(y,"GaussianSplattingOverdraw",220);this._isEnabled=(t(this,m),!0),this._intensity=0.00390625,this._originalAlphaMode=y.alphaMode,this._originalDisableDepthWrite=y.disableDepthWrite,this._originalForceDepthWrite=y.forceDepthWrite,this._applyBlendState(),this._enable(!0)}_applyBlendState(){if(this._isEnabled)this._material.alphaMode=6,this._material.disableDepthWrite=!0,this._material.forceDepthWrite=!1;else{if(this._material.alphaMode===6)this._material.alphaMode=this._originalAlphaMode;if(this._material.disableDepthWrite)this._material.disableDepthWrite=this._originalDisableDepthWrite;if(!this._material.forceDepthWrite)this._material.forceDepthWrite=this._originalForceDepthWrite}}getClassName(){return"GaussianSplattingOverdrawMaterialPlugin"}isCompatible(y){return y===0||y===1}getCustomCode(y,D=0){if(y!=="fragment")return null;let P=D===1;return{CUSTOM_FRAGMENT_DEFINITIONS:P?`uniform splatOverdrawEnabled: f32;
uniform splatOverdrawIntensity: f32;`:`uniform float splatOverdrawEnabled;
uniform float splatOverdrawIntensity;`,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:P?"if (uniforms.splatOverdrawEnabled > 0.5) { if (finalColor.a <= 0.0) { discard; } finalColor = vec4f(vec3f(uniforms.splatOverdrawIntensity), 1.0); }":"if (splatOverdrawEnabled > 0.5) { if (finalColor.a <= 0.0) discard; finalColor = vec4(vec3(splatOverdrawIntensity), 1.0); }"}}getUniforms(){return{externalUniforms:["splatOverdrawEnabled","splatOverdrawIntensity"]}}bindForSubMesh(y,D,P,T){T.effect?.setFloat("splatOverdrawEnabled",this._isEnabled?1:0),T.effect?.setFloat("splatOverdrawIntensity",this._intensity)}dispose(){this.isEnabled=!1}serialize(){return{...super.serialize(),originalAlphaMode:this._originalAlphaMode,originalDisableDepthWrite:this._originalDisableDepthWrite,originalForceDepthWrite:this._originalForceDepthWrite}}parse(y,D,P){if(super.parse(y,D,P),!this._isEnabled)return;this._originalAlphaMode=y.originalAlphaMode??this._originalAlphaMode,this._originalDisableDepthWrite=y.originalDisableDepthWrite??this._originalDisableDepthWrite,this._originalForceDepthWrite=y.originalForceDepthWrite??this._originalForceDepthWrite,this._applyBlendState()}copyTo(y){let D=y;if(super.copyTo(y),!D._isEnabled)return;D._originalAlphaMode=this._originalAlphaMode,D._originalDisableDepthWrite=this._originalDisableDepthWrite,D._originalForceDepthWrite=this._originalForceDepthWrite,D._applyBlendState()}},(()=>{let w=typeof Symbol==="function"&&Symbol.metadata?Object.create(f[Symbol.metadata]??null):void 0;if(S=[s()],b=[s()],r(l,null,S,{kind:"getter",name:"isEnabled",static:!1,private:!1,access:{has:(y)=>("isEnabled"in y),get:(y)=>y.isEnabled},metadata:w},null,m),r(l,null,b,{kind:"getter",name:"intensity",static:!1,private:!1,access:{has:(y)=>("intensity"in y),get:(y)=>y.intensity},metadata:w},null,m),w)Object.defineProperty(l,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:w})})(),l})();var xt=!1;function wb(){if(!xt)xt=!0,o("BABYLON.GaussianSplattingOverdrawMaterialPlugin",Qu)}var ye=32,Ve=!1,je=null,Ze=!1;async function us(){try{await Promise.all([(u("az176kah"),import("./gpsPreprocess.compute-az176kah.js")),(u("rbqd393n"),import("./gpsScanBlocks.compute-rbqd393n.js")),(u("ajy1nhe3"),import("./gpsScanSums.compute-ajy1nhe3.js")),(u("rn3g82q4"),import("./gpsScanAdd.compute-rn3g82q4.js")),(u("7abawdek"),import("./gpsPartition.compute-7abawdek.js")),(u("kvmr1xqs"),import("./gpsSplat.compute-kvmr1xqs.js")),(u("t24eftrr"),import("./gpsResolve.compute-t24eftrr.js")),(u("jkxty1qy"),import("./gpsHiZBuild.compute-jkxty1qy.js")),(u("1z7dykts"),import("./gaussianPointSplattingBlit.vertex-1z7dykts.js")),(u("0mp3pjk0"),import("./gaussianPointSplattingBlit.fragment-0mp3pjk0.js")),(u("hzzwx9pn"),import("./gaussianPointSplattingDepthBlit.fragment-hzzwx9pn.js"))]),Ve=!0}catch(l){Ze=!0,je=null,c.Error(`GaussianSplattingMesh: failed to load point-splatting shaders: ${String(l)}`)}}function cs(){if(!Ve&&!je)Ze=!1,je=us()}var vt=new Float32Array(1),hs=new Uint32Array(vt.buffer);function Ue(l,f){return(Ft(l)|Ft(f)<<16)>>>0}class yt{constructor(l){this._colorMode=!1,this._depthMode=!1,this._projectionClipRange=new Float64Array(2),this._scale=1,this._renderScale="auto",this._occlusionCulling=!1,this._autoN=2,this._autoMeasuredGeneration=-1,this._lastRenderedGeneration=-1,this._autoRequestId=0,this._budgetReadPending=!1,this._resultReady=!1,this._colorHistoryReady=!1,this._colorUsesCameraTransform=!1,this._cameraFrameId=-1,this._cameraId=-1,this._progressReady=!1,this._computedWidth=0,this._computedHeight=0,this._progressFrameCount=0,this._progressGeneration=-1,this._progressCycleLength=0,this._streamingWarned=!1,this._sourceWarned=!1,this._workloadWarned=!1,this._invalidProjectionWarned=!1,this._renderer=null,this._blit=null,this._blitMesh=null,this._depthBlit=null,this._depthBlitMesh=null,this._computeObserver=null,this._cameraObserver=null,this._restoreObserver=null,this._splatCount=0,this._partCount=1,this._decodedPartCount=0,this._decodedRevision=-1,this._decodedShDegree=-1,this._partLocalMin=new Float32Array(3),this._partLocalMax=new Float32Array(3),this._partScratch=new Float32Array(40),this._decodedSplatsData=null,this._vpMatrix=new a,this._cameraVpMatrix=new a,this._inverseProjection=new a,this._outputSize={width:1,height:1},this._depthSpan=[0,0],this._mesh=l,this._scene=l.getScene()}get colorRenderMode(){return this._colorMode}set colorRenderMode(l){if(l===this._colorMode)return;if(l&&!this._scene.getEngine().isWebGPU){c.Warn("GaussianSplattingMesh: point-splatting render mode requires a WebGPU engine; ignoring.");return}if(this._colorMode=l,!l)this._colorHistoryReady=!1;if(l)this._ensureCompute(),this._enableColorBlit();else this._blitMesh?.setEnabled(!1),this._releaseComputeIfIdle()}get depthRenderMode(){return this._depthMode}set depthRenderMode(l){if(l===this._depthMode)return;if(l&&!this._scene.getEngine().isWebGPU){c.Warn("GaussianSplattingMesh: point-splatting depth render mode requires a WebGPU engine; ignoring.");return}if(this._depthMode=l,l)this._ensureCompute(),this._enableDepthBlit();else this._depthBlitMesh?.setEnabled(!1),this._releaseComputeIfIdle()}get progress(){if(!this._computeActive||!this._progressReady||!this._renderer)return null;return{renderedFrameCount:this._progressFrameCount,accumulationVersion:this._progressGeneration,pixelCycleLength:this._progressCycleLength}}get _computeActive(){return(this._colorMode||this._depthMode)&&!Ze&&!this._mesh._pointStreamingUnsupported&&!this._hasUnsupportedSource}get _hasUnsupportedSource(){return this._mesh.useSog||!this._mesh._splatsData&&this._mesh.getTotalVertices()>0}get pointScale(){return this._scale}set pointScale(l){if(l===this._scale)return;if(this._scale=l,this._renderer)this._renderer.pointScale=l,this._renderer.resetAccumulation()}get occlusionCulling(){return this._occlusionCulling}set occlusionCulling(l){if(l===this._occlusionCulling)return;if(this._occlusionCulling=l,this._renderer)this._renderer.occlusionCulling=l,this._renderer.resetAccumulation()}_ensureCompute(){let l=this._scene.getEngine();if(cs(),!this._renderer)eh(),this._renderer=new Rp(l),this._renderer.pointScale=this._scale,this._renderer.occlusionCulling=this._occlusionCulling,this._decodedSplatsData=null;if(!this._mesh._pointStreamingUnsupported&&!this._hasUnsupportedSource&&this._isWorkloadSupported())this._syncData();if(!this._computeObserver)this._computeObserver=this._scene.onBeforeRenderObservable.add(()=>{this._resultReady=!1});if(!this._cameraObserver)this._cameraObserver=this._scene.onBeforeCameraRenderObservable.add((f)=>{this._cameraFrameId=this._scene.getFrameId(),this._cameraId=f.uniqueId,this._cameraVpMatrix.copyFrom(this._scene.getTransformMatrix())});if(!this._restoreObserver)this._restoreObserver=l.onContextRestoredObservable.add(()=>{if(this._releaseComputeResources(),this._releaseBlitResources(),this._ensureCompute(),this._colorMode)this._enableColorBlit();if(this._depthMode)this._enableDepthBlit()})}_releaseComputeIfIdle(){if(this._colorMode||this._depthMode)return;if(this._computeObserver)this._scene.onBeforeRenderObservable.remove(this._computeObserver),this._computeObserver=null;if(this._cameraObserver)this._scene.onBeforeCameraRenderObservable.remove(this._cameraObserver),this._cameraObserver=null;if(this._restoreObserver)this._scene.getEngine().onContextRestoredObservable.remove(this._restoreObserver),this._restoreObserver=null;this._releaseComputeResources()}_releaseComputeResources(){this._autoRequestId++,this._renderer?.dispose(),this._renderer=null,this._decodedSplatsData=null,this._resultReady=!1,this._colorHistoryReady=!1,this._cameraFrameId=-1,this._progressReady=!1,this._budgetReadPending=!1,this._autoN=2,this._autoMeasuredGeneration=-1,this._lastRenderedGeneration=-1}_releaseBlitResources(){this._blit?.dispose(),this._blitMesh?.dispose(),this._depthBlit?.dispose(),this._depthBlitMesh?.dispose(),this._blit=null,this._blitMesh=null,this._depthBlit=null,this._depthBlitMesh=null}_createBlitMesh(l,f){let m=new p(l,this._scene),S=new M;return S.positions=[-1,-1,0,3,-1,0,-1,3,0],S.indices=[0,1,2],S.applyToMesh(m),m.material=f,m.doNotSerialize=!0,m.isPickable=!1,m.doNotSyncBoundingInfo=!0,m.setEnabled(!1),m.reservedDataStore={hidden:!0},m.computeWorldMatrix(!0),m}_enableColorBlit(){if(!this._blit)this._blit=new Ep(this._mesh.name+"_blit",this._scene),this._blit.doNotSerialize=!0;if(!this._blitMesh)this._blitMesh=this._createBlitMesh(this._mesh.name+"_blitMesh",this._blit)}_enableDepthBlit(){if(!this._depthBlit)this._depthBlit=new Ap(this._mesh.name+"_depthBlit",this._scene),this._depthBlit.doNotSerialize=!0;if(!this._depthBlitMesh)this._depthBlitMesh=this._createBlitMesh(this._mesh.name+"_depthBlitMesh",this._depthBlit)}_isWorkloadSupported(){let l=this._mesh._splatsData,f=l?l.byteLength/ye|0:0,m=this._mesh._shData?.length?this._mesh._shDegree:0,{width:S,height:b}=this._getOutputSize();if(this._renderer.supportsWorkload(f,m,S,b))return!0;if(!this._workloadWarned)this._workloadWarned=!0,c.Warn(`GaussianSplattingMesh: point splatting needs storage buffers larger than this device allows (${f} splats at ${S}x${b}); falling back to the classic renderer.`);return!1}_syncData(){if(this._mesh._splatDataPending)return;let l=this._mesh._splatsData,f=l?l.byteLength/ye|0:0,m=this._mesh.isCompound?this._mesh.partCount:1,S=this._mesh._splatDataRevision,b=this._mesh._shDegree;if(l===this._decodedSplatsData&&f===this._splatCount&&m===this._decodedPartCount&&S===this._decodedRevision&&b===this._decodedShDegree)return;if(this._decodedSplatsData=l,this._decodedPartCount=m,this._decodedRevision=S,this._decodedShDegree=b,!l||f===0){this._splatCount=0;return}this._decode(l)}_decode(l){let f=new Uint8Array(l),m=new Float32Array(l),S=f.length/ye|0,b=this._mesh._getPointDecodeInputs(),w=b.positions,y=b.flipY?-1:1,D=this._mesh.isCompound?b.partIndices:null,P=this._mesh.isCompound?this._mesh.partCount:1;if(D){for(let I=0;I<S;I++)if(D[I]+1>P)P=D[I]+1}let T=new Float32Array(S*4),E=new Uint32Array(S*4),L=new Uint32Array(S),A=this._packSh(this._mesh._shData??void 0,this._mesh._shDegree,S),O=new d,k=new a,W=new a,q=new a,F=new Float32Array(P*3).fill(1/0),z=new Float32Array(P*3).fill(-1/0),G=b.activeRanges,V=G?new Uint8Array(S):null;if(G&&V)for(let I=0;I<G.length;I+=2)V.fill(1,G[I],Math.min(S,G[I]+G[I+1]));for(let I=0;I<S;I++){let U=!V||V[I]!==0,X=w?w[4*I]:m[8*I],j=w?w[4*I+1]:m[8*I+1]*y,te=w?w[4*I+2]:m[8*I+2],se=ye*I+28;O.set((f[se+1]-127.5)/127.5,(f[se+2]-127.5)/127.5,(f[se+3]-127.5)/127.5,-(f[se+0]-127.5)/127.5),O.normalize(),O.toRotationMatrix(k),a.ScalingToRef(m[8*I+3]*2,m[8*I+4]*2,m[8*I+5]*2,W),k.multiplyToRef(W,q);let Z=q.m,Q=D?D[I]:0;T[4*I+0]=X,T[4*I+1]=j,T[4*I+2]=te,T[4*I+3]=Q;let ee=Q*3;if(U&&X<F[ee])F[ee]=X;if(U&&j<F[ee+1])F[ee+1]=j;if(U&&te<F[ee+2])F[ee+2]=te;if(U&&X>z[ee])z[ee]=X;if(U&&j>z[ee+1])z[ee+1]=j;if(U&&te>z[ee+2])z[ee+2]=te;let H=Z[0]*Z[0]+Z[1]*Z[1]+Z[2]*Z[2],J=Z[0]*Z[4]+Z[1]*Z[5]+Z[2]*Z[6],re=Z[0]*Z[8]+Z[1]*Z[9]+Z[2]*Z[10],ne=Z[4]*Z[4]+Z[5]*Z[5]+Z[6]*Z[6],ae=Z[4]*Z[8]+Z[5]*Z[9]+Z[6]*Z[10],oe=Z[8]*Z[8]+Z[9]*Z[9]+Z[10]*Z[10],ce=Math.max(Math.abs(H),Math.abs(J),Math.abs(re),Math.abs(ne),Math.abs(ae),Math.abs(oe));if(!(ce>0))ce=1;let le=1/ce;E[4*I+0]=Ue(H*le,J*le),E[4*I+1]=Ue(re*le,ne*le),E[4*I+2]=Ue(ae*le,oe*le),vt[0]=ce,E[4*I+3]=hs[0];let fe=ye*I+24;L[I]=f[fe]|f[fe+1]<<8|f[fe+2]<<16|(U?f[fe+3]:0)<<24}if(this._splatCount=S,this._partCount=P,this._partLocalMin=F,this._partLocalMax=z,this._partScratch.length!==P*40)this._partScratch=new Float32Array(P*40);this._renderer.updateSplats(T,E,L,A,this._mesh._shDegree,S)}_packSh(l,f,m){if(!l||l.length===0||f<1)return null;let S=wp(f),b=(f===1?3:f===2?8:f===3?15:24)*3,w=new Uint8Array(m*S);for(let y=0;y<m;y++){let D=y*S;for(let P=0;P<b;P++){let T=l[P/16|0];w[D+P]=T[y*16+P%16]}}return new Uint32Array(w.buffer)}_uploadParts(){this._renderer.debugActive=this._packParts()?1:0,this._renderer.setPartData(this._partScratch,this._partCount)}_packParts(){let l=this._partCount;if(this._partScratch.length!==l*40)this._partScratch=new Float32Array(l*40);let f=this._partScratch,m=this._mesh.isCompound,S=this._mesh.computeWorldMatrix(!0);if(m)this._mesh._syncPartProxyWorldMatrices();let b=this._mesh.material?.alpha??1,w=this._mesh.material?.pluginManager?.getPlugin("GaussianSplattingDebug"),y=w?.constructor,D=w instanceof Ra&&y===Ra&&w.isDebugActive,P=null,T=0;if(w&&D){let E=w.getResolvedPartData(l,this._scene.getEngine());P=E.data,T=E.maxPartCount}for(let E=0;E<l;E++){let L=(m?this._mesh.getWorldMatrixForPart(E):S).m,A=m?this._mesh.getPartVisibility(E):this._mesh.visibility,O=E*40;if(f.set(L,O),f[O+16]=A*b,f[O+17]=0,f[O+18]=0,f[O+19]=0,P)for(let k=0;k<5;k++){let W=(T*k+E)*4,q=O+20+k*4;f[q]=P[W],f[q+1]=P[W+1],f[q+2]=P[W+2],f[q+3]=P[W+3]}else f[O+20]=-1e9,f[O+21]=-1e9,f[O+22]=-1e9,f[O+23]=1e9,f[O+24]=1e9,f[O+25]=1e9,f[O+26]=0,f[O+27]=1,f[O+28]=0,f[O+29]=1e9,f[O+30]=1,f[O+31]=0,f[O+32]=1,f[O+33]=1,f[O+34]=1,f[O+35]=1,f[O+36]=1,f[O+37]=0,f[O+38]=0,f[O+39]=0}return D}_depthInputsMatchColorHistory(){let l=this._renderer;if(!this._colorHistoryReady||!l)return!0;let f=this._mesh.material,m=this._colorUsesCameraTransform?this._getCameraTransform():this._vpMatrix;if(this._decodedSplatsData!==this._mesh._splatsData||this._decodedRevision!==this._mesh._splatDataRevision||this._decodedShDegree!==this._mesh._shDegree||!m?.equalsWithEpsilon(this._scene.getTransformMatrix(),0.00001)||l.kernelSize!==(f.kernelSize||ht.KernelSize)||l.minPixelSize!==f.minPixelSize||l.compensation!==f.compensation)return!1;let S=this._packParts()?1:0;return l.debugActive===S&&l._matchesPartData(this._partScratch,this._partCount)}_getCameraTransform(){if(this._cameraFrameId===this._scene.getFrameId())return this._cameraId===this._scene.activeCamera?.uniqueId?this._cameraVpMatrix:null;return this._scene.activeCamera?.getTransformationMatrix()??null}_getProjectionClipRange(l){let f=this._scene.getEngine(),m=l.m,S=f.useReverseDepthBuffer?1:f.isNDCHalfZRange?0:-1,b=f.useReverseDepthBuffer?f.isNDCHalfZRange?0:-1:1,w=this._scene.useRightHandedSystem?-1:1,y=w*(m[14]-S*m[15])/(S*m[11]-m[10]),D=b*m[11]-m[10],P=D===0?1/0:w*(m[14]-b*m[15])/D;if(!Number.isFinite(y)||!(P>y)||!(P>0))return null;return this._projectionClipRange[0]=y,this._projectionClipRange[1]=P===1/0?0:P,this._projectionClipRange}_viewZSpan(l,f,m,S=!0){let b=1/0,w=-1/0,y=this._partScratch;for(let T=0;T<this._partCount;T++){let E=T*40,L=T*3,A=this._partLocalMin[L];if(!isFinite(A))continue;let O=this._partLocalMin[L+1],k=this._partLocalMin[L+2],W=this._partLocalMax[L],q=this._partLocalMax[L+1],F=this._partLocalMax[L+2];for(let z=0;z<8;z++){let G=z&1?W:A,V=z&2?q:O,I=z&4?F:k,U=y[E+0]*G+y[E+4]*V+y[E+8]*I+y[E+12],X=y[E+1]*G+y[E+5]*V+y[E+9]*I+y[E+13],j=y[E+2]*G+y[E+6]*V+y[E+10]*I+y[E+14],te=l[2]*U+l[6]*X+l[10]*j+l[14],se=this._scene.useRightHandedSystem?-te:te;if(se<b)b=se;if(se>w)w=se}}let D=S?f:-1/0,P=S&&m>0?m:1/0;if(b=Math.max(D,b),w=Math.min(P,w),!isFinite(b)||w<b)this._depthSpan[0]=f,this._depthSpan[1]=m>f?m:f+1;else if(w===b){let T=Math.max(Math.abs(b)*0.001,0.0001);this._depthSpan[0]=Math.max(D,b-T),this._depthSpan[1]=w+T}else this._depthSpan[0]=b,this._depthSpan[1]=w;return this._depthSpan}_coprimeStride(l){if(l<=2)return 1;let f=Math.max(1,Math.round(l*0.6180339887)),m=f,S=l;while(S!==0){let b=m%S;m=S,S=b}while(m!==1){f++,m=f,S=l;while(S!==0){let b=m%S;m=S,S=b}}return f}_budget(){if(!this._scene.getEngine().hostInformation?.isMobile)return 15000000;if(typeof navigator<"u"&&navigator.userAgent&&/iPad|iPhone|iPod/.test(navigator.userAgent))return 9000000;return 6000000}_updateAutoScale(l,f,m){if(this._budgetReadPending||!this._renderer)return;this._budgetReadPending=!0,this._convergeAutoScaleAsync(l,f,m,this._autoRequestId)}async _convergeAutoScaleAsync(l,f,m,S){let b=this._renderer;if(!b)return;try{let w=await b.readPointCountAsync();if(b!==this._renderer||!this._computeActive||S!==this._autoRequestId||this._renderScale!=="auto")return;if(w>0){let y=w*l*l,D=Math.max(1,Math.min(8,Math.ceil(Math.sqrt(y/this._budget())))),P=!m||b.accumulationVersion!==f,T=D!==this._autoN;if(this._autoN=D,T)b.resetAccumulation();if(P)return;this._autoMeasuredGeneration=b.accumulationVersion}}catch(w){if(b===this._renderer&&this._computeActive)c.Error(`GaussianSplattingMesh: point-splatting budget readback failed: ${String(w)}`)}finally{if(b===this._renderer)this._budgetReadPending=!1}}_getOutputSize(l=!1){let f=this._scene.getEngine(),m=this._scene.activeCamera,S=this._scene.postProcessesEnabled?m?._getFirstPostProcess():null,b=m?.outputRenderTarget,w,y,D=this._depthMode&&!l?this._getCurrentDepthRenderer()?.getDepthMap():null;if(D)w=D.getRenderWidth(),y=D.getRenderHeight();else if(S&&S.width>0&&S.height>0)w=S.width,y=S.height;else if(b)w=b.getRenderWidth(),y=b.getRenderHeight();else w=f.getRenderWidth(!0),y=f.getRenderHeight(!0);return this._outputSize.width=Math.max(1,w),this._outputSize.height=Math.max(1,y),this._outputSize}_syncRenderInputs(){if(this._syncData(),this._splatCount===0)return;let l=this._mesh.material,f=l?.kernelSize||ht.KernelSize,m=l?l.minPixelSize:ht.MinPixelSize,S=l?.compensation??ht.Compensation,b=this._renderer;if(b.kernelSize!==f||b.minPixelSize!==m||b.compensation!==S)b.kernelSize=f,b.minPixelSize=m,b.compensation=S,b.resetAccumulation();this._uploadParts()}_runCompute(){if(this._resultReady=!1,this._progressReady=!1,(this._colorMode||this._depthMode)&&this._mesh._pointStreamingUnsupported&&!this._streamingWarned)this._streamingWarned=!0,c.Warn("GaussianSplattingMesh: point splatting does not support streamed parts (their splats are GPU-decoded and never reach the retained CPU splat data); falling back to the classic renderer.");if((this._colorMode||this._depthMode)&&this._hasUnsupportedSource&&!this._sourceWarned)this._sourceWarned=!0,c.Warn("GaussianSplattingMesh: point splatting requires retained CPU splat data; GPU-only SOG textures and streams use the classic renderer.");if(!this._computeActive||!this._mesh.isEnabled()||!this._renderer||!Ve||this._hasUnsupportedView())return;if(!this._isWorkloadSupported())return;if(this._syncRenderInputs(),this._splatCount===0)return;let l=this._scene.activeCamera,f=this._scene.getEngine(),{width:m,height:S}=this._getOutputSize(),b=this._renderScale,w=b==="auto"?this._autoN:Math.max(1,Math.min(8,Math.round(1/Math.max(b,0.001)))),y=Math.max(1,Math.ceil(m/w)),D=Math.max(1,Math.ceil(S/w)),P=w*w,T=this._renderer.renderedFrameCount%P*this._coprimeStride(P)%P,E=T%w,L=Math.floor(T/w),A=this._scene.getViewMatrix(),O=this._scene.getProjectionMatrix(),k=O.determinant();if(!Number.isFinite(k)||k===0){if(!this._invalidProjectionWarned)this._invalidProjectionWarned=!0,c.Error("GaussianSplattingMesh: the camera projection matrix is not finite and invertible; point splatting skips the mesh.");return}this._invalidProjectionWarned=!1,O.invertToRef(this._inverseProjection),this._vpMatrix.copyFrom(this._scene.getTransformMatrix());let W=m*O.m[0]/(2*w),q=S*O.m[5]/(2*w),F=l.globalPosition;this._renderer.rightHandedSystem=this._scene.useRightHandedSystem,this._renderer.isOrthographic=Math.abs(O.m[15]-1)<0.001;let z=this._mesh.material,G=qu(O),V=G?null:this._getProjectionClipRange(O),I=V?.[0]??l.minZ,U=V?.[1]??(l.ignoreCameraMaxZ?0:l.maxZ),[X,j]=this._viewZSpan(A.m,I,U,!G);if(this._renderer.setCamera(A,this._vpMatrix,I,U,W,q,F.x,F.y,F.z,X,j),this._renderer.setProjectionMatrix(O,this._inverseProjection,f.useReverseDepthBuffer),!this._renderer.renderToBuffer(y,D,m,S,w,E,L))return;this._resultReady=!0,this._progressReady=!0,this._computedWidth=m,this._computedHeight=S,this._progressFrameCount=this._renderer.renderedFrameCount,this._progressGeneration=this._renderer.accumulationVersion,this._progressCycleLength=this._renderer.pixelCycleLength;let te=this._renderer.accumulationVersion,se=te!==this._lastRenderedGeneration;if(this._lastRenderedGeneration=te,b==="auto"&&this._autoMeasuredGeneration!==te)this._updateAutoScale(w,te,!se);let Z=this._renderer.accumBuffer,Q=this._renderer.accumDepthBuffer;if(Z&&Q){if(this._colorMode&&this._blit)this._blit.setAccumBuffer(Z),this._blit.setAccumDepthBuffer(Q),this._blit.setResolution(this._renderer.outputWidth,this._renderer.outputHeight),this._blit.setInverseProjection(this._inverseProjection),this._blit.setLogarithmicDepthConstant(z?.useLogarithmicDepth?2/(Math.log(l.maxZ+1)/Math.LN2):0);if(this._depthMode&&this._depthBlit){this._depthBlit.setAccumBuffer(Z),this._depthBlit.setAccumDepthBuffer(Q),this._depthBlit.setResolution(this._renderer.outputWidth,this._renderer.outputHeight),this._depthBlit.setInverseProjection(this._inverseProjection);let ee,H;if(l.mode===1)ee=!f.useReverseDepthBuffer&&f.isNDCHalfZRange?0:1,H=f.useReverseDepthBuffer&&f.isNDCHalfZRange?0:1;else ee=f.useReverseDepthBuffer&&f.isNDCHalfZRange?l.minZ:f.isNDCHalfZRange?0:l.minZ,H=f.useReverseDepthBuffer&&f.isNDCHalfZRange?0:l.maxZ;this._depthBlit.setDepthValues(ee,ee+H),this._depthBlit.setReverseDepth(f.useReverseDepthBuffer)}}}_hasUnsupportedView(){let l=this._scene,f=l.activeCamera;if(!f||l.floatingOriginMode)return!0;let m=f.getProjectionMatrix();if(!qu(m)&&!this._getProjectionClipRange(m))return!0;let S=this._mesh.material;return(l.activeCameras?.length??0)>1||f._rigCameras.length>0||!!(S?.clipPlane||S?.clipPlane2||S?.clipPlane3||S?.clipPlane4||S?.clipPlane5||S?.clipPlane6)||!!(l.clipPlane||l.clipPlane2||l.clipPlane3||l.clipPlane4||l.clipPlane5||l.clipPlane6)}_isMainColorPass(){let l=this._scene.getEngine(),f=this._scene.activeCamera,m=f?.outputRenderTarget?.renderPassId??f?.renderPassId??0;return l.currentRenderPassId===m&&!this._mesh.getMaterialForRenderPass(l.currentRenderPassId)}_getCurrentDepthRenderer(){let l=this._scene._depthRenderer,f=this._scene.activeCamera;if(!l||!f)return null;let m=l[f.uniqueId];if(!m||!m.enabled)return null;return m.getDepthMap().renderPassIds.indexOf(this._scene.getEngine().currentRenderPassId)!==-1?m:null}_isDepthPass(){return!!this._getCurrentDepthRenderer()}dispose(){if(this._computeObserver)this._scene.onBeforeRenderObservable.remove(this._computeObserver),this._computeObserver=null;if(this._cameraObserver)this._scene.onBeforeCameraRenderObservable.remove(this._cameraObserver),this._cameraObserver=null;if(this._restoreObserver)this._scene.getEngine().onContextRestoredObservable.remove(this._restoreObserver),this._restoreObserver=null;this._releaseComputeResources(),this._releaseBlitResources(),this._colorMode=!1,this._depthMode=!1}get renderScale(){return this._renderScale}set renderScale(l){if(l===this._renderScale)return;this._renderScale=l,this._autoRequestId++,this._autoMeasuredGeneration=-1,this._renderer?.resetAccumulation()}invalidateDecodedSplats(){this._decodedSplatsData=null,this._renderer?.resetAccumulation()}_supportsSourceMaterialPlugins(){let l=this._mesh.material?.pluginManager?._plugins;if(!l)return!0;for(let f of l){let m=f.constructor;if(m===Ra&&f instanceof Ra||m===Yu&&f instanceof Yu&&!f.isEnabled||m===ju&&f instanceof ju&&!f.isEnabled||m===Qu&&f instanceof Qu&&!f.isEnabled)continue;return!1}return!0}get handlesCurrentPass(){let l=this._mesh.getMaterialForRenderPass(this._scene.getEngine().currentRenderPassId),f=this._depthMode?this._getCurrentDepthRenderer():null,m=this._scene.activeCamera?.viewport,S=!!m&&m.x===0&&m.y===0&&m.width===1&&m.height===1,b=!!f&&(S||f.getDepthMap().ignoreCameraViewport)&&!this._scene.forceWireframe&&!this._scene.forcePointsCloud;if(l&&!f?._isGaussianSplattingDepthMaterial(l))return!1;let w=this._scene.fogEnabled&&this._scene.fogMode!==C.FOGMODE_NONE&&this._mesh.applyFog&&!!this._mesh.material?.fogEnabled,y=this._colorMode&&S&&this._mesh.material?.alphaMode===2&&this._mesh.material.needAlphaBlendingForMesh(this._mesh)&&!this._mesh.material.needAlphaTestingForMesh(this._mesh)&&this._mesh._getRenderingFillMode(this._mesh.material.fillMode)===B.TriangleFillMode&&this._mesh.material.constructor===ht&&this._supportsSourceMaterialPlugins()&&!w;if(b&&f&&y){let P=f.getDepthMap(),T=this._getOutputSize(!0);b=P.getRenderWidth()===T.width&&P.getRenderHeight()===T.height&&this._depthInputsMatchColorHistory()}return(y&&this._isMainColorPass()||b)&&this._computeActive&&!this._hasUnsupportedView()&&(!this._renderer||this._isWorkloadSupported())}drawColorPass(l){if(!this.handlesCurrentPass){if(!this._computeActive)this._runCompute();return!1}let f=this._colorMode&&this._isMainColorPass(),m=this._depthMode&&this._isDepthPass(),{width:S,height:b}=this._getOutputSize();if(this._resultReady&&this._renderer){if(this._syncRenderInputs(),this._renderer.accumulationVersion!==this._progressGeneration)this._resultReady=!1}if(!this._resultReady||!this._vpMatrix.equalsWithEpsilon(this._scene.getTransformMatrix(),0.00001)||this._computedWidth!==S||this._computedHeight!==b)this._runCompute();if(!this._resultReady)return!0;if(f)this._colorHistoryReady=!0,this._colorUsesCameraTransform=this._getCameraTransform()?.equalsWithEpsilon(this._vpMatrix,0.00001)??!1;if(f&&this._blitMesh&&this._blitMesh.subMeshes.length>0&&this._blit?.isReady(this._blitMesh,!1,this._blitMesh.subMeshes[0])){let w=this._blitMesh,y=this._mesh.material;if(y){this._blit.disableColorWrite=y.disableColorWrite,this._blit.disableDepthWrite=y.disableDepthWrite,this._blit.forceDepthWrite=y.forceDepthWrite,this._blit.depthFunction=y.depthFunction,this._blit.zOffset=y.zOffset,this._blit.zOffsetUnits=y.zOffsetUnits;let D=y.stencil,P=this._blit.stencil;P.enabled=D.enabled,P.mask=D.mask,P.func=D.func,P.funcRef=D.funcRef,P.funcMask=D.funcMask,P.opStencilFail=D.opStencilFail,P.opDepthFail=D.opDepthFail,P.opStencilDepthPass=D.opStencilDepthPass,P.backFunc=D.backFunc,P.backOpStencilFail=D.backOpStencilFail,P.backOpDepthFail=D.backOpDepthFail,P.backOpStencilDepthPass=D.backOpStencilDepthPass}return w.render(w.subMeshes[0],l,w),!0}if(m&&this._depthBlitMesh){let w=this._depthBlitMesh;if(w.subMeshes.length>0&&this._depthBlit?.isReady(w,!1,w.subMeshes[0]))return this._scene.getEngine().setAlphaMode(0),w.render(w.subMeshes[0],!1,w),!0}return!0}}var bt=!1;function Mt(){if(bt)return;bt=!0,Mm((l)=>new yt(l))}eh();Mt();Om();Yh();function yb(l){let f=[],m=[],{lines:S,colors:b}=l,w=[],y=0;for(let P=0;P<S.length;P++){let T=S[P];for(let E=0;E<T.length;E++){let{x:L,y:A,z:O}=T[E];if(m.push(L,A,O),b){let k=b[P],{r:W,g:q,b:F,a:z}=k[E];w.push(W,q,F,z)}if(E>0)f.push(y-1),f.push(y);y++}}let D=new M;if(D.indices=f,D.positions=m,b)D.colors=w;return D}function Tb(l){let f=l.dashSize||3,m=l.gapSize||1,S=l.dashNb||200,b=l.points,w=[],y=[],D=e.Zero(),P=0,T,E,L=0,A;for(A=0;A<b.length-1;A++)b[A+1].subtractToRef(b[A],D),P+=D.length();let O=P/S,k=f*O/(f+m);for(A=0;A<b.length-1;A++){b[A+1].subtractToRef(b[A],D),T=Math.floor(D.length()/O),D.normalize();for(let q=0;q<T;q++)E=O*q,w.push(b[A].x+E*D.x,b[A].y+E*D.y,b[A].z+E*D.z),w.push(b[A].x+(E+k)*D.x,b[A].y+(E+k)*D.y,b[A].z+(E+k)*D.z),y.push(L,L+1),L+=2}let W=new M;return W.positions=w,W.indices=y,W}function _n(l,f,m=null){let{instance:S,lines:b,colors:w}=f;if(S){let T=S.getVerticesData(n.PositionKind),E,L;if(w)E=S.getVerticesData(n.ColorKind);let A=0,O=0;for(let k=0;k<b.length;k++){let W=b[k];for(let q=0;q<W.length;q++){if(T[A]=W[q].x,T[A+1]=W[q].y,T[A+2]=W[q].z,w&&E)L=w[k],E[O]=L[q].r,E[O+1]=L[q].g,E[O+2]=L[q].b,E[O+3]=L[q].a,O+=4;A+=3}}if(S.updateVerticesData(n.PositionKind,T,!1,!1),w&&E)S.updateVerticesData(n.ColorKind,E,!1,!1);return S.refreshBoundingInfo(),S}let D=new vs(l,m,null,void 0,void 0,w?!0:!1,f.useVertexAlpha,f.material);return yb(f).applyToMesh(D,f.updatable),D}function Kr(l,f,m=null){let S=f.colors?[f.colors]:null;return _n(l,{lines:[f.points],updatable:f.updatable,instance:f.instance,colors:S,useVertexAlpha:f.useVertexAlpha,material:f.material},m)}function $u(l,f,m=null){let{points:S,instance:b}=f,w=f.gapSize||1,y=f.dashSize||3;if(b){let T=(E)=>{let L=e.Zero(),A=E.length/6,O=0,k,W,q=0,F,z;for(F=0;F<S.length-1;F++)S[F+1].subtractToRef(S[F],L),O+=L.length();let G=O/A,V=b._creationDataStorage.dashSize,I=b._creationDataStorage.gapSize,U=V*G/(V+I);for(F=0;F<S.length-1;F++){S[F+1].subtractToRef(S[F],L),k=Math.floor(L.length()/G),L.normalize(),z=0;while(z<k&&q<E.length)W=G*z,E[q]=S[F].x+W*L.x,E[q+1]=S[F].y+W*L.y,E[q+2]=S[F].z+W*L.z,E[q+3]=S[F].x+(W+U)*L.x,E[q+4]=S[F].y+(W+U)*L.y,E[q+5]=S[F].z+(W+U)*L.z,q+=6,z++}while(q<E.length)E[q]=S[F].x,E[q+1]=S[F].y,E[q+2]=S[F].z,q+=3};if(f.dashNb||f.dashSize||f.gapSize||f.useVertexAlpha||f.material)c.Warn("You have used an option other than points with the instance option. Please be aware that these other options will be ignored.");return b.updateMeshPositions(T,!1),b}let D=new vs(l,m,null,void 0,void 0,void 0,f.useVertexAlpha,f.material);return Tb(f).applyToMesh(D,f.updatable),D._creationDataStorage=new Xc,D._creationDataStorage.dashSize=y,D._creationDataStorage.gapSize=w,D}var JM={CreateDashedLines:$u,CreateLineSystem:_n,CreateLines:Kr},Ct=!1;function Cb(){if(Ct)return;Ct=!0,M.CreateLineSystem=yb,M.CreateDashedLines=Tb,p.CreateLines=(l,f,m=null,S=!1,b=null)=>Kr(l,{points:f,updatable:S,instance:b},m),p.CreateDashedLines=(l,f,m,S,b,w=null,y,D)=>$u(l,{points:f,dashSize:m,gapSize:S,dashNb:b,updatable:y,instance:D},w)}Cb();var wt=0.28209479177387814;async function be(l,f,m){return await new Promise((b,w)=>{let y=m.createCanvasImage();if(!y)throw Error("Failed to create ImageBitmap");y.onload=()=>{try{let P=m.createCanvas(y.width,y.height);if(!P)throw Error("Failed to create canvas");let T=P.getContext("2d");if(!T)throw Error("Failed to get 2D context");T.drawImage(y,0,0);let E=T.getImageData(0,0,P.width,P.height);b({bits:new Uint8Array(E.data.buffer),width:E.width,height:E.height})}catch(P){w(`Error loading image ${y.src} with exception: ${P}`)}},y.onerror=(P)=>{w(`Error loading image ${y.src} with exception: ${P}`)},y.crossOrigin="anonymous";let D;if(typeof l==="string"){if(!f)throw Error("filename is required when using a URL");y.src=l+f}else{let P=new Blob([l],{type:"image/webp"});D=URL.createObjectURL(P),y.src=D}})}async function fs(l,f,m){let S=l.count?l.count:l.means.shape[0],b=32,w=new ArrayBuffer(32*S),y=new Float32Array(w),D=new Float32Array(w),P=new Uint8ClampedArray(w),T=new Uint8ClampedArray(w),E=(F)=>Math.sign(F)*(Math.exp(Math.abs(F))-1),L=f[0].bits,A=f[1].bits;if(!Array.isArray(l.means.mins)||!Array.isArray(l.means.maxs))throw Error("Missing arrays in SOG data.");for(let F=0;F<S;F++){let z=F*4;for(let G=0;G<3;G++){let V=l.means.mins[G],I=l.means.maxs[G],U=A[z+G],X=L[z+G],j=U<<8|X,te=br.Lerp(V,I,j/65535);y[F*8+G]=E(te)}}let O=f[2].bits;if(l.version===2){if(!l.scales.codebook)throw Error("Missing codebook in SOG version 2 scales data.");for(let F=0;F<S;F++){let z=F*4;for(let G=0;G<3;G++){let V=l.scales.codebook[O[z+G]],I=Math.exp(V);D[F*8+3+G]=I}}}else{if(!Array.isArray(l.scales.mins)||!Array.isArray(l.scales.maxs))throw Error("Missing arrays in SOG scales data.");for(let F=0;F<S;F++){let z=F*4;for(let G=0;G<3;G++){let V=O[z+G],I=br.Lerp(l.scales.mins[G],l.scales.maxs[G],V/255),U=Math.exp(I);D[F*8+3+G]=U}}}let k=f[4].bits;if(l.version===2){if(!l.sh0.codebook)throw Error("Missing codebook in SOG version 2 sh0 data.");for(let F=0;F<S;F++){let z=F*4;for(let G=0;G<3;G++){let V=0.5+l.sh0.codebook[k[z+G]]*wt;P[F*32+24+G]=Math.max(0,Math.min(255,Math.round(255*V)))}P[F*32+24+3]=k[z+3]}}else{if(!Array.isArray(l.sh0.mins)||!Array.isArray(l.sh0.maxs))throw Error("Missing arrays in SOG sh0 data.");for(let F=0;F<S;F++){let z=F*4;for(let G=0;G<4;G++){let V=l.sh0.mins[G],I=l.sh0.maxs[G],U=k[z+G],X=br.Lerp(V,I,U/255),j;if(G<3)j=0.5+X*wt;else j=1/(1+Math.exp(-X));P[F*32+24+G]=Math.max(0,Math.min(255,Math.round(255*j)))}}}let W=(F)=>(F/255-0.5)*2/Math.SQRT2,q=f[3].bits;for(let F=0;F<S;F++){let z=q[F*4+0],G=q[F*4+1],V=q[F*4+2],I=q[F*4+3],U=W(z),X=W(G),j=W(V),te=I-252,se=U*U+X*X+j*j,Z=Math.sqrt(Math.max(0,1-se)),Q;switch(te){case 0:Q=[Z,U,X,j];break;case 1:Q=[U,Z,X,j];break;case 2:Q=[U,X,Z,j];break;case 3:Q=[U,X,j,Z];break;default:throw Error("Invalid quaternion mode")}T[F*32+28+0]=Q[0]*127.5+127.5,T[F*32+28+1]=Q[1]*127.5+127.5,T[F*32+28+2]=Q[2]*127.5+127.5,T[F*32+28+3]=Q[3]*127.5+127.5}if(l.shN){let F=l.shN.bands?(l.shN.bands+1)**2-1:l.shN.shape[1]/3,z=l.shN.bands!==void 0&&l.shN.bands!==null?l.shN.bands:Math.round(Math.sqrt(F+1)-1),G=f[5].bits,V=f[6].bits,I=f[5].width,U=F*3,X=Math.ceil(U/16),te=m.getEngine().getCaps().maxTextureSize,se=Math.ceil(S/te),Z=En(X,se*te*4*4);if(l.version===2){if(!l.shN.codebook)throw Error("Missing codebook in SOG version 2 shN data.");for(let Q=0;Q<S;Q++){let ee=V[Q*4+0]+(V[Q*4+1]<<8),H=ee%64*F,J=Math.floor(ee/64);for(let re=0;re<F;re++)for(let ne=0;ne<3;ne++){let ae=re*3+ne,oe=Math.floor(ae/16),ce=Z[oe],le=ae%16,fe=Q*16,ge=l.shN.codebook[G[(H+re)*4+ne+J*I*4]]*127.5+127.5;ce[le+fe]=Math.max(0,Math.min(255,ge))}}}else for(let Q=0;Q<S;Q++){let ee=V[Q*4+0]+(V[Q*4+1]<<8),H=ee%64*F,J=Math.floor(ee/64),re=l.shN.mins,ne=l.shN.maxs;for(let ae=0;ae<3;ae++)for(let oe=0;oe<F/3;oe++){let ce=oe*3+ae,le=Math.floor(ce/16),fe=Z[le],ge=ce%16,Qt=Q*16,Kt=br.Lerp(re,ne,G[(H+oe)*4+ae+J*I*4]/255)*127.5+127.5;fe[ge+Qt]=Math.max(0,Math.min(255,Kt))}}return await new Promise((Q)=>{Q({mode:0,data:w,hasVertexColors:!1,sh:Z,shDegree:z})})}return await new Promise((F)=>{F({mode:0,data:w,hasVertexColors:!1})})}async function Dt(l,f,m){let S,b;if(l instanceof Map){b=l;let D=b.get("meta.json");if(!D)throw Error("meta.json not found in files Map");S=JSON.parse(new TextDecoder().decode(D))}else S=l;let w=[...S.means.files,...S.scales.files,...S.quats.files,...S.sh0.files];if(S.shN)w.push(...S.shN.files);let y=await Promise.all(w.map(async(D)=>{if(b&&b.has(D)){let P=b.get(D);return await be(P,D,m.getEngine())}else return await be(f,D,m.getEngine())}));return await fs(S,y,m)}function ps(l,f,m,S){let b=new he(f,m,S,_.TEXTUREFORMAT_RGBA,l,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_UNSIGNED_BYTE,_.TEXTURE_CREATIONFLAG_SAMPLED_DATA_ONLY);return b.wrapU=_.TEXTURE_CLAMP_ADDRESSMODE,b.wrapV=_.TEXTURE_CLAMP_ADDRESSMODE,b}function Xe(l,f){return ps(l,f.bits,f.width,f.height)}async function He(l,f,m){let S=m.getEngine();if(typeof createImageBitmap==="function")try{let w=f.toLowerCase().endsWith(".png")?"image/png":"image/webp",y;if(typeof l==="string"){let P=await v.LoadFileAsync(l+f,!0);y=new Blob([P],{type:w})}else y=new Blob([l],{type:w});let D=await createImageBitmap(y,{premultiplyAlpha:"none",colorSpaceConversion:"none"});try{let P=new he(null,D.width,D.height,_.TEXTUREFORMAT_RGBA,m,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_UNSIGNED_BYTE);P.wrapU=_.TEXTURE_CLAMP_ADDRESSMODE,P.wrapV=_.TEXTURE_CLAMP_ADDRESSMODE;let T=P.getInternalTexture();if(T)S.updateDynamicTexture(T,D,!1,!1);return P}finally{D.close()}}catch{}let b=await be(l,f,S);return Xe(m,b)}function _s(l,f,m,S){let b=(y)=>Math.sign(y)*(Math.exp(Math.abs(y))-1);if(!Array.isArray(l.means.mins)||!Array.isArray(l.means.maxs))throw Error("Missing arrays in SOG data.");let w=new Float32Array(S*4);for(let y=0;y<S;y++){let D=y*4;for(let P=0;P<3;P++){let T=m[D+P]<<8|f[D+P],E=br.Lerp(l.means.mins[P],l.means.maxs[P],T/65535);w[y*4+P]=b(E)}w[y*4+3]=1}return w}async function ve(l,f,m,S=!0,b,w){let y,D;if(l instanceof Map){D=l;let H=D.get("meta.json");if(!H)throw Error("meta.json not found in files Map");y=JSON.parse(new TextDecoder().decode(H))}else y=l;let P=async(H)=>{if(D&&D.has(H))return await be(D.get(H),H,m.getEngine());if(b){let J=new Uint8Array(await b.loadFileAsync(f+H,w));return await be(J,H,m.getEngine())}return await be(f,H,m.getEngine())},T=async(H)=>{if(D&&D.has(H))return await He(D.get(H),H,m);if(b){let J=new Uint8Array(await b.loadFileAsync(f+H,w));return await He(J,H,m)}return await He(f,H,m)},E=[...y.scales.files,...y.quats.files,...y.sh0.files,...y.shN?.files??[]],L,A,O,k,W=null,q;if(S){let[H,J]=await Promise.all([Promise.all(y.means.files.map(P)),Promise.all(E.map(T))]);W=[H[0],H[1]],q=J,L=Xe(m,H[0]),A=Xe(m,H[1]),O=H[0].width,k=H[0].height}else{let[H,J]=await Promise.all([Promise.all(y.means.files.map(T)),Promise.all(E.map(T))]);q=J,L=H[0],A=H[1];let re=L.getSize();O=re.width,k=re.height}let F=y.count??y.means.shape[0],z=O*k;if(z<F)throw Error(`SOG texture contains ${z} texels, but metadata references ${F} splats.`);let G=q[0],V=q[1],I=q[2],U,X,j=0,te=0;if(y.shN&&q.length>=5)U=q[3],X=q[4],j=y.shN.bands?(y.shN.bands+1)**2-1:y.shN.shape[1]/3,te=y.shN.bands??Math.round(Math.sqrt(j+1)-1);let se;if(y.version===2){let J=new Float32Array(768);if(y.scales.codebook)J.set(y.scales.codebook.slice(0,256),0);if(y.sh0.codebook)J.set(y.sh0.codebook.slice(0,256),256);if(y.shN?.codebook)J.set(y.shN.codebook.slice(0,256),512);se=new he(J,768,1,_.TEXTUREFORMAT_R,m,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_FLOAT,_.TEXTURE_CREATIONFLAG_SAMPLED_DATA_ONLY),se.wrapU=_.TEXTURE_CLAMP_ADDRESSMODE,se.wrapV=_.TEXTURE_CLAMP_ADDRESSMODE}let Z=y.means.mins,Q=y.means.maxs,ee={version:y.version===2?2:1,splatCount:F,shDegree:te,meansTextureL:L,meansTextureU:A,scalesTexture:G,quatsTexture:V,sh0Texture:I,shCentroidsTexture:U,shLabelsTexture:X,codebookTexture:se,meansMin:[Z[0],Z[1],Z[2]],meansMax:[Q[0],Q[1],Q[2]],scalesMin:Array.isArray(y.scales.mins)?[y.scales.mins[0],y.scales.mins[1],y.scales.mins[2]]:void 0,scalesMax:Array.isArray(y.scales.maxs)?[y.scales.maxs[0],y.scales.maxs[1],y.scales.maxs[2]]:void 0,sh0Min:Array.isArray(y.sh0.mins)?[y.sh0.mins[0],y.sh0.mins[1],y.sh0.mins[2],y.sh0.mins[3]]:void 0,sh0Max:Array.isArray(y.sh0.maxs)?[y.sh0.maxs[0],y.sh0.maxs[1],y.sh0.maxs[2],y.sh0.maxs[3]]:void 0,shnMin:typeof y.shN?.mins==="number"?y.shN.mins:void 0,shnMax:typeof y.shN?.maxs==="number"?y.shN.maxs:void 0,shCoeffCount:j,positions:W?_s(y,W[0].bits,W[1].bits,F):new Float32Array(0)};return{mode:0,data:new ArrayBuffer(0),hasVertexColors:!1,shDegree:te,sogTextures:ee}}Bp();var _e=`precision highp float;
attribute vec3 position;
void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Pt=`precision highp float;
precision highp int;

uniform sampler2D sogMeansLTex;
uniform sampler2D sogMeansUTex;
uniform sampler2D sogScalesTex;
uniform sampler2D sogQuatsTex;
uniform sampler2D sogSh0Tex;
uniform sampler2D sogCodebookTex;

uniform vec3 sogMeansMin;
uniform vec3 sogMeansMax;
uniform vec3 sogScalesMin;
uniform vec3 sogScalesMax;
uniform vec4 sogSh0Min;
uniform vec4 sogSh0Max;
uniform int uVersion;
uniform int uOffset;
uniform int uSourceOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;

layout(location = 0) out vec4 glFragData[4];

mat3 transposeM(mat3 m) {
    return mat3(m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]);
}

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int k = global - uOffset + uSourceOffset;
    ivec2 src = ivec2(k - (k / uSrcWidth) * uSrcWidth, k / uSrcWidth);

    vec3 mL = texelFetch(sogMeansLTex, src, 0).xyz;
    vec3 mU = texelFetch(sogMeansUTex, src, 0).xyz;
    vec3 sRaw = texelFetch(sogScalesTex, src, 0).xyz;
    vec4 qRaw = texelFetch(sogQuatsTex, src, 0);
    vec4 c0 = texelFetch(sogSh0Tex, src, 0);

    // Position: q16 = (u<<8)|l normalized; n = lerp(min,max,q16); pos = sign(n)*(exp(|n|)-1)
    vec3 q16 = (mU * 256.0 + mL) * (255.0 / 65535.0);
    vec3 nPos = mix(sogMeansMin, sogMeansMax, q16);
    vec3 center = sign(nPos) * (exp(abs(nPos)) - vec3(1.0));

    // Scale (v1: lerp+exp ; v2: codebook lookup)
    vec3 splatScale;
    if (uVersion == 2) {
        vec3 sIdx = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.x), 0), 0).r);
        splatScale.y = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.y), 0), 0).r);
        splatScale.z = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(sogScalesMin, sogScalesMax, sRaw));
    }

    // Quaternion (largest-omitted, mode in alpha as 252 + omitted-index)
    const float invSqrt2 = 0.70710678118;
    vec3 qabc = (qRaw.xyz - vec3(0.5)) * 2.0 * invSqrt2;
    int qMode = int(qRaw.w * 255.0 + 0.5) - 252;
    float qd = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    vec4 quat;
    if (qMode == 0) {
        quat = vec4(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4(qabc.x, qabc.y, qabc.z, qd);
    }

    float qw = quat.x, qx = quat.y, qy = quat.z, qz = quat.w;
    mat3 R = mat3(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );
    mat3 S2 = mat3(
        4.0 * splatScale.x * splatScale.x, 0.0, 0.0,
        0.0, 4.0 * splatScale.y * splatScale.y, 0.0,
        0.0, 0.0, 4.0 * splatScale.z * splatScale.z
    );
    mat3 Sigma = R * S2 * transposeM(R);

    // Color (sh0)
    const float SH_C0 = 0.28209479177387814;
    vec3 colRgb;
    float colA;
    if (uVersion == 2) {
        vec3 c3;
        c3.x = texelFetch(sogCodebookTex, ivec2(256 + int(c0.x * 255.0 + 0.5), 0), 0).r;
        c3.y = texelFetch(sogCodebookTex, ivec2(256 + int(c0.y * 255.0 + 0.5), 0), 0).r;
        c3.z = texelFetch(sogCodebookTex, ivec2(256 + int(c0.z * 255.0 + 0.5), 0), 0).r;
        colRgb = vec3(0.5) + c3 * SH_C0;
        colA = c0.w;
    } else {
        vec4 cLerp = mix(sogSh0Min, sogSh0Max, c0);
        colRgb = vec3(0.5) + cLerp.xyz * SH_C0;
        colA = 1.0 / (1.0 + exp(-cLerp.w));
    }

    glFragData[0] = vec4(center, 1.0);
    glFragData[1] = vec4(Sigma[0][0], Sigma[0][1], Sigma[0][2], Sigma[1][1]);
    glFragData[2] = vec4(Sigma[1][2], Sigma[2][2], 0.0, 0.0);
    glFragData[3] = vec4(colRgb, colA);
}
`,me=`
attribute position : vec3<f32>;
@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    vertexOutputs.position = vec4<f32>(input.position.xy, 0.0, 1.0);
}
`,Rt=`
var sogMeansLTexSampler : sampler;
var sogMeansLTex : texture_2d<f32>;
var sogMeansUTexSampler : sampler;
var sogMeansUTex : texture_2d<f32>;
var sogScalesTexSampler : sampler;
var sogScalesTex : texture_2d<f32>;
var sogQuatsTexSampler : sampler;
var sogQuatsTex : texture_2d<f32>;
var sogSh0TexSampler : sampler;
var sogSh0Tex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogMeansMin : vec3<f32>;
uniform sogMeansMax : vec3<f32>;
uniform sogScalesMin : vec3<f32>;
uniform sogScalesMax : vec3<f32>;
uniform sogSh0Min : vec4<f32>;
uniform sogSh0Max : vec4<f32>;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uSourceOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let k : i32 = global - uniforms.uOffset + uniforms.uSourceOffset;
    let src : vec2<i32> = vec2<i32>(k - (k / uniforms.uSrcWidth) * uniforms.uSrcWidth, k / uniforms.uSrcWidth);

    let mL : vec3<f32> = textureLoad(sogMeansLTex, src, 0).xyz;
    let mU : vec3<f32> = textureLoad(sogMeansUTex, src, 0).xyz;
    let sRaw : vec3<f32> = textureLoad(sogScalesTex, src, 0).xyz;
    let qRaw : vec4<f32> = textureLoad(sogQuatsTex, src, 0);
    let c0 : vec4<f32> = textureLoad(sogSh0Tex, src, 0);

    let q16 : vec3<f32> = (mU * 256.0 + mL) * (255.0 / 65535.0);
    let nPos : vec3<f32> = mix(uniforms.sogMeansMin, uniforms.sogMeansMax, q16);
    let center : vec3<f32> = sign(nPos) * (exp(abs(nPos)) - vec3<f32>(1.0));

    var splatScale : vec3<f32>;
    if (uniforms.uVersion == 2) {
        let sIdx : vec3<f32> = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.x), 0), 0).r);
        splatScale.y = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.y), 0), 0).r);
        splatScale.z = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(uniforms.sogScalesMin, uniforms.sogScalesMax, sRaw));
    }

    let invSqrt2 : f32 = 0.70710678118;
    let qabc : vec3<f32> = (qRaw.xyz - vec3<f32>(0.5)) * 2.0 * invSqrt2;
    let qMode : i32 = i32(qRaw.w * 255.0 + 0.5) - 252;
    let qd : f32 = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    var quat : vec4<f32>;
    if (qMode == 0) {
        quat = vec4<f32>(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4<f32>(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4<f32>(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4<f32>(qabc.x, qabc.y, qabc.z, qd);
    }

    let qw : f32 = quat.x;
    let qx : f32 = quat.y;
    let qy : f32 = quat.z;
    let qz : f32 = quat.w;
    let R : mat3x3<f32> = mat3x3<f32>(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );
    let S2 : mat3x3<f32> = mat3x3<f32>(
        4.0 * splatScale.x * splatScale.x, 0.0, 0.0,
        0.0, 4.0 * splatScale.y * splatScale.y, 0.0,
        0.0, 0.0, 4.0 * splatScale.z * splatScale.z
    );
    let Sigma : mat3x3<f32> = R * S2 * transpose(R);

    let SH_C0 : f32 = 0.28209479177387814;
    var colRgb : vec3<f32>;
    var colA : f32;
    if (uniforms.uVersion == 2) {
        var c3 : vec3<f32>;
        c3.x = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.x * 255.0 + 0.5), 0), 0).r;
        c3.y = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.y * 255.0 + 0.5), 0), 0).r;
        c3.z = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.z * 255.0 + 0.5), 0), 0).r;
        colRgb = vec3<f32>(0.5) + c3 * SH_C0;
        colA = c0.w;
    } else {
        let cLerp : vec4<f32> = mix(uniforms.sogSh0Min, uniforms.sogSh0Max, c0);
        colRgb = vec3<f32>(0.5) + cLerp.xyz * SH_C0;
        colA = 1.0 / (1.0 + exp(-cLerp.w));
    }

    fragmentOutputs.fragData0 = vec4<f32>(center, 1.0);
    fragmentOutputs.fragData1 = vec4<f32>(Sigma[0][0], Sigma[0][1], Sigma[0][2], Sigma[1][1]);
    fragmentOutputs.fragData2 = vec4<f32>(Sigma[1][2], Sigma[2][2], 0.0, 0.0);
    fragmentOutputs.fragData3 = vec4<f32>(colRgb, colA);
}
`,Bt="gsSogRotDecodeToWorkBuffer",Tt=`precision highp float;
precision highp int;

uniform sampler2D sogScalesTex;
uniform sampler2D sogQuatsTex;
uniform sampler2D sogCodebookTex;

uniform vec3 sogScalesMin;
uniform vec3 sogScalesMax;
uniform int uVersion;
uniform int uOffset;
uniform int uSourceOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;

layout(location = 0) out vec4 glFragData[3];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int k = global - uOffset + uSourceOffset;
    ivec2 src = ivec2(k - (k / uSrcWidth) * uSrcWidth, k / uSrcWidth);

    vec3 sRaw = texelFetch(sogScalesTex, src, 0).xyz;
    vec4 qRaw = texelFetch(sogQuatsTex, src, 0);

    vec3 splatScale;
    if (uVersion == 2) {
        vec3 sIdx = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.x), 0), 0).r);
        splatScale.y = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.y), 0), 0).r);
        splatScale.z = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(sogScalesMin, sogScalesMax, sRaw));
    }

    const float invSqrt2 = 0.70710678118;
    vec3 qabc = (qRaw.xyz - vec3(0.5)) * 2.0 * invSqrt2;
    int qMode = int(qRaw.w * 255.0 + 0.5) - 252;
    float qd = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    vec4 quat;
    if (qMode == 0) {
        quat = vec4(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4(qabc.x, qabc.y, qabc.z, qd);
    }

    float qw = quat.x, qx = quat.y, qy = quat.z, qz = quat.w;
    mat3 R = mat3(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );

    glFragData[0] = vec4(R[0], R[1].x);
    glFragData[1] = vec4(R[1].y, R[1].z, R[2].x, R[2].y);
    glFragData[2] = vec4(R[2].z, 2.0 * splatScale.x, 2.0 * splatScale.y, 2.0 * splatScale.z);
}
`,Et=`
var sogScalesTexSampler : sampler;
var sogScalesTex : texture_2d<f32>;
var sogQuatsTexSampler : sampler;
var sogQuatsTex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogScalesMin : vec3<f32>;
uniform sogScalesMax : vec3<f32>;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uSourceOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let k : i32 = global - uniforms.uOffset + uniforms.uSourceOffset;
    let src : vec2<i32> = vec2<i32>(k - (k / uniforms.uSrcWidth) * uniforms.uSrcWidth, k / uniforms.uSrcWidth);

    let sRaw : vec3<f32> = textureLoad(sogScalesTex, src, 0).xyz;
    let qRaw : vec4<f32> = textureLoad(sogQuatsTex, src, 0);

    var splatScale : vec3<f32>;
    if (uniforms.uVersion == 2) {
        let sIdx : vec3<f32> = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.x), 0), 0).r);
        splatScale.y = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.y), 0), 0).r);
        splatScale.z = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(uniforms.sogScalesMin, uniforms.sogScalesMax, sRaw));
    }

    let invSqrt2 : f32 = 0.70710678118;
    let qabc : vec3<f32> = (qRaw.xyz - vec3<f32>(0.5)) * 2.0 * invSqrt2;
    let qMode : i32 = i32(qRaw.w * 255.0 + 0.5) - 252;
    let qd : f32 = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    var quat : vec4<f32>;
    if (qMode == 0) {
        quat = vec4<f32>(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4<f32>(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4<f32>(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4<f32>(qabc.x, qabc.y, qabc.z, qd);
    }

    let qw : f32 = quat.x;
    let qx : f32 = quat.y;
    let qy : f32 = quat.z;
    let qz : f32 = quat.w;
    let R : mat3x3<f32> = mat3x3<f32>(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );

    fragmentOutputs.fragData0 = vec4<f32>(R[0], R[1].x);
    fragmentOutputs.fragData1 = vec4<f32>(R[1].y, R[1].z, R[2].x, R[2].y);
    fragmentOutputs.fragData2 = vec4<f32>(R[2].z, 2.0 * splatScale.x, 2.0 * splatScale.y, 2.0 * splatScale.z);
}
`,At="gsSogShDecodeToWorkBuffer",Ot=`precision highp float;
precision highp int;

uniform sampler2D sogShLabelsTex;
uniform sampler2D sogShCentroidsTex;
uniform sampler2D sogCodebookTex;
uniform float sogShnMin;
uniform float sogShnMax;
uniform int uVersion;
uniform int uOffset;
uniform int uSourceOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;
uniform int uCoeffs;
uniform int uShTextureIndex;

layout(location = 0) out uvec4 outSh;

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int kLocal = global - uOffset + uSourceOffset;

    // 16-bit label for this source splat (LSB in r, MSB in g), indexed over the labels texture's own width.
    ivec2 lsz = textureSize(sogShLabelsTex, 0);
    ivec2 lsrc = ivec2(kLocal - (kLocal / lsz.x) * lsz.x, kLocal / lsz.x);
    vec4 labelRaw = texelFetch(sogShLabelsTex, lsrc, 0);
    int n = int(labelRaw.r * 255.0 + 0.5) + int(labelRaw.g * 255.0 + 0.5) * 256;
    int u = (n - (n / 64) * 64) * uCoeffs;
    int v = n / 64;

    uint packed0 = 0u;
    uint packed1 = 0u;
    uint packed2 = 0u;
    uint packed3 = 0u;

    for (int b = 0; b < 16; b++) {
        int s = uShTextureIndex * 16 + b; // flat SH scalar index
        int kc = s / 3;                    // higher-order coefficient (0-based)
        int j = s - kc * 3;                // channel (0=r,1=g,2=b)
        float byteVal = 128.0;             // neutral (decompose(128) ~= 0)
        if (kc < uCoeffs) {
            vec4 centroidRaw = texelFetch(sogShCentroidsTex, ivec2(u + kc, v), 0);
            float ch = (j == 0) ? centroidRaw.r : ((j == 1) ? centroidRaw.g : centroidRaw.b);
            float coeff;
            if (uVersion == 2) {
                int cidx = int(ch * 255.0 + 0.5);
                coeff = texelFetch(sogCodebookTex, ivec2(512 + cidx, 0), 0).r;
            } else {
                coeff = mix(sogShnMin, sogShnMax, ch);
            }
            byteVal = clamp(coeff * 127.5 + 127.5, 0.0, 255.0);
        }
        uint bv = uint(byteVal + 0.5);
        int comp = b / 4;
        uint contrib = bv << uint((b - comp * 4) * 8);
        if (comp == 0) { packed0 |= contrib; }
        else if (comp == 1) { packed1 |= contrib; }
        else if (comp == 2) { packed2 |= contrib; }
        else { packed3 |= contrib; }
    }
    outSh = uvec4(packed0, packed1, packed2, packed3);
}
`,Lt=`
var sogShLabelsTexSampler : sampler;
var sogShLabelsTex : texture_2d<f32>;
var sogShCentroidsTexSampler : sampler;
var sogShCentroidsTex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogShnMin : f32;
uniform sogShnMax : f32;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uSourceOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;
uniform uCoeffs : i32;
uniform uShTextureIndex : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let kLocal : i32 = global - uniforms.uOffset + uniforms.uSourceOffset;

    let lsz : vec2<i32> = vec2<i32>(textureDimensions(sogShLabelsTex, 0));
    let lsrc : vec2<i32> = vec2<i32>(kLocal - (kLocal / lsz.x) * lsz.x, kLocal / lsz.x);
    let labelRaw : vec4<f32> = textureLoad(sogShLabelsTex, lsrc, 0);
    let n : i32 = i32(labelRaw.r * 255.0 + 0.5) + i32(labelRaw.g * 255.0 + 0.5) * 256;
    let u : i32 = (n - (n / 64) * 64) * uniforms.uCoeffs;
    let v : i32 = n / 64;

    var packed : array<u32, 4> = array<u32, 4>(0u, 0u, 0u, 0u);

    for (var b : i32 = 0; b < 16; b = b + 1) {
        let s : i32 = uniforms.uShTextureIndex * 16 + b;
        let kc : i32 = s / 3;
        let j : i32 = s - kc * 3;
        var byteVal : f32 = 128.0;
        if (kc < uniforms.uCoeffs) {
            let centroidRaw : vec4<f32> = textureLoad(sogShCentroidsTex, vec2<i32>(u + kc, v), 0);
            var ch : f32 = centroidRaw.b;
            if (j == 0) { ch = centroidRaw.r; } else if (j == 1) { ch = centroidRaw.g; }
            var coeff : f32;
            if (uniforms.uVersion == 2) {
                let cidx : i32 = i32(ch * 255.0 + 0.5);
                coeff = textureLoad(sogCodebookTex, vec2<i32>(512 + cidx, 0), 0).r;
            } else {
                coeff = mix(uniforms.sogShnMin, uniforms.sogShnMax, ch);
            }
            byteVal = clamp(coeff * 127.5 + 127.5, 0.0, 255.0);
        }
        let bv : u32 = u32(byteVal + 0.5);
        let comp : i32 = b / 4;
        packed[comp] = packed[comp] | (bv << u32((b - comp * 4) * 8));
    }
    fragmentOutputs.fragData0 = vec4<u32>(packed[0], packed[1], packed[2], packed[3]);
}
`,Gt="gsWorkBufferRelayout",kt=`precision highp float;
precision highp int;

uniform sampler2D uMapTex;
uniform sampler2D uSrc0;
uniform sampler2D uSrc1;
uniform sampler2D uSrc2;
uniform sampler2D uSrc3;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
// Region-scoped relayout (hosted compound atlas), both default 0 (standalone square path unchanged):
//   uSrcBaseOffset — added to the map's (region-local) source index so pass 1 reads the correct GLOBAL atlas texel.
//   uDstBaseRow    — subtracted from the atlas destination row so pass 2's identity copy reads the region-local temp.
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out vec4 glFragData[4];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    glFragData[0] = texelFetch(uSrc0, s, 0);
    glFragData[1] = texelFetch(uSrc1, s, 0);
    glFragData[2] = texelFetch(uSrc2, s, 0);
    glFragData[3] = texelFetch(uSrc3, s, 0);
}
`,zt="gsWorkBufferShCopy",It=`precision highp float;
precision highp int;
precision highp usampler2D;

uniform sampler2D uMapTex;
uniform usampler2D uSrcSh;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out uvec4 outSh;

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    outSh = texelFetch(uSrcSh, s, 0);
}
`,qt=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
// Integer source sampled via textureLoad only — NO paired sampler (a sampler on a Uint texture fails WebGPU
// validation: "None of the supported sample types (Uint)"). Mirrors the draw shader's shTexture0 declaration.
var uSrcSh : texture_2d<u32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    // Wrap in an explicit vec4<u32> so the WGSL processor emits an integer fragData location (its detection keys
    // off a literal vec4<u32>/vec4u in the assignment; a bare textureLoad(...) would default to vec4<f32>).
    fragmentOutputs.fragData0 = vec4<u32>(textureLoad(uSrcSh, s, 0));
}
`,Wt="gsWorkBufferRotCopy",Nt=`precision highp float;
precision highp int;

uniform sampler2D uMapTex;
uniform sampler2D uSrc0;
uniform sampler2D uSrc1;
uniform sampler2D uSrc2;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out vec4 glFragData[3];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    glFragData[0] = texelFetch(uSrc0, s, 0);
    glFragData[1] = texelFetch(uSrc1, s, 0);
    glFragData[2] = texelFetch(uSrc2, s, 0);
}
`,Ut=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
var uSrc0Sampler : sampler;
var uSrc0 : texture_2d<f32>;
var uSrc1Sampler : sampler;
var uSrc1 : texture_2d<f32>;
var uSrc2Sampler : sampler;
var uSrc2 : texture_2d<f32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    fragmentOutputs.fragData0 = textureLoad(uSrc0, s, 0);
    fragmentOutputs.fragData1 = textureLoad(uSrc1, s, 0);
    fragmentOutputs.fragData2 = textureLoad(uSrc2, s, 0);
}
`,jt=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
var uSrc0Sampler : sampler;
var uSrc0 : texture_2d<f32>;
var uSrc1Sampler : sampler;
var uSrc1 : texture_2d<f32>;
var uSrc2Sampler : sampler;
var uSrc2 : texture_2d<f32>;
var uSrc3Sampler : sampler;
var uSrc3 : texture_2d<f32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
// Region-scoped relayout (hosted compound atlas), both default 0 (standalone square path unchanged).
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    fragmentOutputs.fragData0 = textureLoad(uSrc0, s, 0);
    fragmentOutputs.fragData1 = textureLoad(uSrc1, s, 0);
    fragmentOutputs.fragData2 = textureLoad(uSrc2, s, 0);
    fragmentOutputs.fragData3 = textureLoad(uSrc3, s, 0);
}
`;class Ce{get supportsAsyncCentersReadback(){let l=this._scene.getEngine();if(l.isWebGPU)return!0;let f=l;return!!f._gl&&typeof f._readPixelsAsync==="function"&&(f.webGLVersion??0)>=2}get textureSize(){return this._textureSize}get textures(){return this._mrt.textures}get shTextures(){return this._shMrts.map((l)=>l.textures[0])}get rotationTextures(){return this._rotMrt?this._rotMrt.textures:[]}constructor(l,f,m,S,b){if(this._copyMaterial=null,this._relayoutMapData=null,this._relayoutMapTexture=null,this._backupMrt=null,this._disposed=!1,this._readFbo=null,this._shMrts=[],this._ownsShMrts=!1,this._shMaterial=null,this._shCopyMaterial=null,this._backupShMrts=null,this._rotMrt=null,this._ownsRotMrt=!1,this._rotMaterial=null,this._rotCopyMaterial=null,this._backupRotMrt=null,this._scene=l,this._shaderLanguage=l.getEngine().isWebGPU?1:0,this._capacity=Math.max(1,f),m)this._mrt=m.mrt,this._textureSize=m.width,this._baseOffset=m.baseOffset,this._ownsMrt=!1;else this._textureSize=Math.max(1,Math.ceil(Math.sqrt(Math.max(1,f)))),this._baseOffset=0,this._ownsMrt=!0,this._mrt=this._createMrt("gsWorkBuffer",!0);if(S&&S.textureCount>0){if(S.externalMrts)this._shMrts=S.externalMrts.slice(0,S.textureCount),this._ownsShMrts=!1;else{for(let w=0;w<S.textureCount;w++)this._shMrts.push(this._createShMrt(`gsWorkBufferSh${w}`,!0));this._ownsShMrts=!0}this._shMaterial=this._createShMaterial()}if(b){if(b.externalMrt)this._rotMrt=b.externalMrt,this._ownsRotMrt=!1;else this._rotMrt=this._createRotMrt("gsWorkBufferRot",!0),this._ownsRotMrt=!0;this._rotMaterial=this._createRotMaterial()}if(this._material=this._createMaterial(),this._quad=this._createQuad(),this._quad.material=this._material,!this._ownsMrt)this.isRelayoutReady()}rebindAtlas(l){if(!this._ownsMrt)this._mrt=l}rebindShAtlas(l){if(!this._ownsShMrts&&l&&this._shMrts.length)this._shMrts=l.slice(0,this._shMrts.length)}rebindRotAtlas(l){if(!this._ownsRotMrt&&l&&this._rotMrt)this._rotMrt=l}setBaseOffset(l){if(!this._ownsMrt)this._baseOffset=l}get canBackup(){return this._disposed||this._ownsMrt?!1:this.isRelayoutReady()}backupRegion(){if(this._disposed||this._ownsMrt)return;if(!this.isRelayoutReady()){c.Warn("GaussianSplattingWorkBuffer: backup skipped because the copy shaders are not ready; streamed region data may be lost on the atlas rebuild.");return}let l=this._textureSize,f=Math.max(1,Math.floor(this._capacity/l)),m=Math.floor(this._baseOffset/l);if(!this._backupMrt)this._backupMrt=this._createMrt("gsAtlasBackup",!1,l,f);if(this._renderRelayoutPass(this._backupMrt,this._mrt.textures,this._mrt.textures[0],0,l,l,0,-m),this._shMrts.length&&this._shCopyMaterial){if(!this._backupShMrts)this._backupShMrts=this._shMrts.map((S,b)=>this._createShMrt(`gsShAtlasBackup${b}`,!1,l,f));for(let S=0;S<this._shMrts.length;S++)this._renderShCopyPass(this._backupShMrts[S],this._shMrts[S].textures[0],this._mrt.textures[0],0,l,l,0,-m)}if(this._rotMrt&&this._rotCopyMaterial){if(!this._backupRotMrt)this._backupRotMrt=this._createRotMrt("gsRotAtlasBackup",!1,l,f);this._renderRotCopyPass(this._backupRotMrt,this._rotMrt.textures,this._mrt.textures[0],0,l,l,0,-m)}this._quad.material=this._material}restoreRegion(){if(this._disposed||this._ownsMrt||!this._backupMrt||!this._copyMaterial)return;let l=this._textureSize,f=Math.max(1,Math.floor(this._capacity/l)),m=Math.floor(this._baseOffset/l),S=this._scene.getEngine();S.enableScissor(0,m,l,f);try{if(this._renderRelayoutPass(this._mrt,this._backupMrt.textures,this._backupMrt.textures[0],0,l,l,0,m),this._backupShMrts&&this._shMrts.length&&this._shCopyMaterial)for(let b=0;b<this._shMrts.length&&b<this._backupShMrts.length;b++)this._renderShCopyPass(this._shMrts[b],this._backupShMrts[b].textures[0],this._mrt.textures[0],0,l,l,0,m);if(this._backupRotMrt&&this._rotMrt&&this._rotCopyMaterial)this._renderRotCopyPass(this._rotMrt,this._backupRotMrt.textures,this._mrt.textures[0],0,l,l,0,m)}finally{S.disableScissor(),this._quad.material=this._material}if(this._backupMrt.dispose(),this._backupMrt=null,this._backupShMrts){for(let b of this._backupShMrts)b.dispose();this._backupShMrts=null}this._backupRotMrt?.dispose(),this._backupRotMrt=null}_createMrt(l,f,m=this._textureSize,S=this._textureSize){let b=this._scene.getEngine()._caps.textureHalfFloatRender?_.TEXTURETYPE_HALF_FLOAT:_.TEXTURETYPE_FLOAT,w=new Cr(l,{width:m,height:S},4,this._scene,{types:[_.TEXTURETYPE_FLOAT,b,b,_.TEXTURETYPE_UNSIGNED_BYTE],samplingModes:[_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE],formats:[_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${l}Centers`,`${l}CovA`,`${l}CovB`,`${l}Colors`]);if(w.clearColor=new x(0,0,0,0),w.renderList=[],f)w.onClearObservable.add(()=>{});return w}_createShMrt(l,f,m=this._textureSize,S=this._textureSize){let b=new Cr(l,{width:m,height:S},1,this._scene,{types:[_.TEXTURETYPE_UNSIGNED_INTEGER],formats:[_.TEXTUREFORMAT_RGBA_INTEGER],samplingModes:[_.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[l]);if(b.clearColor=new x(0,0,0,0),b.renderList=[],f)b.onClearObservable.add(()=>{});return b}_createRotMrt(l,f,m=this._textureSize,S=this._textureSize){let b=this._scene.getEngine()._caps.textureHalfFloatRender?_.TEXTURETYPE_HALF_FLOAT:_.TEXTURETYPE_FLOAT,w=new Cr(l,{width:m,height:S},3,this._scene,{types:[b,b,b],formats:[_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA],samplingModes:[_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${l}A`,`${l}B`,`${l}Scale`]);if(w.clearColor=new x(0,0,0,0),w.renderList=[],f)w.onClearObservable.add(()=>{});return w}async decodeAsync(l,f,m,S){if(this._disposed)return;let b=m??0,w=S??l.splatCount-b;if(m!==void 0||S!==void 0){if(!Number.isSafeInteger(l.splatCount)||l.splatCount<0||!Number.isSafeInteger(b)||b<0||!Number.isSafeInteger(w)||w<0||b+w>l.splatCount||!Number.isSafeInteger(f)||f<0||f+w>this._capacity)throw RangeError("GaussianSplattingWorkBuffer: invalid source or destination decode range.");if(w===0)return}this._applyPack(l,b,w);let y=this._shMaterial!==null&&this._shMrts.length>0;if(y)this._applyShPack(l,b,w);let D=this._rotMaterial!==null&&this._rotMrt!==null;if(D)this._applyRotPack(l,b,w);await new Promise((P)=>{let T=()=>{if(this._disposed){P();return}if(!this._material.isReady(this._quad)||y&&!this._shMaterial.isReady(this._quad)||D&&!this._rotMaterial.isReady(this._quad)){this._scene.onBeforeRenderObservable.addOnce(T);return}let E=this._textureSize,L=this._baseOffset+f;if(this._material.setInt("uOffset",L),y)this._shMaterial.setInt("uOffset",L);if(D)this._rotMaterial.setInt("uOffset",L);let A=Math.floor(L/E),O=Math.max(1,Math.ceil((L+w)/E)-A),k=this._scene.getEngine();k.enableScissor(0,A,E,O);try{if(this._quad.material=this._material,this._mrt.renderList=[this._quad],this._mrt.render(),y){for(let W=0;W<this._shMrts.length;W++)this._shMaterial.setInt("uShTextureIndex",W),this._quad.material=this._shMaterial,this._shMrts[W].renderList=[this._quad],this._shMrts[W].render();this._quad.material=this._material}if(D)this._quad.material=this._rotMaterial,this._rotMrt.renderList=[this._quad],this._rotMrt.render(),this._quad.material=this._material}finally{k.disableScissor()}P()};this._scene.onBeforeRenderObservable.addOnce(T)})}isRelayoutReady(){if(this._disposed)return!1;if(!this._copyMaterial)this._copyMaterial=this._createCopyMaterial();if(this._shMrts.length&&!this._shCopyMaterial)this._shCopyMaterial=this._createShCopyMaterial();if(this._rotMrt&&!this._rotCopyMaterial)this._rotCopyMaterial=this._createRotCopyMaterial();this._bindCopyMaterialsToAtlas();let l=this._shMrts.length===0||this._shCopyMaterial!==null&&this._shCopyMaterial.isReady(this._quad),f=!this._rotMrt||this._rotCopyMaterial!==null&&this._rotCopyMaterial.isReady(this._quad);return this._copyMaterial.isReady(this._quad)&&l&&f}_bindCopyMaterialsToAtlas(){let l=this._mrt.textures;if(this._copyMaterial)this._copyMaterial.setTexture("uMapTex",l[0]),this._copyMaterial.setTexture("uSrc0",l[0]),this._copyMaterial.setTexture("uSrc1",l[1]),this._copyMaterial.setTexture("uSrc2",l[2]),this._copyMaterial.setTexture("uSrc3",l[3]);if(this._shCopyMaterial&&this._shMrts.length)this._shCopyMaterial.setTexture("uMapTex",l[0]),this._shCopyMaterial.setTexture("uSrcSh",this._shMrts[0].textures[0]);if(this._rotCopyMaterial&&this._rotMrt){let f=this._rotMrt.textures;this._rotCopyMaterial.setTexture("uMapTex",l[0]),this._rotCopyMaterial.setTexture("uSrc0",f[0]),this._rotCopyMaterial.setTexture("uSrc1",f[1]),this._rotCopyMaterial.setTexture("uSrc2",f[2])}}relayoutSync(l){if(this._disposed||!this._copyMaterial)return;let f=this._textureSize,m=f,S=this._ownsMrt?f:Math.max(1,Math.floor(this._capacity/f));if(!this._relayoutMapData)this._relayoutMapData=new Float32Array(m*S);let b=this._relayoutMapData;if(b.fill(-1),b.set(l.subarray(0,Math.min(l.length,b.length))),!this._relayoutMapTexture)this._relayoutMapTexture=new he(b,m,S,_.TEXTUREFORMAT_R,this._scene,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_FLOAT,_.TEXTURE_CREATIONFLAG_SAMPLED_DATA_ONLY);else this._relayoutMapTexture.update(b);let w=this._relayoutMapTexture;if(this._ownsMrt){let A=this._createMrt("gsRelayoutTemp",!1);try{this._renderRelayoutPass(A,this._mrt.textures,w,1),this._renderRelayoutPass(this._mrt,A.textures,w,0)}finally{A.dispose()}if(this._shMrts.length&&this._shCopyMaterial)for(let O=0;O<this._shMrts.length;O++){let k=this._createShMrt("gsShRelayoutTemp",!1);try{this._renderShCopyPass(k,this._shMrts[O].textures[0],w,1),this._renderShCopyPass(this._shMrts[O],k.textures[0],w,0)}finally{k.dispose()}}if(this._rotMrt&&this._rotCopyMaterial){let O=this._createRotMrt("gsRotRelayoutTemp",!1);try{this._renderRotCopyPass(O,this._rotMrt.textures,w,1),this._renderRotCopyPass(this._rotMrt,O.textures,w,0)}finally{O.dispose()}}this._quad.material=this._material;return}let y=Math.floor(this._baseOffset/f),D=S,P=this._scene.getEngine(),T=this._createMrt("gsRelayoutTemp",!1,f,D),E=this._shMrts.length&&this._shCopyMaterial?this._shMrts.map((A,O)=>this._createShMrt(`gsShRelayoutTemp${O}`,!1,f,D)):[],L=this._rotMrt&&this._rotCopyMaterial?this._createRotMrt("gsRotRelayoutTemp",!1,f,D):null;try{this._renderRelayoutPass(T,this._mrt.textures,w,1,f,f,this._baseOffset,0);for(let A=0;A<E.length;A++)this._renderShCopyPass(E[A],this._shMrts[A].textures[0],w,1,f,f,this._baseOffset,0);if(L)this._renderRotCopyPass(L,this._rotMrt.textures,w,1,f,f,this._baseOffset,0);P.enableScissor(0,y,f,D);try{this._renderRelayoutPass(this._mrt,T.textures,w,0,f,f,0,y);for(let A=0;A<E.length;A++)this._renderShCopyPass(this._shMrts[A],E[A].textures[0],w,0,f,f,0,y);if(L)this._renderRotCopyPass(this._rotMrt,L.textures,w,0,f,f,0,y)}finally{P.disableScissor()}}finally{T.dispose();for(let A of E)A.dispose();L?.dispose(),this._quad.material=this._material}}_renderRelayoutPass(l,f,m,S,b=this._textureSize,w=this._textureSize,y=0,D=0){let P=this._copyMaterial;P.setTexture("uMapTex",m),P.setTexture("uSrc0",f[0]),P.setTexture("uSrc1",f[1]),P.setTexture("uSrc2",f[2]),P.setTexture("uSrc3",f[3]),P.setInt("uDstWidth",b),P.setInt("uSrcWidth",w),P.setInt("uUseMap",S),P.setInt("uSrcBaseOffset",y),P.setInt("uDstBaseRow",D),this._quad.material=P,l.renderList=[this._quad],l.render()}_createCopyMaterial(){let l=this._shaderLanguage===1,f=new de(Gt,this._scene,{vertexSource:l?me:_e,fragmentSource:l?jt:kt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2","uSrc3"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}_renderShCopyPass(l,f,m,S,b=this._textureSize,w=this._textureSize,y=0,D=0){let P=this._shCopyMaterial;P.setTexture("uMapTex",m),P.setTexture("uSrcSh",f),P.setInt("uDstWidth",b),P.setInt("uSrcWidth",w),P.setInt("uUseMap",S),P.setInt("uSrcBaseOffset",y),P.setInt("uDstBaseRow",D),this._quad.material=P,l.renderList=[this._quad],l.render()}_createShCopyMaterial(){let l=this._shaderLanguage===1,f=new de(zt,this._scene,{vertexSource:l?me:_e,fragmentSource:l?qt:It},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrcSh"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}_renderRotCopyPass(l,f,m,S,b=this._textureSize,w=this._textureSize,y=0,D=0){let P=this._rotCopyMaterial;P.setTexture("uMapTex",m),P.setTexture("uSrc0",f[0]),P.setTexture("uSrc1",f[1]),P.setTexture("uSrc2",f[2]),P.setInt("uDstWidth",b),P.setInt("uSrcWidth",w),P.setInt("uUseMap",S),P.setInt("uSrcBaseOffset",y),P.setInt("uDstBaseRow",D),this._quad.material=P,l.renderList=[this._quad],l.render()}_createRotCopyMaterial(){let l=this._shaderLanguage===1,f=new de(Wt,this._scene,{vertexSource:l?me:_e,fragmentSource:l?Ut:Nt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}async readCentersRangeAsync(l,f){if(this._disposed||f<=0||!this.supportsAsyncCentersReadback)return null;let m=this._textureSize,S=this._baseOffset+l,b=Math.floor(S/m),y=Math.ceil((S+f)/m)-b,D=(S-b*m)*4,P=D+f*4,T=this._mrt.textures[0],E=this._scene.getEngine();if(E.isWebGPU){let F=await T.readPixels(0,0,null,!0,!0,0,b,m,y);if(this._disposed||!F)return null;let z=F instanceof Float32Array?F:new Float32Array(F.buffer,F.byteOffset,F.byteLength/4);return z.length>=P?z.subarray(D,P):null}let L=E,A=L._gl,O=T.getInternalTexture()?._hardwareTexture?.underlyingResource;if(!O)return null;let k=new Float32Array(m*y*4);if(!this._readFbo)this._readFbo=A.createFramebuffer();let W=L._currentFramebuffer;A.bindFramebuffer(A.FRAMEBUFFER,this._readFbo),A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,O,0),A.readBuffer(A.COLOR_ATTACHMENT0);let q=L._readPixelsAsync(0,b,m,y,A.RGBA,A.FLOAT,k);if(A.bindFramebuffer(A.FRAMEBUFFER,W),!W)A.readBuffer(A.BACK);if(!q)return null;if(await q,this._disposed||k.length<P)return null;return k.subarray(D,P)}dispose(){if(this._disposed=!0,this._readFbo)this._scene.getEngine()._gl?.deleteFramebuffer(this._readFbo),this._readFbo=null;if(this._quad.dispose(),this._material.dispose(!0,!1),this._shMaterial?.dispose(!0,!1),this._rotMaterial?.dispose(!0,!1),this._copyMaterial?.dispose(!0,!1),this._shCopyMaterial?.dispose(!0,!1),this._rotCopyMaterial?.dispose(!0,!1),this._relayoutMapTexture?.dispose(),this._backupMrt?.dispose(),this._backupMrt=null,this._backupShMrts){for(let l of this._backupShMrts)l.dispose();this._backupShMrts=null}if(this._backupRotMrt?.dispose(),this._backupRotMrt=null,this._ownsMrt)this._mrt.dispose();if(this._ownsShMrts)for(let l of this._shMrts)l.dispose();if(this._shMrts=[],this._ownsRotMrt)this._rotMrt?.dispose();this._rotMrt=null}_createQuad(){let l=new p("gsWorkBufferQuad",this._scene),f=new M;return f.positions=[-1,-1,0,3,-1,0,-1,3,0],f.indices=[0,1,2],f.applyToMesh(l),this._scene.removeMesh(l),l}_createMaterial(){let l=this._shaderLanguage===1,f=new de("gsSogDecode",this._scene,{vertexSource:l?me:_e,fragmentSource:l?Rt:Pt},{attributes:["position"],uniforms:["sogMeansMin","sogMeansMax","sogScalesMin","sogScalesMax","sogSh0Min","sogSh0Max","uVersion","uOffset","uSourceOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogMeansLTex","sogMeansUTex","sogScalesTex","sogQuatsTex","sogSh0Tex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}_applyPack(l,f,m){let S=this._material,b=l.meansTextureL.getSize().width;S.setTexture("sogMeansLTex",l.meansTextureL),S.setTexture("sogMeansUTex",l.meansTextureU),S.setTexture("sogScalesTex",l.scalesTexture),S.setTexture("sogQuatsTex",l.quatsTexture),S.setTexture("sogSh0Tex",l.sh0Texture),S.setTexture("sogCodebookTex",l.codebookTexture??l.sh0Texture),S.setVector3("sogMeansMin",new e(l.meansMin[0],l.meansMin[1],l.meansMin[2])),S.setVector3("sogMeansMax",new e(l.meansMax[0],l.meansMax[1],l.meansMax[2]));let w=l.scalesMin??[0,0,0],y=l.scalesMax??[0,0,0];S.setVector3("sogScalesMin",new e(w[0],w[1],w[2])),S.setVector3("sogScalesMax",new e(y[0],y[1],y[2]));let D=l.sh0Min??[0,0,0,0],P=l.sh0Max??[0,0,0,0];S.setVector4("sogSh0Min",new R(D[0],D[1],D[2],D[3])),S.setVector4("sogSh0Max",new R(P[0],P[1],P[2],P[3])),S.setInt("uVersion",l.version),S.setInt("uSourceOffset",f),S.setInt("uCount",m),S.setInt("uDestWidth",this._textureSize),S.setInt("uSrcWidth",b)}_createShMaterial(){let l=this._shaderLanguage===1,f=new de(At,this._scene,{vertexSource:l?me:_e,fragmentSource:l?Lt:Ot},{attributes:["position"],uniforms:["sogShnMin","sogShnMax","uVersion","uOffset","uSourceOffset","uCount","uDestWidth","uSrcWidth","uCoeffs","uShTextureIndex"],samplers:["sogShLabelsTex","sogShCentroidsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}_applyShPack(l,f,m){let S=this._shMaterial,b=!!l.shLabelsTexture&&!!l.shCentroidsTexture,w=l.shLabelsTexture??l.sh0Texture,y=l.shCentroidsTexture??l.sh0Texture;S.setTexture("sogShLabelsTex",w),S.setTexture("sogShCentroidsTex",y),S.setTexture("sogCodebookTex",l.codebookTexture??w),S.setFloat("sogShnMin",l.shnMin??0),S.setFloat("sogShnMax",l.shnMax??0),S.setInt("uVersion",l.version),S.setInt("uSourceOffset",f),S.setInt("uCount",m),S.setInt("uDestWidth",this._textureSize),S.setInt("uSrcWidth",w.getSize().width),S.setInt("uCoeffs",b?l.shCoeffCount:0)}_createRotMaterial(){let l=this._shaderLanguage===1,f=new de(Bt,this._scene,{vertexSource:l?me:_e,fragmentSource:l?Et:Tt},{attributes:["position"],uniforms:["sogScalesMin","sogScalesMax","uVersion","uOffset","uSourceOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogScalesTex","sogQuatsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}_applyRotPack(l,f,m){let S=this._rotMaterial,b=l.scalesTexture.getSize().width;S.setTexture("sogScalesTex",l.scalesTexture),S.setTexture("sogQuatsTex",l.quatsTexture),S.setTexture("sogCodebookTex",l.codebookTexture??l.scalesTexture);let w=l.scalesMin??[0,0,0],y=l.scalesMax??[0,0,0];S.setVector3("sogScalesMin",new e(w[0],w[1],w[2])),S.setVector3("sogScalesMax",new e(y[0],y[1],y[2])),S.setInt("uVersion",l.version),S.setInt("uSourceOffset",f),S.setInt("uCount",m),S.setInt("uDestWidth",this._textureSize),S.setInt("uSrcWidth",b)}}class Ye{constructor(l){this._activeCount=0,this._queue=[],this._pending=new Map,this._groups=new Map,this._disposed=!1,this.maxConcurrent=Math.max(1,l?.maxConcurrent??2),this.maxRetries=Math.max(0,l?.maxRetries??2)}get isIdle(){return this._pending.size===0}async loadFileAsync(l,f){if(this._disposed)throw Error("GaussianSplattingDownloadManager has been disposed.");let m=this._pending.get(l),S=!m;if(!m)m={url:l,consumers:new Set,settled:!1,cancelled:!1,started:!1,slotReleased:!1},this._pending.set(l,m),this._queue.push(m);let b={task:m,groupId:f};if(b.promise=new Promise((w,y)=>{b.resolve=w,b.reject=y}),m.consumers.add(b),f!==void 0){let w=this._groups.get(f);if(!w)w=new Set,this._groups.set(f,w);w.add(b)}if(S)this._pump();return await b.promise}cancel(l){let f=this._pending.get(l);if(!f)return;this._abort(f,Error(`GaussianSplattingDownloadManager: download cancelled (${l}).`))}cancelGroup(l){let f=this._groups.get(l);if(!f)return;for(let m of Array.from(f))this._cancelConsumer(m,Error(`GaussianSplattingDownloadManager: download cancelled (${m.task.url}).`))}dispose(){if(this._disposed)return;this._disposed=!0,this._queue.length=0;for(let l of Array.from(this._pending.values()))this._abort(l,Error("GaussianSplattingDownloadManager has been disposed."))}_abort(l,f){if(l.settled)return;l.cancelled=!0;let m=this._queue.indexOf(l);if(m!==-1)this._queue.splice(m,1);if(l.request?.abort(),l.cancelAttempt?.(f),this._settle(l,(S)=>S.reject(f)),l.started)this._releaseSlot(l)}_cancelConsumer(l,f){let m=l.task;if(!m.consumers.has(l))return;if(this._removeConsumer(l),l.reject(f),m.consumers.size===0)this._abort(m,f)}_removeConsumer(l){if(l.task.consumers.delete(l),l.groupId!==void 0){let f=this._groups.get(l.groupId);if(f?.delete(l),f?.size===0)this._groups.delete(l.groupId)}}_settle(l,f){if(l.settled)return;if(l.settled=!0,this._pending.get(l.url)===l)this._pending.delete(l.url);for(let m of l.consumers)this._removeConsumer(m),f(m)}_releaseSlot(l){if(l.slotReleased)return;l.slotReleased=!0,this._activeCount--,this._pump()}_pump(){while(!this._disposed&&this._activeCount<this.maxConcurrent&&this._queue.length>0){let l=this._queue.shift();if(l.settled)continue;l.started=!0,this._activeCount++,this._runTaskAsync(l).finally(()=>{this._releaseSlot(l)})}}async _runTaskAsync(l){let f;for(let m=0;m<=this.maxRetries;m++){if(this._disposed||l.cancelled)return;try{let S=await this._downloadAttemptAsync(l);this._settle(l,(b)=>b.resolve(S));return}catch(S){if(l.cancelAttempt=void 0,this._disposed||l.cancelled)return;f=S}}this._settle(l,(m)=>m.reject(f))}async _downloadAttemptAsync(l){return await new Promise((f,m)=>{l.cancelAttempt=m,l.request=v.LoadFile(l.url,(S)=>f(S),void 0,void 0,!0,(S,b)=>m(b instanceof Error?b:Error(`GaussianSplattingDownloadManager: failed to load ${l.url}.`)))})}}class Vt{constructor(){this._offset=0,this._size=0,this._free=!0,this._prev=null,this._next=null,this._prevFree=null,this._nextFree=null,this._bucket=-1}get offset(){return this._offset}get size(){return this._size}}class $e{constructor(l=0,f=1.1){if(this._headAll=null,this._tailAll=null,this._freeBucketHeads=[],this._pool=[],this._capacity=0,this._usedSize=0,this._freeSize=0,this._freeRegionCount=0,this._growMultiplier=f,l>0){this._capacity=l,this._freeSize=l;let m=this._obtain(0,l,!0);this._headAll=m,this._tailAll=m,this._addToBucket(m)}}get capacity(){return this._capacity}get usedSize(){return this._usedSize}get freeSize(){return this._freeSize}get fragmentation(){return this._freeSize>0?1-1/this._freeRegionCount:0}allocate(l){if(l<=0)return null;let f=this._findFreeBlock(l);if(!f)return null;if(this._usedSize+=l,this._freeSize-=l,f._size===l)return f._free=!1,this._removeFromBucket(f),f;let m=this._obtain(f._offset,l,!1);return f._offset+=l,f._size-=l,this._rebucket(f),this._insertAfterInMainList(m,f._prev),m}free(l){if(!l||l._free)return;l._free=!0,this._usedSize-=l._size,this._freeSize+=l._size;let{_prev:f,_next:m}=l,S=f&&f._free,b=m&&m._free;if(S&&b)f._size+=l._size+m._size,this._removeFromMainList(l),this._removeFromMainList(m),this._removeFromBucket(m),this._release(l),this._release(m),this._rebucket(f);else if(S)f._size+=l._size,this._removeFromMainList(l),this._release(l),this._rebucket(f);else if(b)l._size+=m._size,this._removeFromMainList(m),this._removeFromBucket(m),this._release(m),this._addToBucket(l);else this._addToBucket(l)}grow(l){if(l<=this._capacity)return;let f=l-this._capacity;if(this._capacity=l,this._freeSize+=f,this._tailAll&&this._tailAll._free)this._tailAll._size+=f,this._rebucket(this._tailAll);else{let m=this._obtain(this._capacity-f,f,!0);this._insertAfterInMainList(m,this._tailAll),this._addToBucket(m)}}defrag(l=0,f=new Set){if(f.clear(),this._freeRegionCount===0)return f;if(l===0)this._defragFull(f);else this._defragIncremental(l,f);return f}updateAllocation(l,f){for(let m=0;m<l.length;m++)this.free(l[m]);for(let m=0;m<f.length;m++){let S=f[m],b=this.allocate(S);if(b)f[m]=b;else{let w=S;for(let P=m+1;P<f.length;P++)w+=f[P];let y=this._usedSize+w,D=Math.ceil(y*this._growMultiplier);if(D>this._capacity)this.grow(D);this.defrag(0);for(let P=m;P<f.length;P++)f[P]=this.allocate(f[P]);return!0}}return!1}_bucketFor(l){return 31-Math.clz32(l)}_addToBucket(l){let f=this._bucketFor(l._size);l._bucket=f;while(f>=this._freeBucketHeads.length)this._freeBucketHeads.push(null);if(l._prevFree=null,l._nextFree=this._freeBucketHeads[f],this._freeBucketHeads[f])this._freeBucketHeads[f]._prevFree=l;this._freeBucketHeads[f]=l,this._freeRegionCount++}_removeFromBucket(l){let f=l._bucket;if(l._prevFree)l._prevFree._nextFree=l._nextFree;else this._freeBucketHeads[f]=l._nextFree;if(l._nextFree)l._nextFree._prevFree=l._prevFree;l._prevFree=null,l._nextFree=null,l._bucket=-1,this._freeRegionCount--}_rebucket(l){if(this._bucketFor(l._size)!==l._bucket)this._removeFromBucket(l),this._addToBucket(l)}_obtain(l,f,m){let S=this._pool.length>0?this._pool.pop():new Vt;return S._offset=l,S._size=f,S._free=m,S._prev=null,S._next=null,S._prevFree=null,S._nextFree=null,S._bucket=-1,S}_release(l){l._prev=null,l._next=null,l._prevFree=null,l._nextFree=null,l._bucket=-1,this._pool.push(l)}_insertAfterInMainList(l,f){if(f===null){if(l._prev=null,l._next=this._headAll,this._headAll)this._headAll._prev=l;if(this._headAll=l,!this._tailAll)this._tailAll=l}else{if(l._prev=f,l._next=f._next,f._next)f._next._prev=l;if(f._next=l,this._tailAll===f)this._tailAll=l}}_removeFromMainList(l){if(l._prev)l._prev._next=l._next;else this._headAll=l._next;if(l._next)l._next._prev=l._prev;else this._tailAll=l._prev;l._prev=null,l._next=null}_findFreeBlock(l){let f=this._bucketFor(l),m=this._freeBucketHeads.length;if(f<m){let S=null,b=this._freeBucketHeads[f];while(b){if(b._size>=l){if(!S||b._size<S._size){if(S=b,b._size===l)break}}b=b._nextFree}if(S)return S}for(let S=f+1;S<m;S++)if(this._freeBucketHeads[S])return this._freeBucketHeads[S];return null}_defragFull(l){for(let b=0;b<this._freeBucketHeads.length;b++){let w=this._freeBucketHeads[b];while(w){let y=w._nextFree;this._removeFromMainList(w),w._prevFree=null,w._nextFree=null,w._bucket=-1,this._pool.push(w),w=y}this._freeBucketHeads[b]=null}this._freeRegionCount=0;let f=0,m=this._headAll;while(m){if(m._offset!==f)m._offset=f,l.add(m);f+=m._size,m=m._next}let S=this._capacity-f;if(S>0){let b=this._obtain(f,S,!0);this._insertAfterInMainList(b,this._tailAll),this._addToBucket(b)}}_defragIncremental(l,f){let m=Math.ceil(l/2),S=l-m;for(let w=0;w<m;w++){let y=this._tailAll;while(y&&y._free)y=y._prev;if(!y)break;let D=this._findFreeBlock(y._size);if(!D||D._offset>=y._offset)break;this._moveBlock(y,D),f.add(y)}let b=this._headAll;for(let w=0;w<S&&b;){let y=b._next;if(b._free&&y&&!y._free){let D=y,P=b;D._offset=P._offset,P._offset=D._offset+D._size;let T=P._prev,E=D._next;if(D._prev=T,D._next=P,P._prev=D,P._next=E,T)T._next=D;else this._headAll=D;if(E)E._prev=P;else this._tailAll=P;if(P._next&&P._next._free){let L=P._next;P._size+=L._size,this._removeFromMainList(L),this._removeFromBucket(L),this._release(L),this._rebucket(P)}f.add(D),w++,b=P._next}else b=y}}_moveBlock(l,f){let m=l._size,S=f._offset,b=l._prev;this._removeFromMainList(l);let w=this._obtain(l._offset,m,!0);if(this._insertAfterInMainList(w,b),this._addToBucket(w),w._next&&w._next._free){let y=w._next;w._size+=y._size,this._removeFromMainList(y),this._removeFromBucket(y),this._release(y),this._rebucket(w)}if(w._prev&&w._prev._free){let y=w._prev;y._size+=w._size,this._removeFromMainList(w),this._removeFromBucket(w),this._release(w),this._rebucket(y)}if(l._offset=S,f._size===m){let y=f._prev;this._removeFromMainList(f),this._removeFromBucket(f),this._release(f),this._insertAfterInMainList(l,y)}else f._offset+=m,f._size-=m,this._rebucket(f),this._insertAfterInMainList(l,f._prev)}}class Qe{constructor(l,f,m){this._blocks=new Map,this._cooldown=new Map,this._pinned=new Set,this._allocator=new $e(l),this._cooldownFrames=Math.max(0,f),this._onEvict=m}get capacity(){return this._allocator.capacity}get residentCount(){return this._blocks.size}get freeSize(){return this._allocator.freeSize}has(l){return this._blocks.has(l)}offset(l){return this._blocks.get(l)?.offset}allocate(l,f){let m=this._blocks.get(l);if(m)return m.offset;let S=this._allocator.allocate(f);if(!S){if(this._evictAllCooled(),S=this._allocator.allocate(f),!S)return null}return this._blocks.set(l,S),S.offset}pin(l,f){let m=this.allocate(l,f);if(m!==null)this._pinned.add(l);return m}free(l){if(this._pinned.has(l))return;let f=this._blocks.get(l);if(!f)return;this._allocator.free(f),this._blocks.delete(l),this._cooldown.delete(l)}compact(){let l=new Map;for(let[m,S]of Array.from(this._blocks))l.set(m,S.offset);this._allocator.defrag(0);let f=[];for(let[m,S]of Array.from(this._blocks)){let b=l.get(m);if(b!==S.offset)f.push({file:m,oldOffset:b,newOffset:S.offset,count:S.size})}return f}getResidentBlocks(){let l=[];for(let[f,m]of Array.from(this._blocks))l.push({file:f,offset:m.offset,count:m.size});return l}scheduleEviction(l){if(this._pinned.has(l)||!this._blocks.has(l))return;this._cooldown.set(l,this._cooldownFrames)}cancelEviction(l){this._cooldown.delete(l)}tick(){if(this._cooldown.size===0)return[];let l=[];for(let[f,m]of Array.from(this._cooldown))if(m<=1)l.push(f);else this._cooldown.set(f,m-1);for(let f of l)this._evict(f);return l}dispose(){this._blocks.clear(),this._cooldown.clear(),this._pinned.clear()}_evictAllCooled(){let l=Array.from(this._cooldown.keys());for(let f of l)this._evict(f)}_evict(l){let f=this._blocks.get(l);if(f)this._allocator.free(f),this._blocks.delete(l);this._cooldown.delete(l),this._onEvict(l)}}function Zt(l,f,m,S,b){if(!Number.isSafeInteger(S)||S<0||!Number.isSafeInteger(b)||b<S)throw RangeError("Invalid residency page ID range.");let w=new Map,y=new Set,D=[],P=new Set;for(let E of l){if(P.has(E))continue;P.add(E);let L=E.file;if(!Number.isSafeInteger(L)||L<0||L>=S){if(!y.has(L))y.add(L),D.push(L);continue}if(m.has(L))continue;let A=f.get(L);if(A===void 0)continue;if(!Number.isSafeInteger(A)||A<0||!Number.isSafeInteger(E.offset)||E.offset<0||!Number.isSafeInteger(E.count)||E.count<0||E.offset+E.count>A){if(!y.has(L))y.add(L),D.push(L);continue}if(E.count===0)continue;let O=w.get(L);if(!O)O=[],w.set(L,O);O.push(E)}let T=[];for(let[E,L]of w){if(y.has(E))continue;L.sort((O,k)=>O.offset-k.offset||O.count-k.count);let A;for(let O of L)if(A&&O.offset<A.source.offset+A.source.count)A.source={file:E,offset:A.source.offset,count:Math.max(A.source.offset+A.source.count,O.offset+O.count)-A.source.offset},A.entries.push(O);else{let k=b+T.length;if(!Number.isSafeInteger(k))throw RangeError("Residency page ID overflow.");A={id:k,source:{file:E,offset:O.offset,count:O.count},entries:[O]},T.push(A)}}return{pages:T,invalidFiles:D}}var ms=Math.tan(22.5*Math.PI/180),gs=-2,we=-1,Ss=84,De=4,xs=5,bs=32,ys=512,Ms=256,Ke=new a,Cs=new e,ws=new e,Ht=new e,Ds=new e(0,0,1),Yt=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],Xt=Yt.length*2,Pe=[new x(1,0.2,0.2,1),new x(1,0.6,0.1,1),new x(1,1,0.2,1),new x(0.3,1,0.3,1),new x(0.2,1,1,1),new x(0.4,0.5,1,1),new x(0.9,0.4,1,1),new x(1,1,1,1)];class ie extends ss{static IsLODMetadata(l){if(typeof l!=="object"||l===null)return!1;let f=l;return typeof f.lodLevels==="number"&&Array.isArray(f.filenames)&&typeof f.tree==="object"&&f.tree!==null}constructor(l,f,m,S,b={}){let w=ie._NormalizeResidentLimit(b.maxResidentSplats??0,"maxResidentSplats",!0),y=ie._NormalizeResidentLimit(b.memoryBudgetMb??0,"memoryBudgetMb",!1);if(b.rangePack&&!b.rangeResidency)throw Error("GaussianSplattingStream: rangePack requires rangeResidency.");super(l,null,S,!1);this._leafNodes=[],this._lod0SplatCount=Object.freeze({status:"pending"}),this._lodBaseDistance=5,this._lodMultiplier=3,this._lodBehindPenalty=1,this._lodRangeMin=0,this._maxDecodesPerFrame=1,this._lodCooldownFrames=10,this._lodUpdateInterval=4,this._lodUpdateDistance=0.5,this._maxDetailLod=0,this._lodPixelThreshold=1,this._hostBudgetAllocation=null,this._frustumCulling=!0,this._frustumPlanes=[new gi(0,0,0,0),new gi(0,0,0,0),new gi(0,0,0,0),new gi(0,0,0,0),new gi(0,0,0,0),new gi(0,0,0,0)],this._cullCameraViewProj=new a,this._cullViewProj=new a,this._frustumScratch=[],this._workBuffer=null,this._streamShDegree=0,this._shTextureCount=0,this._needsRotationScale=!1,this._useGpuPositionReadback=!1,this._readbackCandidate=!1,this._readbackProbed=!1,this._residency=null,this._fileCounts=new Map,this._fileMeta=new Map,this._residencyPages=new Map,this._splitPacks=new Map,this._nextPageId=0,this._rangeSourcePack=null,this._activeRangeSource=null,this._rangeSourcePackLoads=0,this._rangeSourcePackReuses=0,this._rangeSplitPackLoads=0,this._baseFileIds=new Set,this._decodedFiles=new Set,this._loadingFiles=new Set,this._decodeQueue=[],this._fileRefs=new Map,this._cancelledDecodes=new Set,this._evictionEnabled=!1,this._residentBudget=0,this._minimumResidentSplats=0,this._maxResidentSplats=0,this._memoryBudgetMb=0,this._evictionCooldownFrames=100,this._decodeGate=Promise.resolve(),this._relayoutOldOffsets=new Map,this._relayoutSrcIndex=null,this._environmentRange=null,this._environmentFiles=null,this._lodObserver=null,this._baseLayerReady=!1,this._metadataReady=!1,this._framesSinceLodUpdate=0,this._lastLodCamPositions=[],this._lastLodSignature="",this._forceLodUpdate=!1,this._boundsMin=new e(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),this._boundsMax=new e(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE),this._debugDisplay=!1,this._debugLodSource="optimal",this._debugMesh=null,this._debugObserver=null,this._debugColorData=null,this._debugSignature=0,this._disposed=!1,this._hostCompound=null,this._host=null,this._positionBase=0,this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._partReleasedByHost=!1,this._positionSnapshot=null,this._partReadyPromise=null,this._partReadyResolve=null,this._partReadyReject=null,this._partReadySettled=!1,this._metadata=b.rangeResidency?ie._CloneLodMetadata(f):f,this._nextPageId=f.filenames.length,this._rootUrl=m,this._streamOptions=b,this._hostCompound=b.hostCompound??null,this._decodeSh=b.decodeSh??!0,this._needsRotationScale=b.needsRotationScale??!1;let D=Math.max(0,f.lodLevels-1);if(this._lodRangeMax=D,b.lodBaseDistance!==void 0)this._lodBaseDistance=Math.max(0.1,b.lodBaseDistance);if(b.lodMultiplier!==void 0)this._lodMultiplier=Math.max(1.2,b.lodMultiplier);if(b.lodBehindPenalty!==void 0)this._lodBehindPenalty=Math.max(1,b.lodBehindPenalty);if(b.lodRangeMin!==void 0)this._lodRangeMin=Math.max(0,Math.min(b.lodRangeMin,D));if(b.lodRangeMax!==void 0)this._lodRangeMax=Math.max(this._lodRangeMin,Math.min(b.lodRangeMax,D));if(b.maxDecodesPerFrame!==void 0)this._maxDecodesPerFrame=Math.max(1,b.maxDecodesPerFrame);if(b.lodCooldownFrames!==void 0)this._lodCooldownFrames=Math.max(0,b.lodCooldownFrames);if(b.lodUpdateInterval!==void 0)this._lodUpdateInterval=Math.max(1,b.lodUpdateInterval);if(b.lodUpdateDistance!==void 0)this._lodUpdateDistance=Math.max(0,b.lodUpdateDistance);if(b.maxDetailLod!==void 0)this._maxDetailLod=Math.max(0,Math.floor(b.maxDetailLod));if(this._splatBudget=this._resolveSplatBudget(b.splatBudget),b.frustumCulling!==void 0)this._frustumCulling=b.frustumCulling;if(b.debugLodSource)this._debugLodSource=b.debugLodSource;if(b.evictionCooldownFrames!==void 0)this._evictionCooldownFrames=Math.max(0,Math.floor(b.evictionCooldownFrames));if(this._maxResidentSplats=w,this._memoryBudgetMb=y,this._downloadManager=new Ye({maxConcurrent:b.maxConcurrentDownloads,maxRetries:b.maxDownloadRetries}),!this._hostCompound)this.scaling.y*=-1,this.rotation.x=-Math.PI/2;else{this.setEnabled(!1),this.isPickable=!1,this.doNotSerialize=!0,this._partReadyPromise=new Promise((T,E)=>{this._partReadyResolve=T,this._partReadyReject=E}),this._partReadyPromise.catch(()=>{});let P=this._hostCompound.onDisposeObservable.add(()=>{if(!this._disposed)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubDispose=()=>this._hostCompound.onDisposeObservable.remove(P)}if(this._collectLodEntries(this._metadata.tree),b.debugDisplay)this.debugDisplay=!0;this._streamAllAsync().then(()=>{let P=this._partReadySettled;if(this._rejectPartReady("GaussianSplattingStream: stream produced no splats."),!P&&this._hostCompound&&!this._disposed)this._disposeAndReclaim()},(P)=>{if(this._lod0SplatCount=Object.freeze({status:"unavailable"}),c.Error("GaussianSplattingStream: streaming failed: "+(P?.message??P)),this._rejectPartReady("GaussianSplattingStream: streaming failed: "+(P?.message??P)),!this._disposed)this._disposeAndReclaim()})}getClassName(){return"GaussianSplattingStream"}isReady(l=!1){if(this._hostCompound)return!0;return super.isReady(l)}get streamingPartProxy(){return this._host?.proxy??null}async whenPartReadyAsync(){await(this._partReadyPromise??Promise.resolve())}_resolvePartReady(){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyResolve?.()}_rejectPartReady(l){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyReject?.(Error(l))}async whenSettledAsync(l=3){if(this._disposed)return;this._forceLodUpdate=!0;let f=Math.max(1,l),m=this._scene,S=0,b=()=>{if(this._isLoadingIdle()&&this._sinkIsDepthSortSettled)return++S>=f;return S=0,!1};if(m.getEngine().activeRenderLoops.length>0){await new Promise((D)=>{let P=null;P=m.onAfterRenderObservable.add(()=>{if(this._disposed||b()){if(P)m.onAfterRenderObservable.remove(P),P=null;D()}})});return}let w=m.getEngine(),y=globalThis.requestAnimationFrame;while(!this._disposed){if(w.beginFrame(),m.render(),w.endFrame(),b())return;await new Promise((D)=>{if(typeof y==="function")y(()=>D());else setTimeout(D,16)})}}_isLoadingIdle(){return this._baseLayerReady&&this._metadataReady&&this._decodeQueue.length===0&&this._loadingFiles.size===0&&this._downloadManager.isIdle}get maxDetailLod(){return this._maxDetailLod}set maxDetailLod(l){let f=Math.max(0,Math.floor(l));if(this._maxDetailLod===f)return;this._maxDetailLod=f,this._forceLodUpdate=!0}get splatBudget(){return this._splatBudget}set splatBudget(l){let f=l>0?Math.floor(l):0;if(f===this._splatBudget)return;this._splatBudget=f,this._forceLodUpdate=!0}get effectiveSplatBudget(){return this._effectiveSplatBudget()}get residentSplatBudget(){return this._residentBudget}get minimumResidentSplats(){return this._minimumResidentSplats}get lod0SplatCount(){return this._lod0SplatCount}getSourceRange(l){return this._residencyPages.get(l)??null}isSplitPage(l){return this._splitPacks.has(l)}cancelRangeLoads(l,f=[]){let m=new Set;for(let S of l){let b=this._residencyPages.get(S);if(!b||!this._loadingFiles.has(S))continue;if(this._cancelledDecodes.add(S),this._splitPacks.has(S))this._downloadManager.cancelGroup(S);else m.add(b.file)}if(m.size===0)return;for(let S of f)m.delete(S);for(let S of this._loadingFiles){if(this._cancelledDecodes.has(S)||this._splitPacks.has(S))continue;let b=this._residencyPages.get(S);if(b)m.delete(b.file)}for(let S of m)this._downloadManager.cancelGroup(S)}get rangeResidencyStats(){return{enabled:this._streamOptions.rangeResidency===!0,pages:this._residencyPages.size,sourcePackLoads:this._rangeSourcePackLoads,sourcePackReuses:this._rangeSourcePackReuses,splitPackLoads:this._rangeSplitPackLoads,cachedSourceSplats:this._rangeSourcePack?.pack.splatCount??0}}_resolveSplatBudget(l){if(l===void 0)return 0;if(l==="auto")return this._computeDefaultSplatBudget();return l>0?Math.floor(l):0}_computeDefaultSplatBudget(){if(!this._scene.getEngine().hostInformation?.isMobile)return 2500000;if(typeof navigator<"u"&&navigator.userAgent&&/iPad|iPhone|iPod/.test(navigator.userAgent))return 1500000;return 1e6}_effectiveSplatBudget(){if(this._hostBudgetAllocation!==null){let l=Math.max(1,this._hostBudgetAllocation);return this._residentBudget>0?Math.min(l,this._residentBudget):l}if(this._splatBudget<=0)return 0;return this._residentBudget>0?Math.min(this._splatBudget,this._residentBudget):this._splatBudget}_splatBudgetEnabled(){return this._effectiveSplatBudget()>0}getBudgetDemand(){if(!this._baseLayerReady)return 0;let l=this._environmentSplatCount();for(let f of this._leafNodes){let m=f.optimalLod??f.baseLod;l+=this._countAtLevel(f,this._cappedLevelForNode(f,m))}return l}setBudgetAllocation(l){if(l===null){if(this._hostBudgetAllocation!==null)this._hostBudgetAllocation=null,this._forceLodUpdate=!0;return}let f=this._hostBudgetAllocation;if(this._hostBudgetAllocation=l,f===null||l!==f)this._forceLodUpdate=!0}get maxLodLevel(){return Math.max(0,this._metadata.lodLevels-1)}get frustumCulling(){return this._frustumCulling}set frustumCulling(l){if(this._frustumCulling===l)return;this._frustumCulling=l,this._forceLodUpdate=!0}get debugDisplay(){return this._debugDisplay}set debugDisplay(l){if(this._debugDisplay===l)return;if(this._debugDisplay=l,l)this._refreshDebugDisplay();else this._clearDebugDisplay()}get debugLodSource(){return this._debugLodSource}set debugLodSource(l){if(this._debugLodSource===l)return;if(this._debugLodSource=l,this._debugDisplay)this._refreshDebugDisplay()}dispose(l){if(this._disposed)return;if(this._disposed=!0,this._rejectPartReady("GaussianSplattingStream: disposed before the part was ready."),this._unsubBeforeRebuild?.(),this._unsubAfterRebuild?.(),this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove?.(),this._hostUnsubDispose?.(),this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._hostCompound&&!this._hostCompound.isDisposed())this._hostCompound.unregisterLodBudgetParticipant(this);if(this._host&&this._hostCompound&&!this._partReleasedByHost&&!this._hostCompound.isDisposed())this._hostCompound.removePart(this._host.partIndex);if(this._host=null,this._lodObserver)this._scene.onBeforeRenderObservable.remove(this._lodObserver),this._lodObserver=null;this._clearDebugDisplay(),this._downloadManager.dispose(),this._disposeRangeSourcePack(),this._splitPacks.clear(),this._residencyPages.clear(),this._residency?.dispose(),this._residency=null,this._workBuffer?.dispose(),this._workBuffer=null,super.dispose(l)}_disposeAndReclaim(){let l=this._hostCompound,f=!!this._host&&!this._partReleasedByHost;if(this.dispose(),f&&l&&!l.isDisposed())l.compactAtlas()}_getEffectiveWorldMatrix(l){if(this._host)return this._host.proxy.computeWorldMatrix(l);return this.computeWorldMatrix(l)}_getActiveLodCameras(){return((this._scene.activeCameras?.length)?this._scene.activeCameras:this._scene.activeCamera?[this._scene.activeCamera]:[]).filter((f)=>!!f)}evaluateOptimalLods(l=null){let f=l?[l]:this._getActiveLodCameras();if(f.length===0||this._leafNodes.length===0)return;let m=Math.max(0,this._metadata.lodLevels-1),S=this._lodBaseDistance,b=this._lodMultiplier,w=this._lodBehindPenalty,y=this._lodRangeMin,D=this._lodRangeMax,P=this._splatBudgetEnabled(),T=this._scene.getEngine().getRenderHeight()||1,E=this._scene.getEngine();this._getEffectiveWorldMatrix(!1).invertToRef(Ke);let L=f.map((A)=>{let O=E.getAspectRatio(A)||1,k=Math.tan(A.fov*0.5);if(A.fovMode===K.FOVMODE_HORIZONTAL_FIXED)k/=O;let W=k*O,q=Math.min(k,W)/ms,F=T*(A.viewport?A.viewport.height:1),z=e.TransformCoordinatesToRef(A.globalPosition,Ke,Cs),G={px:z.x,py:z.y,pz:z.z,fwx:0,fwy:0,fwz:0,fovScale:q,tanHalfV:k,pixelHeight:F};if(w>1){A.getDirectionToRef(Ds,Ht);let V=e.TransformNormalToRef(Ht,Ke,ws);V.normalize(),G.fwx=V.x,G.fwy=V.y,G.fwz=V.z}return G});for(let A of this._leafNodes){let O=A.bound.min,k=A.bound.max,W=(O[0]+k[0])*0.5,q=(O[1]+k[1])*0.5,F=(O[2]+k[2])*0.5,z=k[0]-O[0],G=k[1]-O[1],V=k[2]-O[2],I=0.5*Math.sqrt(z*z+G*G+V*V),U=Number.POSITIVE_INFINITY,X=0;for(let j of L){let te=j.px<O[0]?O[0]:j.px>k[0]?k[0]:j.px,se=j.py<O[1]?O[1]:j.py>k[1]?k[1]:j.py,Z=j.pz<O[2]?O[2]:j.pz>k[2]?k[2]:j.pz,Q=te-j.px,ee=se-j.py,H=Z-j.pz,J=Math.sqrt(Q*Q+ee*ee+H*H),re=J;if(w>1&&J>0.01){let oe=(j.fwx*Q+j.fwy*ee+j.fwz*H)/J;if(oe<0)re=J*(1+-oe*(w-1))}let ne=re*j.fovScale,ae;if(m===0||ne<S)ae=0;else{ae=m;while(ae>1&&ne<S*Math.pow(b,ae-1))ae--}if(ae<U)U=ae;if(P){let oe=W-j.px,ce=q-j.py,le=F-j.pz,fe=Math.sqrt(oe*oe+ce*ce+le*le),ge=I*j.pixelHeight/(Math.max(fe,0.0001)*j.tanHalfV);if(ge>X)X=ge}}if(U<y)U=y;else if(U>D)U=D;if(this._frustumCulling&&A.inFrustum===!1)U=D;if(A.optimalLod=U,P)A.pixelSize=X}}_displayedLodLevel(l){if(this._debugLodSource==="optimal")return l.optimalLod??l.activeLod??0;return l.activeLod??0}_refreshDebugDisplay(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();this._buildDebugMesh();let l=this._debugDisplay;if(l&&!this._debugObserver)this._debugObserver=this._scene.onBeforeRenderObservable.add(()=>this._onDebugFrame());else if(!l&&this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null}_onDebugFrame(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();if(this._computeDebugSignature()!==this._debugSignature)this._updateDebugColors()}_buildDebugMesh(){if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null;let l=[],f=[];for(let S of this._leafNodes){let b=Pe[this._displayedLodLevel(S)%Pe.length],w=S.bound.min,y=S.bound.max,D=[new e(w[0],w[1],w[2]),new e(y[0],w[1],w[2]),new e(y[0],y[1],w[2]),new e(w[0],y[1],w[2]),new e(w[0],w[1],y[2]),new e(y[0],w[1],y[2]),new e(y[0],y[1],y[2]),new e(w[0],y[1],y[2])];for(let P of Yt)l.push([D[P[0]],D[P[1]]]),f.push([b,b])}if(this._debugSignature=this._computeDebugSignature(),l.length===0)return;let m=_n(this.name+"_lodDebug",{lines:l,colors:f,updatable:!0,useVertexAlpha:!1},this._scene);m.parent=this,m.isPickable=!1,m.doNotSerialize=!0,m.reservedDataStore={hidden:!0},this._debugMesh=m,this._debugColorData=new Float32Array(this._leafNodes.length*Xt*4)}_updateDebugColors(){if(!this._debugMesh||!this._debugColorData)return;let l=this._debugColorData,f=0;for(let m of this._leafNodes){let S=Pe[this._displayedLodLevel(m)%Pe.length];for(let b=0;b<Xt;b++)l[f++]=S.r,l[f++]=S.g,l[f++]=S.b,l[f++]=S.a}this._debugMesh.updateVerticesData(n.ColorKind,l),this._debugSignature=this._computeDebugSignature()}_computeDebugSignature(){let l=0;for(let f of this._leafNodes)l=l*31+this._displayedLodLevel(f)|0;return l}_clearDebugDisplay(){if(this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null;if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null,this._debugSignature=0}_collectLodEntries(l){if(l.children){for(let A of l.children)this._collectLodEntries(A);return}if(!l.lods)return;let f=l.bound?.min,m=l.bound?.max;if(!f||!m||f.length<3||m.length<3||!f.every((A)=>Number.isFinite(A))||!m.every((A)=>Number.isFinite(A)))return;let S=m[0]-f[0],b=m[1]-f[1],w=m[2]-f[2],y=Math.sqrt(S*S+b*b+w*w);if(!Number.isFinite(y)||y<=0)return;let D=Math.floor(Number(this._metadata.lodLevels)),P=Number.isFinite(D)&&D>0?D-1:0,T=[];for(let A of Object.keys(l.lods)){let O=Number(A),k=l.lods[A],W=k?Math.floor(Number(k.count)):NaN;if(Number.isInteger(O)&&String(O)===A&&O>=0&&O<=P&&k&&Number.isFinite(W)&&W>0){if(this._streamOptions.rangeResidency&&(!Number.isSafeInteger(k.file)||k.file<0||k.file>=this._metadata.filenames.length)){c.Warn(`GaussianSplattingStream: invalid LOD file index ${k.file}; skipping level ${O}.`);continue}k.count=W,T.push(O)}}if(T.length===0)return;T.sort((A,O)=>A-O);let E=[],L=1/0;for(let A of T){let O=l.lods[String(A)].count;if(O<=L)E.push(A),L=O}l.availableLevels=E,l.baseLod=E[E.length-1],l.activeLod=void 0,l.lodCooldown=0,l.inFrustum=!0,l.cullBounds=new di(e.FromArray(f),e.FromArray(m)),this._leafNodes.push(l)}async _streamAllAsync(){let l=this._collectAllFileIds(),f=this._collectBaseFileIds();this._baseFileIds.clear();for(let P of f)this._baseFileIds.add(P);if(this._leafNodes.length>0&&f.length===0)throw Error("GaussianSplattingStream: no valid coarse source files were referenced.");let m=l.length>bs&&f.length<l.length;if(m&&this._decodeSh)this._streamShDegree=De,this._shTextureCount=xs;let S=m?f:l,b=await this._gatherCountsAsync(S);if(this._disposed)return;for(let P of f){let T=this._fileCounts.get(P);if(!this._fileMeta.has(P)||T===void 0||T<=0)throw Error(`GaussianSplattingStream: required coarse metadata for file ${P} is unavailable or invalid.`)}if(this._resolveMinimumResidentSplats(f,b),!m)this._resolveLod0SplatCount(),this._metadataReady=!0;let w=null;if(!m){w=1+b;for(let P of l){let T=this._fileCounts.get(P);if(T!==void 0&&T>0)w=ie._SafeAddCounts(w,T,"stream capacity")}}if(this._minimumResidentSplats<=1)throw Error("GaussianSplattingStream: stream produced no splats.");let y=0;for(let P of f)y=Math.max(y,this._fileCounts.get(P));let D=this._resolveResidentBudget(w,y);if(this._evictionEnabled=m||w!==null&&D<w,this._residency=new Qe(D,this._evictionCooldownFrames,(P)=>this._onFileEvicted(P)),this._residency.pin(gs,1),b>0){let P=this._residency.allocate(we,b);if(P!==null)this._environmentRange={offset:P,count:b};else c.Warn("GaussianSplattingStream: environment does not fit the memory budget; skipping it."),this._environmentFiles=null}if(this._hostCompound){let P=a.Compose(new e(1,-1,1),d.RotationYawPitchRoll(0,-Math.PI/2,0),e.ZeroReadOnly),T=this._hostCompound.reserveStreamingPart(D,P,this.name+"_part",this._shTextureCount,this._streamShDegree,this._needsRotationScale);this._host=T,this._positionBase=T.base,this._hostCompound.registerLodBudgetParticipant(this);let E=this._hostCompound,L=E.onPartRemovedObservable.add((W)=>{if(!this._disposed&&this._host&&W===this._host.partIndex)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubRemove=()=>E.onPartRemovedObservable.remove(L);let A=this._shTextureCount>0&&T.shMrtAtlas?{textureCount:this._shTextureCount,externalMrts:T.shMrtAtlas}:void 0,O=this._needsRotationScale&&T.rotMrtAtlas?{externalMrt:T.rotMrtAtlas}:void 0;this._workBuffer=new Ce(this._scene,T.capacity,{mrt:T.mrtAtlas,width:T.atlasWidth,baseOffset:T.base},A,O),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback,this._splatPositions=T.splatPositions,this._vertexCount=D;let k=this._workBuffer;this._unsubBeforeRebuild=T.onBeforeAtlasRebuild(()=>{k.backupRegion(),this._positionSnapshot=this._splatPositions?this._splatPositions.slice(this._positionBase*4,(this._positionBase+this._vertexCount)*4):null}),this._unsubAfterRebuild=T.onAfterAtlasRebuild(()=>{if(T.mrtAtlas)k.rebindAtlas(T.mrtAtlas);if(k.rebindShAtlas(T.shMrtAtlas),k.rebindRotAtlas(T.rotMrtAtlas),this._positionBase=T.base,k.setBaseOffset(T.base),k.restoreRegion(),this._splatPositions=T.splatPositions,this._positionSnapshot&&this._splatPositions)this._splatPositions.set(this._positionSnapshot,this._positionBase*4),this._positionSnapshot=null}),T.setActiveRanges([])}else{let P=this._shTextureCount>0?{textureCount:this._shTextureCount}:void 0,T=this._needsRotationScale?{}:void 0;this._workBuffer=new Ce(this._scene,D,void 0,P,T),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback;let E=new Float32Array(D*4),L=this._workBuffer.textures,A=P?this._workBuffer.shTextures:void 0,O=T?this._workBuffer.rotationTextures:void 0;this._setExternalWorkBuffer(L[0],L[1],L[2],L[3],E,D,A,this._streamShDegree,O),this.setSplatIndexRanges([]),this.setEnabled(!0)}if(this._host&&this._workBuffer){if(await this._waitForCanBackupAsync(this._workBuffer),this._disposed)return}if(this._environmentRange&&this._environmentFiles)await this._decodeEnvironmentAsync();this._environmentFiles=null;for(let P of f){if(this._disposed)return;if(!await this._decodeFileAsync(P))throw Error(`GaussianSplattingStream: required coarse file ${P} failed to decode.`)}if(this._disposed)return;for(let P of this._leafNodes)if(P.activeLod!==P.baseLod||P.activeFile===void 0)throw Error("GaussianSplattingStream: the complete coarse layer could not be activated.");if(this._baseLayerReady=!0,this._resolvePartReady(),m){let P=l.filter((T)=>!this._baseFileIds.has(T));if(await this._gatherCountsAsync(P,!1),this._resolveLod0SplatCount(),this._metadataReady=!0,this._disposed)return}if(!this._lodObserver)this._lodObserver=this._scene.onBeforeRenderObservable.add(()=>this._onLodFrame())}async _waitForCanBackupAsync(l){for(let f=0;f<600&&!this._disposed;f++){if(l.canBackup)return;await new Promise((m)=>this._scene.onBeforeRenderObservable.addOnce(()=>m()))}if(!this._disposed&&!l.canBackup)c.Warn("GaussianSplattingStream: backup/restore copy shaders did not compile in time; a grow/compaction before they are ready may drop streamed data.")}_resolveResidentBudget(l=null,f=0){let m=this._maxResidentSplats>0||this._memoryBudgetMb>0,S=this._maxResidentSplats>0?this._maxResidentSplats:Number.POSITIVE_INFINITY,b=this._bytesPerResidentSplat();if(this._memoryBudgetMb>0){let w=Math.floor(this._memoryBudgetMb*1024*1024/b);S=Math.min(S,w)}if(!m&&l!==null)S=l;else if(!m){let w=this._scene.getEngine().hostInformation?.isMobile?Ms:ys,y=Math.floor(w*1024*1024/b),D=Math.max(0,Math.floor(f)),P=ie._SafeAddCounts(this._minimumResidentSplats,D,"automatic resident capacity");S=Math.max(y,P)}else if(S<this._minimumResidentSplats)c.Warn(`GaussianSplattingStream: the requested initial residency (${S} splats) is below the complete coarse minimum (${this._minimumResidentSplats}); using the minimum.`);if(S=Math.max(this._minimumResidentSplats,Math.floor(S)),l!==null)S=Math.min(S,l);if(l!==null||this._minimumResidentSplats>0){let w=Math.floor(this._scene.getEngine().getCaps().maxTextureSize),y=w*w;if(!Number.isSafeInteger(y)||this._minimumResidentSplats>y)throw Error(`GaussianSplattingStream: minimum resident splat count ${this._minimumResidentSplats} exceeds the device texture capacity ${y}.`);if(S>y)S=y;if(S<this._minimumResidentSplats)throw Error(`GaussianSplattingStream: minimum resident splat count ${this._minimumResidentSplats} exceeds the device texture capacity ${y}.`)}if(!Number.isSafeInteger(S)||S<this._minimumResidentSplats||S<1)throw Error("GaussianSplattingStream: resolved resident capacity is invalid.");return this._residentBudget=S,S}_bytesPerResidentSplat(){let l=this._scene.getEngine().getCaps().textureHalfFloatRender?24:48;return Ss+this._shTextureCount*16+(this._needsRotationScale?l:0)}_collectAllFileIds(){let l=new Set;for(let f of this._leafNodes)for(let m of f.availableLevels){let S=f.lods[String(m)];if(S)l.add(S.file)}return Array.from(l).sort((f,m)=>f-m)}_collectBaseFileIds(){let l=new Set;for(let f of this._leafNodes){let m=f.lods?.[String(f.baseLod)];if(m)l.add(m.file)}return Array.from(l).sort((f,m)=>f-m)}_resolveMinimumResidentSplats(l,f){let m=ie._SafeAddCounts(1,Math.max(0,Math.floor(f)),"minimum resident splats");for(let S of l){let b=this._fileCounts.get(S);if(b===void 0||!Number.isSafeInteger(b)||b<=0)throw Error(`GaussianSplattingStream: required coarse metadata for file ${S} is unavailable or invalid.`);m=ie._SafeAddCounts(m,b,"minimum resident splats")}this._minimumResidentSplats=m}_resolveLod0SplatCount(){let l=0,f=!1;for(let m of this._leafNodes){if(m.availableLevels?.[0]!==0)continue;let S=m.lods?.["0"];if(!S){this._lod0SplatCount=Object.freeze({status:"unavailable"});return}if(f=!0,!this._fileCounts.has(S.file)||!this._fileMeta.has(S.file)){this._lod0SplatCount=Object.freeze({status:"unavailable"});return}if(l+=S.count,!Number.isSafeInteger(l)){this._lod0SplatCount=Object.freeze({status:"unavailable"});return}}this._lod0SplatCount=f?Object.freeze({status:"available",count:l}):Object.freeze({status:"unavailable"})}async _gatherCountsAsync(l,f=!0){let m=0,S=0,b=0,w=(y)=>{let D=ie._GetShInfo(y);if(D.degree>S)S=D.degree;if(D.coeffs>b)b=D.coeffs};if(f&&this._metadata.environment)try{let y=this._rootUrl+this._metadata.environment,D=await this._downloadManager.loadFileAsync(y),P=await this._unzipAsync(new Uint8Array(D)),T=P.get("meta.json");if(T){let E=JSON.parse(new TextDecoder().decode(T));m=ie._GetSplatCount(E),w(E),this._environmentFiles=P}}catch(y){c.Warn("GaussianSplattingStream: failed to load environment: "+(y?.message??y))}await Promise.all(l.map(async(y)=>{let D=this._metadata.filenames[y];if(!D){c.Warn(`GaussianSplattingStream: missing filename for file index ${y}.`);return}try{let P=this._rootUrl+D,T=P.substring(0,P.lastIndexOf("/")+1),E=await this._downloadManager.loadFileAsync(P),L=JSON.parse(new TextDecoder().decode(new Uint8Array(E)));this._fileCounts.set(y,ie._GetSplatCount(L)),this._fileMeta.set(y,{sogData:L,subRootUrl:T})}catch(P){c.Warn(`GaussianSplattingStream: failed to load metadata for ${D}: ${P?.message??P}`)}}));for(let{sogData:y}of this._fileMeta.values())w(y);if(this._decodeSh&&S>0&&b>0)this._streamShDegree=Math.max(this._streamShDegree,S),this._shTextureCount=Math.max(this._shTextureCount,Math.ceil(b*3/16));if(this._streamOptions.rangeResidency)this._initializeResidencyPages(l);return m}_initializeResidencyPages(l){let f=new Set(l),m=[];for(let w of this._leafNodes)for(let y of w.availableLevels){let D=w.lods[String(y)];if(f.has(D.file))m.push(D)}let{pages:S,invalidFiles:b}=Zt(m,this._fileCounts,this._baseFileIds,this._metadata.filenames.length,this._nextPageId);for(let w of b)c.Warn(`GaussianSplattingStream: invalid LOD interval in file ${w}; keeping it as one resident file.`);for(let w of S){let y=this._fileMeta.get(w.source.file);this._fileMeta.set(w.id,y),this._fileCounts.set(w.id,w.source.count);let D=Object.freeze({...w.source});this._residencyPages.set(w.id,D);let P=this._resolveSplitPack(w.id,D,y.sogData);if(P)this._splitPacks.set(w.id,P);for(let T of w.entries)T.file=w.id,T.offset-=w.source.offset}if(this._nextPageId+=S.length,S.length)this._forceLodUpdate=!0}_resolveSplitPack(l,f,m){let S=this._streamOptions.rangePack;if(!S)return null;try{let b=S(f,m);if(!b)return null;if(ie._GetSplatCount(b.sogData)!==f.count)return c.Warn(`GaussianSplattingStream: split pack for page ${l} does not hold ${f.count} splats; using the source pack.`),null;return b}catch(b){return c.Warn(`GaussianSplattingStream: rangePack failed for page ${l}: ${b?.message??b}; using the source pack.`),null}}async _loadPrefetchedPackAsync(l,f){let m=l.sogData,S=new Set([...m.means?.files??[],...m.scales?.files??[],...m.quats?.files??[],...m.sh0?.files??[],...m.shN?.files??[]]),b=new Map;if(await Promise.all(Array.from(S,async(y)=>{b.set(y,new Uint8Array(await this._downloadManager.loadFileAsync(l.subRootUrl+y,f)))})),this._disposed)return null;b.set("meta.json",new TextEncoder().encode(JSON.stringify(m)));let w=(await ve(b,"",this._scene,!this._useGpuPositionReadback)).sogTextures;if(!w)return null;if(this._disposed)return ie._DisposePack(w),null;return w}async _getRangeSourcePackAsync(l,f){if(this._rangeSourcePack?.file===l)return this._rangeSourcePackReuses++,this._rangeSourcePack.pack;this._disposeRangeSourcePack();let m=await this._loadPrefetchedPackAsync(f,l);if(!m)return null;if(this._disposed)return ie._DisposePack(m),null;return this._rangeSourcePackLoads++,this._rangeSourcePack={file:l,pack:m},m}_disposeRangeSourcePack(){if(this._rangeSourcePack)ie._DisposePack(this._rangeSourcePack.pack),this._rangeSourcePack=null}static _CloneLodMetadata(l){return{...l,tree:ie._CloneLodNode(l.tree)}}static _CloneLodNode(l){let f={};if(l.bound)f.bound={min:Array.isArray(l.bound.min)?l.bound.min.slice():l.bound.min,max:Array.isArray(l.bound.max)?l.bound.max.slice():l.bound.max};if(Array.isArray(l.children))f.children=l.children.map((m)=>ie._CloneLodNode(m));if(l.lods){f.lods={};for(let m of Object.keys(l.lods)){let S=l.lods[m];f.lods[m]=S&&typeof S==="object"?{...S}:S}}return f}_enqueueDecode(l){if(this._decodedFiles.has(l)||this._loadingFiles.has(l)||!this._fileMeta.has(l))return;if(this._decodeQueue.indexOf(l)===-1)this._decodeQueue.push(l)}_pumpDecodeQueue(){let l=0;while(this._decodeQueue.length>0&&l<this._maxDecodesPerFrame){let f=this._decodeQueue.shift();if(this._decodedFiles.has(f)||this._loadingFiles.has(f))continue;l++,this._decodeFileAsync(f).catch((m)=>{c.Warn("GaussianSplattingStream: decode failed: "+(m?.message??m))})}}_applyPositions(l,f,m){this._splatPositions.set(l,(this._positionBase+f)*4),this._updateBounds(l,m),this._sinkPostPositionsRange(f,m)}_sinkSetActiveRanges(l){if(this._host)this._host.setActiveRanges(l);else this.setSplatIndexRanges(l)}_sinkPostPositionsRange(l,f){if(this._host)this._host.postPositionsRange(l,f);else this._postWorkerPositionsRange(l,f)}_sinkNotifyDataChanged(){if(this._host)this._host.notifyDataChanged();else this._notifyWorkerNewData()}get _sinkIsDepthSortSettled(){return this._host?this._host.isDepthSortSettled:this._isDepthSortSettled}async _probeReadbackAsync(l,f,m){if(this._readbackProbed=!0,!this._workBuffer)return;let S=Math.min(f,1024),b=!1;try{let w=await this._workBuffer.readCentersRangeAsync(l,S);if(this._disposed)return;if(w&&w.length>=S*4){b=!0;for(let y=0;y<S&&b;y++)for(let D=0;D<3;D++){let P=w[y*4+D],T=m[y*4+D];if(Math.abs(P-T)>0.01*(1+Math.abs(T))){b=!1;break}}}}catch{b=!1}this._useGpuPositionReadback=b,c.Log(b?"GaussianSplattingStream: GPU position readback validated; streamed LOD positions are read back from the GPU.":"GaussianSplattingStream: GPU position readback unavailable; decoding LOD positions on the CPU.")}async _applyDecodedPositionsAsync(l,f,m,S=0){if(this._useGpuPositionReadback&&this._workBuffer){let w=await this._workBuffer.readCentersRangeAsync(f,m);if(this._disposed)return!1;if(w&&this._splatPositions)return this._applyPositions(w,f,m),!0}let b=l.positions.length>=(S+m)*4?l.positions.subarray(S*4,(S+m)*4):null;if(!b||!this._splatPositions)return!1;if(this._applyPositions(b,f,m),!this._readbackProbed&&this._readbackCandidate)await this._probeReadbackAsync(f,m,b);return!0}async _decodeEnvironmentAsync(){if(!this._environmentRange||!this._environmentFiles||!this._workBuffer)return;let l=this._environmentRange,f=!1;try{let S=(await ve(this._environmentFiles,"",this._scene,!this._useGpuPositionReadback,this._downloadManager)).sogTextures;if(!S){c.Warn("GaussianSplattingStream: environment decoding produced no texture data.");return}try{if(this._disposed||!this._workBuffer)return;if(await this._workBuffer.decodeAsync(S,l.offset),this._disposed)return;let b=await this._applyDecodedPositionsAsync(S,l.offset,l.count);if(this._disposed)return;if(!b){c.Warn("GaussianSplattingStream: decoded positions could not be applied for the environment.");return}if(this._residency?.pin(we,l.count)!==l.offset)throw Error("GaussianSplattingStream: decoded environment could not be pinned.");f=!0,this._refreshActiveRanges()}finally{ie._DisposePack(S)}}catch(m){c.Warn("GaussianSplattingStream: failed to decode environment: "+(m?.message??m))}finally{if(!f)this._residency?.free(we),this._environmentRange=null}}async _decodeFileAsync(l){if(this._decodedFiles.has(l))return!0;if(this._loadingFiles.has(l)||!this._residency)return!1;let f=this._fileMeta.get(l),m=this._fileCounts.get(l);if(!f||m===void 0)return!1;this._loadingFiles.add(l),this._cancelledDecodes.delete(l);let S=!1,b=this._residencyPages.get(l),w=this._splitPacks.get(l),y=null;try{let D,P=!0;if(w)D=await this._loadPrefetchedPackAsync(w,l);else if(b){if(y=await this._acquireDecodeGateAsync(),this._disposed||this._cancelledDecodes.has(l))return!1;if(D=await this._getRangeSourcePackAsync(b.file,f),P=!1,D)this._activeRangeSource=b.file}else D=(await ve(f.sogData,f.subRootUrl,this._scene,!this._useGpuPositionReadback,this._downloadManager,l)).sogTextures??null;if(!D)return!1;if(w)this._rangeSplitPackLoads++;let T=b&&!w?b.offset:0;y??(y=await this._acquireDecodeGateAsync());try{if(this._disposed||!this._workBuffer||this._cancelledDecodes.has(l))return!1;let E=this._residency;if(!E)return!1;let L=E.allocate(l,m);if(L===null)L=await this._relayoutAndAllocateAsync(l,m);if(L===null){if(!this._cancelledDecodes.has(l))c.Warn(`GaussianSplattingStream: resident memory budget full; skipping LOD file ${l}.`);return!1}if(S=!0,this._disposed||!this._workBuffer||this._cancelledDecodes.has(l))return!1;if(b)await this._workBuffer.decodeAsync(D,L,T,m);else await this._workBuffer.decodeAsync(D,L);if(this._disposed||this._cancelledDecodes.has(l))return!1;let A=await this._applyDecodedPositionsAsync(D,L,m,T);if(this._disposed||this._cancelledDecodes.has(l))return!1;if(!A)return c.Warn(`GaussianSplattingStream: decoded positions could not be applied for LOD file ${l}.`),!1;if(this._baseFileIds.has(l)){if(E.pin(l,m)!==L)throw Error(`GaussianSplattingStream: required coarse file ${l} could not be pinned.`)}if(this._decodedFiles.add(l),this._applyDesiredLods())this._refreshActiveRanges();return!0}finally{if(P)ie._DisposePack(D)}}catch(D){if(!this._cancelledDecodes.has(l))throw D;return!1}finally{if(b&&!w&&y)this._activeRangeSource=null;if(y?.(),S&&!this._decodedFiles.has(l))this._residency?.free(l);let D=this._cancelledDecodes.has(l);if(this._loadingFiles.delete(l),this._cancelledDecodes.delete(l),D&&!this._disposed&&(this._fileRefs.get(l)??0)>0)this._enqueueDecode(l)}}async _acquireDecodeGateAsync(){let l=this._decodeGate,f;return this._decodeGate=new Promise((m)=>{f=m}),await l,f}async _relayoutAndAllocateAsync(l,f){if(!this._residency||!this._workBuffer)return null;if(this._residency.freeSize<f)return null;return await new Promise((m)=>{let S=()=>{if(this._disposed||!this._residency||!this._workBuffer||this._cancelledDecodes.has(l)){m(null);return}if(!this._workBuffer.isRelayoutReady()){this._scene.onBeforeRenderObservable.addOnce(S);return}this._performRelayout(),m(this._residency.allocate(l,f))};this._scene.onBeforeRenderObservable.addOnce(S)})}_performRelayout(){if(!this._residency||!this._workBuffer||!this._splatPositions)return;let l=this._relayoutOldOffsets;l.clear();for(let D of this._residency.getResidentBlocks())l.set(D.file,D.offset);if(this._residency.compact().length===0)return;let m=this._residency.capacity;if(!this._relayoutSrcIndex||this._relayoutSrcIndex.length!==m)this._relayoutSrcIndex=new Float32Array(m);let S=this._relayoutSrcIndex;S.fill(-1);let b=this._residency.getResidentBlocks();for(let D of b){let P=l.get(D.file);for(let T=0;T<D.count;T++)S[D.offset+T]=P+T}this._workBuffer.relayoutSync(S);let w=this._splatPositions,y=this._positionBase;b.sort((D,P)=>D.offset-P.offset);for(let D of b){let P=l.get(D.file);if(P!==D.offset)w.copyWithin((y+D.offset)*4,(y+P)*4,(y+P+D.count)*4)}if(this._environmentRange){let D=this._residency.offset(we);if(D!==void 0)this._environmentRange.offset=D}this._sinkNotifyDataChanged(),this._refreshActiveRanges()}_onFileEvicted(l){this._decodedFiles.delete(l)}_cappedLevelForNode(l,f){let m=l.availableLevels,S=this._maxDetailLod,b=-1,w=Number.POSITIVE_INFINITY;for(let y of m){if(y<S)continue;let D=Math.abs(y-f);if(D<w)b=y,w=D}return b<0?l.baseLod:b}_computeTargetLevels(){let l=this._effectiveSplatBudget();if(l<=0){for(let S of this._leafNodes){let b=S.optimalLod??S.baseLod;S.targetLevel=this._cappedLevelForNode(S,b)}return}let f=Math.max(0,l-this._environmentSplatCount());this._convergePixelThreshold(f);let m=this._lodPixelThreshold;for(let S of this._leafNodes)S.targetLevel=this._budgetedLevel(S,m)}_environmentSplatCount(){let l=this._environmentRange?Math.floor(Number(this._environmentRange.count)):0;return Number.isFinite(l)&&l>0?l:0}_budgetedLevel(l,f){let m=l.optimalLod??l.baseLod,S=l.pixelSize??0,b=0;if(S>0&&f>S)b=Math.max(0,Math.round(Math.log(f/S)/Math.log(this._lodMultiplier)));return this._cappedLevelForNode(l,m+b)}_countAtLevel(l,f){let m=l.lods[String(f)];return m?m.count:0}_totalSplatsAtThreshold(l){let f=0;for(let m of this._leafNodes)f+=this._countAtLevel(m,this._budgetedLevel(m,l));return f}_convergePixelThreshold(l){if(this._totalSplatsAtThreshold(1)<=l){this._lodPixelThreshold=1;return}let m=1;for(let D of this._leafNodes)if(D.pixelSize&&D.pixelSize>m)m=D.pixelSize;let S=Math.min(32,Math.max(1,this._metadata.lodLevels)),b=m*Math.pow(this._lodMultiplier,S+1);if(this._totalSplatsAtThreshold(b)>l){this._lodPixelThreshold=b;return}let w=1,y=b;for(let D=0;D<40&&y-w>0.001*y;D++){let P=0.5*(w+y);if(this._totalSplatsAtThreshold(P)<=l)y=P;else w=P}this._lodPixelThreshold=y}_residentLevelAtLeast(l,f){for(let m of l.availableLevels)if(m>=f&&this._decodedFiles.has(l.lods[String(m)].file))return m;return null}_applyDesiredLods(){let l=!1;for(let f of this._leafNodes){let m=f.targetLevel??f.baseLod;if(this._splatBudgetEnabled()&&f.activeLod!==void 0&&f.activeLod<m){let b=this._residentLevelAtLeast(f,m);if(b!==null&&b!==f.activeLod)this._switchActiveFile(f,f.lods[String(b)].file),f.activeLod=b,f.lodCooldown=this._lodCooldownFrames,l=!0}if(f.lodCooldown&&f.lodCooldown>0)continue;let S;if(m!==f.activeLod){let b=f.lods[String(m)];if(b)if(this._decodedFiles.has(b.file))this._switchActiveFile(f,b.file),f.activeLod=m,f.lodCooldown=this._lodCooldownFrames,l=!0;else S=b.file}if(f.pendingFile!==S){if(f.pendingFile!==void 0)this._releaseFileRef(f.pendingFile);if(S!==void 0)this._acquirePendingFile(S);f.pendingFile=S}}return l}_switchActiveFile(l,f){if(l.activeFile===f)return;if(l.activeFile!==void 0)this._releaseFileRef(l.activeFile);this._acquireFileRef(f),l.activeFile=f}_acquireFileRef(l){let f=(this._fileRefs.get(l)??0)+1;if(this._fileRefs.set(l,f),f===1)this._residency?.cancelEviction(l)}_acquirePendingFile(l){this._acquireFileRef(l),this._enqueueDecode(l)}_releaseFileRef(l){let f=(this._fileRefs.get(l)??0)-1;if(f>0){this._fileRefs.set(l,f);return}if(this._fileRefs.delete(l),this._decodedFiles.has(l)){if(this._evictionEnabled)this._residency?.scheduleEviction(l);return}let m=this._decodeQueue.indexOf(l);if(m!==-1)this._decodeQueue.splice(m,1);if(this._loadingFiles.has(l)){let S=this._residencyPages.get(l);if(S){let b=!1;for(let w of this._decodeQueue)if(!this._splitPacks.has(w)&&this._residencyPages.get(w)?.file===S.file){b=!0;break}this.cancelRangeLoads([l],b?[S.file]:[])}else this._cancelledDecodes.add(l),this._downloadManager.cancelGroup(l)}else if(m!==-1){let S=this._residencyPages.get(l);if(S&&!this._splitPacks.has(l)){let b=!1,w=!1;for(let y of this._loadingFiles){if(this._splitPacks.has(y)||this._residencyPages.get(y)?.file!==S.file)continue;if(this._cancelledDecodes.has(y))w=!0;else{b=!0;break}}if(w&&!b){for(let y of this._decodeQueue)if(!this._splitPacks.has(y)&&this._residencyPages.get(y)?.file===S.file){b=!0;break}if(!b)this._downloadManager.cancelGroup(S.file)}}}}_onLodFrame(){if(this._disposed||!this._baseLayerReady)return;if(this._rangeSourcePack){let S=this._rangeSourcePack.file,b=this._activeRangeSource===S;if(!b){for(let w of this._loadingFiles)if(!this._cancelledDecodes.has(w)&&!this._splitPacks.has(w)&&this._residencyPages.get(w)?.file===S){b=!0;break}}if(!b){for(let w of this._decodeQueue)if(!this._splitPacks.has(w)&&this._residencyPages.get(w)?.file===S){b=!0;break}}if(!b)this._disposeRangeSourcePack()}let l=!1;for(let S of this._leafNodes)if(S.lodCooldown&&S.lodCooldown>0){if(S.lodCooldown--,S.lodCooldown===0&&S.targetLevel!==void 0&&S.targetLevel!==S.activeLod)l=!0}if(this._evictionEnabled)this._residency?.tick();this._pumpDecodeQueue();let f=this._updateNodeFrustum(),m=this._forceLodUpdate||f||l;if(!m&&++this._framesSinceLodUpdate>=this._lodUpdateInterval){let S=this._getActiveLodCameras(),b=this._lodUpdateDistance;if(S.length!==this._lastLodCamPositions.length||this._computeLodSignature(S)!==this._lastLodSignature)m=!0;else for(let w=0;w<S.length;w++)if(e.DistanceSquared(S[w].globalPosition,this._lastLodCamPositions[w])>=b*b){m=!0;break}}if(m){this._forceLodUpdate=!1,this._framesSinceLodUpdate=0;let S=this._getActiveLodCameras();this._lastLodCamPositions.length=0;for(let b of S)this._lastLodCamPositions.push(b.globalPosition.clone());if(this._lastLodSignature=this._computeLodSignature(S),this.evaluateOptimalLods(),this._computeTargetLevels(),this._applyDesiredLods())this._refreshActiveRanges()}}_computeLodSignature(l){let f=this._scene.getEngine(),m=`${f.getRenderWidth()}x${f.getRenderHeight()}#${this._getEffectiveWorldMatrix(!1).updateFlag}`;for(let S of l){let b=S.viewport;m+=`|${S.uniqueId}:${S.fov}:${S.fovMode}:${b.x},${b.y},${b.width},${b.height}`}return m}_updateNodeFrustum(){let l=this._getActiveLodCameras(),f=!1;if(!this._frustumCulling||l.length===0){for(let w of this._leafNodes)if(w.inFrustum===!1)w.inFrustum=!0,f=!0;return f}let m=this._leafNodes,S=this._frustumScratch,b=this._getEffectiveWorldMatrix(!1);for(let w=0;w<m.length;w++)S[w]=!1;for(let w of l){w.getViewMatrix().multiplyToRef(w.getProjectionMatrix(),this._cullCameraViewProj),b.multiplyToRef(this._cullCameraViewProj,this._cullViewProj),ds.GetPlanesToRef(this._cullViewProj,this._frustumPlanes);let y=!0;for(let D of this._frustumPlanes)if(!Number.isFinite(D.normal.x)||!Number.isFinite(D.normal.y)||!Number.isFinite(D.normal.z)||!Number.isFinite(D.d)||D.normal.lengthSquared()===0){y=!1;break}if(!y){for(let D=0;D<m.length;D++)S[D]=!0;continue}for(let D=0;D<m.length;D++)if(!S[D]&&m[D].cullBounds.isInFrustum(this._frustumPlanes))S[D]=!0}for(let w=0;w<m.length;w++)if(S[w]!==m[w].inFrustum)m[w].inFrustum=S[w],f=!0;return f}static _NormalizeResidentLimit(l,f,m){if(!Number.isFinite(l))throw RangeError(`GaussianSplattingStream: ${f} must be finite.`);if(l<=0)return 0;let S=m?Math.max(1,Math.floor(l)):l;if(S>Number.MAX_SAFE_INTEGER)throw RangeError(`GaussianSplattingStream: ${f} is outside the supported range.`);return S}static _SafeAddCounts(l,f,m){let S=l+f;if(!Number.isSafeInteger(l)||l<0||!Number.isSafeInteger(f)||f<0||!Number.isSafeInteger(S))throw Error(`GaussianSplattingStream: ${m} exceeds the supported integer range.`);return S}static _GetSplatCount(l){let f=l.count??(Array.isArray(l.means.shape)?l.means.shape[0]:0),m=Math.floor(Number(f));return Number.isFinite(m)&&m>0?m:0}static _GetShInfo(l){if(!l.shN)return{degree:0,coeffs:0};let f=0,m=l.shN.bands;if(typeof m==="number"&&Number.isFinite(m)&&m>0)f=Math.floor(m);else if(Array.isArray(l.shN.shape)&&Number.isFinite(l.shN.shape[1])&&l.shN.shape[1]>0){let S=Math.floor(l.shN.shape[1]/3);f=S>0?Math.round(Math.sqrt(S+1)-1):0}if(!(f>0))return{degree:0,coeffs:0};if(f>De)c.Warn(`GaussianSplattingStream: SH degree ${f} exceeds the maximum supported (${De}); clamping.`),f=De;return{degree:f,coeffs:(f+1)**2-1}}static _DisposePack(l){l.meansTextureL.dispose(),l.meansTextureU.dispose(),l.scalesTexture.dispose(),l.quatsTexture.dispose(),l.sh0Texture.dispose(),l.shCentroidsTexture?.dispose(),l.shLabelsTexture?.dispose(),l.codebookTexture?.dispose()}_updateBounds(l,f){let m=this._boundsMin,S=this._boundsMax;for(let b=0;b<f;b++){let w=l[b*4+0],y=l[b*4+1],D=l[b*4+2];m.minimizeInPlaceFromFloats(w,y,D),S.maximizeInPlaceFromFloats(w,y,D)}if(this._host)this._host.expandBounds(m,S);else this.setBoundingInfo(new di(m,S))}_refreshActiveRanges(){let l=[];if(this._environmentRange)l.push({offset:this._environmentRange.offset,count:this._environmentRange.count});for(let f of this._leafNodes){if(f.activeLod===void 0)continue;let m=f.lods[String(f.activeLod)];if(!m)continue;let S=this._residency?.offset(m.file);if(S===void 0)continue;l.push({offset:S+m.offset,count:m.count})}this._sinkSetActiveRanges(ie._CoalesceRanges(l))}static _CoalesceRanges(l){if(l.length<=1)return l;let f=l.slice().sort((S,b)=>S.offset-b.offset),m=[{offset:f[0].offset,count:f[0].count}];for(let S=1;S<f.length;S++){let b=m[m.length-1],w=f[S],y=b.offset+b.count;if(w.offset<=y){let D=Math.max(y,w.offset+w.count);b.count=D-b.offset}else m.push({offset:w.offset,count:w.count})}return m}async _unzipAsync(l){let f=this._streamOptions.fflate;if(!f){if(typeof window.fflate>"u")await v.LoadScriptAsync(this._streamOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");f=window.fflate}let m=f.unzipSync(l),S=new Map;for(let[b,w]of Object.entries(m))S.set(b,w);return S}}class Ro{constructor(l={}){this.name=Me.name,this._assetContainer=null,this.extensions=Me.extensions,this._loadingOptions={...Ro._DefaultLoadingOptions,...l}}createPlugin(l){return new Ro(l[Me.name])}async importMeshAsync(l,f,m,S,b,w){let y=this._tryCreateLODStream(f,m,S);if(y)return{meshes:[y],particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]};return await this._parseAsync(l,f,m,S).then((D)=>({meshes:D,particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]}))}_tryCreateLODStream(l,f,m){if(typeof f!=="string")return null;let S;try{S=JSON.parse(f)}catch{return null}if(!ie.IsLODMetadata(S))return null;return l._executeWithBlockedEntityCollection(!!this._assetContainer,()=>{let b=new ie("GaussianSplattingStream",S,m,l,{deflateURL:this._loadingOptions.deflateURL,fflate:this._loadingOptions.fflate});return b._parentContainer=this._assetContainer,b})}static _BuildPointCloud(l,f,m){if(!f.byteLength)return null;return l._executeWithBlockedEntityCollection(!!m,()=>{let S=new Uint8Array(f),b=new Float32Array(f),w=32,y=S.length/32,D=new Float32Array(y*3),P=new Float32Array(y*4);for(let A=0;A<y;A++)D[A*3+0]=b[8*A+0],D[A*3+1]=b[8*A+1],D[A*3+2]=b[8*A+2],P[A*4+0]=S[32*A+24+0]/255,P[A*4+1]=S[32*A+24+1]/255,P[A*4+2]=S[32*A+24+2]/255,P[A*4+3]=1;let T=new p("PointCloud",l);T._parentContainer=m;let E=new M;E.positions=D,E.colors=P,E.applyToMesh(T),T.geometry._parentContainer=m,m?.geometries.push(T.geometry);let L=new N("point cloud material",l);return L.emissiveColor=h.White(),L.disableLighting=!0,L.pointsCloud=!0,L.pointSize=1,L._parentContainer=m,m?.materials.push(L),T.material=L,T})}static _BuildMesh(l,f){let m=new p("PLYMesh",l),S=new Uint8Array(f.data),b=new Float32Array(f.data),w=32,y=S.length/32,D=[],P=new M;for(let T=0;T<y;T++){let E=b[8*T+0],L=b[8*T+1],A=b[8*T+2];D.push(E,L,A)}if(f.hasVertexColors){let T=new Float32Array(y*4);for(let E=0;E<y;E++){let L=S[32*E+24+0]/255,A=S[32*E+24+1]/255,O=S[32*E+24+2]/255;T[E*4+0]=L,T[E*4+1]=A,T[E*4+2]=O,T[E*4+3]=1}P.colors=T}return P.positions=D,P.indices=f.faces,P.applyToMesh(m),m}async _unzipWithFFlateAsync(l){let f=this._loadingOptions.fflate;if(!f){if(typeof window.fflate>"u")await v.LoadScriptAsync(this._loadingOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");f=window.fflate}let{unzipSync:m}=f,S=m(l),b=new Map;for(let[w,y]of Object.entries(S))b.set(w,y);return b}_parseAsync(l,f,m,S){let b=[],w=(F)=>{f._executeWithBlockedEntityCollection(!!this._assetContainer,()=>{let z=this._loadingOptions.gaussianSplattingMesh??new ss("GaussianSplatting",null,f,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(z._parentContainer=this._assetContainer,b.push(z),F.sogTextures)z.setSogTextureData(F.sogTextures);else z.updateData(F.data,F.sh,{flipY:!1},void 0,F.shDegree);z.scaling.y*=-1,z.computeWorldMatrix(!0),z.safeOrbitCameraLimits=Ro._ExtractSafeOrbitLimits(F)})},y=f.getEngine(),D=this._loadingOptions.useSogTextures;if(D&&!y.isWebGPU&&y.version<2)c.Warn("SPLATFileLoader: useSogTextures requires WebGL2 or WebGPU. Falling back to CPU path."),D=!1;let P=D?ve:Dt;if(typeof m==="string"){let F=JSON.parse(m);if(F&&F.means&&F.scales&&F.quats&&F.sh0)return new Promise((z,G)=>{P(F,S,f).then((V)=>{w(V),z(b)}).catch((V)=>{G(Error("Failed to parse SOG data.",{cause:V}))})})}let T=m instanceof ArrayBuffer?new Uint8Array(m):m;if(T[0]===80&&T[1]===75)return new Promise((F,z)=>{this._unzipWithFFlateAsync(T).then((G)=>{P(G,S,f).then((V)=>{w(V),F(b)}).catch((V)=>{z(Error("Failed to parse SOG zip data.",{cause:V}))})})});let E=(F)=>{Ro._ConvertPLYToSplat(m).then((z)=>{switch(z.mode){case 0:f._executeWithBlockedEntityCollection(!!this._assetContainer,()=>{let G=this._loadingOptions.gaussianSplattingMesh??new ss("GaussianSplatting",null,f,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(G._parentContainer=this._assetContainer,b.push(G),G.updateData(z.data,z.sh,{flipY:!1},void 0,z.shDegree),G.scaling.y*=-1,z.chirality==="RightHanded")G.scaling.y*=-1;switch(z.upAxis){case"X":G.rotation=new e(0,0,Math.PI/2);break;case"Y":G.rotation=new e(0,0,Math.PI);break;case"Z":G.rotation=new e(-Math.PI/2,Math.PI,0);break}G.computeWorldMatrix(!0),G.safeOrbitCameraLimits=Ro._ExtractSafeOrbitLimits(z)});break;case 1:{let G=Ro._BuildPointCloud(f,z.data,this._assetContainer);if(G)b.push(G);break}case 2:f._executeWithBlockedEntityCollection(!!this._assetContainer,()=>{if(z.faces)b.push(Ro._BuildMesh(f,z));else throw Error("PLY mesh doesn't contain face informations.")});break;default:throw Error("Unsupported Splat mode")}this.applyAutoCameraLimits(Ro._ExtractSafeOrbitLimits(z),f),F(b)})},L=T[0]===31&&T[1]===139,A=T[0]===78&&T[1]===71&&T[2]===83&&T[3]===80;if(!L&&!A)return new Promise((F)=>{E(F)});let O=(F,z)=>{f._executeWithBlockedEntityCollection(!!this._assetContainer,()=>{let G=this._loadingOptions.gaussianSplattingMesh??new ss("GaussianSplatting",null,f,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(F.trainedWithAntialiasing){let I=G.material;I.kernelSize=0.1,I.compensation=!0}if(G._parentContainer=this._assetContainer,b.push(G),G.updateData(F.data,F.sh,{flipY:!1},void 0,F.shDegree),!this._loadingOptions.flipY)G.scaling.y*=-1,G.computeWorldMatrix(!0);let V=Ro._ExtractSafeOrbitLimits(F);G.safeOrbitCameraLimits=V,this.applyAutoCameraLimits(V,f)}),z(b)};if(this._loadingOptions.spzLibraryUrl)return cf(this._loadingOptions.spzLibraryUrl).then((F)=>{let z=F.loadSpzFromBuffer(new Uint8Array(m),{to:F.CoordinateSystem.RUB});return hf(z,f).then((G)=>new Promise((V)=>{O(G,V)}))});if(A)return Promise.reject(Error("SPZ V4+ files (NGSP format) are not supported by the native fallback loader. Please provide a valid 'spzLibraryUrl' in the loading options to use the WASM-based SPZ library, or ensure WebAssembly is available in your environment."));let k=new ReadableStream({start(F){F.enqueue(new Uint8Array(m)),F.close()}}),W=new DecompressionStream("gzip"),q=k.pipeThrough(W);return new Promise((F)=>{new Response(q).arrayBuffer().then((z)=>{lf(z,f,this._loadingOptions).then((G)=>{O(G,F)})}).catch(()=>{E(F)})})}static _ExtractSafeOrbitLimits(l){if(l.safeOrbitCameraRadiusMin===void 0&&l.safeOrbitCameraElevationMinMax===void 0)return null;return{radiusMin:l.safeOrbitCameraRadiusMin,elevationMinMax:l.safeOrbitCameraElevationMinMax}}applyAutoCameraLimits(l,f){if(this._loadingOptions.disableAutoCameraLimits||!l)return;if(f.activeCamera?.getClassName()==="ArcRotateCamera"){let m=f.activeCamera;if(l.elevationMinMax)m.lowerBetaLimit=Math.PI*0.5-l.elevationMinMax[1],m.upperBetaLimit=Math.PI*0.5-l.elevationMinMax[0];if(l.radiusMin)m.lowerRadiusLimit=l.radiusMin}}loadAssetContainerAsync(l,f,m){let S=new Pr(l);return this._assetContainer=S,this.importMeshAsync(null,l,f,m).then((b)=>{for(let w of b.meshes)S.meshes.push(w);return this._assetContainer=null,S}).catch((b)=>{throw this._assetContainer=null,b})}loadAsync(l,f,m){return this.importMeshAsync(null,l,f,m).then(()=>{})}static _ConvertPLYToSplat(l){let f=new Uint8Array(l),m=new TextDecoder().decode(f.slice(0,10240)),S=`end_header
`,b=m.indexOf(`end_header
`);if(b<0||!m)return new Promise((I)=>{I({mode:0,data:l,rawSplat:!0})});let w=parseInt(/element vertex (\d+)\n/.exec(m)[1]),y=/element face (\d+)\n/.exec(m),D=0;if(y)D=parseInt(y[1]);let P=/element chunk (\d+)\n/.exec(m),T=0;if(P)T=parseInt(P[1]);let E=0,L=0,A={double:8,int:4,uint:4,float:4,short:2,ushort:2,uint16:2,uchar:1,list:0},O={Vertex:0,Chunk:1,SH:2,Float_Tuple:3,Float:4,Uchar:5},k=O.Chunk,W=[],q=[],F=m.slice(0,b).split(`
`),z={};for(let I of F)if(I.startsWith("property ")){let[,U,X]=I.split(" ");if(k==O.Chunk)q.push({name:X,type:U,offset:L}),L+=A[U];else if(k==O.Vertex)W.push({name:X,type:U,offset:E}),E+=A[U];else if(k==O.SH)W.push({name:X,type:U,offset:E});else if(k==O.Float_Tuple){let j=new DataView(l,L,A.float*2);z.safeOrbitCameraElevationMinMax=[j.getFloat32(0,!0),j.getFloat32(4,!0)]}else if(k==O.Float){let j=new DataView(l,L,A.float);z.safeOrbitCameraRadiusMin=j.getFloat32(0,!0)}else if(k==O.Uchar){let j=new DataView(l,L,A.uchar);if(X=="up_axis")z.upAxis=j.getUint8(0)==0?"X":j.getUint8(0)==1?"Y":"Z";else if(X=="chirality")z.chirality=j.getUint8(0)==0?"LeftHanded":"RightHanded"}if(!A[U])c.Warn(`Unsupported property type: ${U}.`)}else if(I.startsWith("element ")){let[,U]=I.split(" ");if(U=="chunk")k=O.Chunk;else if(U=="vertex")k=O.Vertex;else if(U=="sh")k=O.SH;else if(U=="safe_orbit_camera_elevation_min_max_radians")k=O.Float_Tuple;else if(U=="safe_orbit_camera_radius_min")k=O.Float;else if(U=="up_axis"||U=="chirality")k=O.Uchar}let G=E,V=L;return ss.ConvertPLYWithSHToSplatAsync(l).then(async(I)=>{let U=new DataView(l,b+11),X=V*T+G*w,j=[];if(D)for(let J=0;J<D;J++){let re=U.getUint8(X);if(re!=3)continue;X+=1;for(let ne=0;ne<re;ne++){let ae=U.getUint32(X+(2-ne)*4,!0);j.push(ae)}X+=12}if(T)return await new Promise((J)=>{J({mode:0,data:I.buffer,sh:I.sh,shDegree:I.shDegree,faces:j,hasVertexColors:!1,compressed:!0,rawSplat:!1})});let te=0,se=0,Z=["x","y","z","scale_0","scale_1","scale_2","opacity","rot_0","rot_1","rot_2","rot_3"],Q=["red","green","blue","f_dc_0","f_dc_1","f_dc_2"];for(let J=0;J<W.length;J++){let re=W[J];if(Z.includes(re.name))te++;if(Q.includes(re.name))se++}let ee=te==Z.length&&se>=3,H=D?2:ee?0:1;return await new Promise((J)=>{J({...z,mode:H,data:I.buffer,sh:I.sh,shDegree:I.shDegree,faces:j,hasVertexColors:!!se,compressed:!1,rawSplat:!1})})})}}Ro._DefaultLoadingOptions={keepInRam:!1,flipY:!1,needsRotationScaleTextures:!1,spzLibraryUrl:typeof WebAssembly==="object"?af:void 0};var $t=!1;function Ib(){if($t)return;$t=!0,Xr(new Ro)}
export{yb,Tb,_n,Kr,$u,JM,Cb,Ep,QP,qP,Ap,KP,Yu,Eb,ju,Ab,Qu,wb,Ra,Rb,qu,wp,Rp,ZP,JP,e2,t2,i2,r2,s2,n2,Ro,Ib};

//# debugId=FF274032B2E41FC764756E2164756E21
//# sourceMappingURL=site-7y5vv747.js.map
