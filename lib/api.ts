import request from '@/lib/request';
var apiUrl = process.env.NEXT_PUBLIC_API_URL;

//列表
export const getServerList = (data) => {
  return request({
    url: `/mcp/mcp_server_list/${data.userId}`,
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
    url: `/chat_window/chat_window_list/${data.userId}`,
    method: 'get',
  });
};