import request from '@/lib/request';
var apiUrl = process.env.NEXT_PUBLIC_API_URL;

//列表
export const getServerList = (data) => {
  return request({
    url: `/mcp/mcp_server_list`,
    method: 'get',
  });
};

//添加 mcpServer
export const addMcpServer = (data) => {
  return request({
    url: `/mcp/mcp_server`,
    method: 'post',
    data: data,
  });
};

//修改 mcpServer
export const updateMcpServer = (data) => {
  return request({
    url: '/mcp/mcp_server',
    method: 'put',
    data: data,
  });
};

//删除 mcpServer
export const delMcpServer = (data) => {
  return request({
    url: `/mcp/mcp_server/${data.id}`,
    method: 'delete',
    data: data,
  });
};

//查看 mcpServer
export const getMcpServer = (data) => {
  return request({
    url: `/mcp/mcp_server/${data.id}`,
    method: 'get',
  });
};

// 查看会话
export const getChatList = (data) => {
  return request({
    url: `/chat_window/chat_window_list`,
    method: 'get',
  });
};

// 普通会话
export const getNormalChat = (data) => {
  return request({
    url: `/chat/normal_chat`,
    method: 'post',
    data: data,
  });
};

// 用户注册
export const userRegister = (data) => {
  return request({
    url: `/user/user`,
    method: 'post',
    data: data,
  });
};

// 用户登录
export const userLogin = (data: { username: string; password: string }) => {
  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('password', data.password);

  return request({
    url: `/auth/login`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};


// 用户token信息
export const getTokeninfo = () => {
  return request({
    url: `/user/tokeninfo`,
    method: 'get',
  });
};

// 退出登录
export const userLogout = () => {
  return request({
    url: `/auth/logout`,
    method: 'post',
  });
};


// 全量模版
export const getTemplates = () => {
  return request({
    url: `/llm/templates`,
    method: 'get',
  });
};


// 用户信息
export const getConfigs = () => {
  return request({
    url: `/llm/configs`,
    method: 'get',
  });
};

// 新增
export const addConfigs = (data) => {
  return request({
    url: `/llm/config`,
    method: 'post',
    data: data,
  });
};

// 修改
export const updateConfigs = (data) => {
  return request({
    url: `/llm/config`,
    method: 'put',
    data: data,
  });
};

// 获取制品模版列表
export const template_list = () => {
  return request({
    url: `/artifacts/template_list`,
    method: 'get',
  });
};