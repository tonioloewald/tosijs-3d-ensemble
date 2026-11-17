import{i}from"./site-1yf4ncc8.js";var e="objectIdFunctions",d=`fn encodeObjectId(objectId: f32)->vec4f {
#ifdef PREPASS_OBJECT_ID_R8
return vec4f(objectId/255.0,0.0,0.0,1.0);
#else
let id=i32(objectId);let encodedId=vec3f(
f32((id>>16) & 0xFF),
f32((id>>8) & 0xFF),
f32(id & 0xFF)
)/255.0;return vec4f(encodedId,select(0.0,1.0,id>0));
#endif
}
`;if(!i.IncludesShadersStoreWGSL[e])i.IncludesShadersStoreWGSL[e]=d;var as={name:e,shader:d};
export{as};

//# debugId=D3DA1E47559F1FB764756E2164756E21
//# sourceMappingURL=site-z85ajzpz.js.map
