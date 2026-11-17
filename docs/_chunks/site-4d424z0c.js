import{i}from"./site-1yf4ncc8.js";var e="objectIdFunctions",o=`highp vec4 encodeObjectId(highp float objectId) {
#ifdef PREPASS_OBJECT_ID_R8
return vec4(objectId/255.0,0.0,0.0,1.0);
#else
highp float id=floor(objectId);highp vec3 encodedId=vec3(
floor(mod(id,16777216.0)/65536.0),
floor(mod(id,65536.0)/256.0),
mod(id,256.0)
)/255.0;return vec4(encodedId,step(0.5,id));
#endif
}
`;if(!i.IncludesShadersStore[e])i.IncludesShadersStore[e]=o;var fs={name:e,shader:o};
export{fs};

//# debugId=493013C540261FB064756E2164756E21
//# sourceMappingURL=site-4d424z0c.js.map
