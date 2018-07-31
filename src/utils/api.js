import req from "./httpRequest";

//获取当前管理员信息
export const getInfo = param => {
  const url = `/sys/user/info`;
  return req.get(url, param);
};

//查询图片列表
export const getImageList = param => {
  const url = `/cms/image/getImageList`;
  return req.post(url, param);
};

//图片删除
export const imageRemove = param => {
  const url = `/cms/image/imageRemove`;
  return req.post(url, param);
};

//查询视频列表
export const videoList = param => {
  const url = `/cms/video/getVideoList`;
  return req.post(url, param);
};

//视频删除
export const videoRemove = param => {
  const url = `/cms/video/videoRemove`;
  return req.post(url, param);
};
//视频名称修改
export const videoUpdate = param => {
  const url = `/cms/video/videoUpdate`;
  return req.post(url, param);
};
