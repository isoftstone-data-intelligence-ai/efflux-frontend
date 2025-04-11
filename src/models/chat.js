import { createAppSlice } from '@/utils/redux/createAppSlice';

let initState = () => ({
  // 会话列表
  chatsList: [],

  // 选中的会话
  selectedChat: null,

  // 选中的会话item
  selectedItem: null,

  // 模型模板列表
  templatesList: [],

  //选中的模型
  selectedModel: '',

  // 用户配置
  userConfigs: [],

  // 聊天记录
  messages: [],

  // 聊天记录loading
  msgLoading: false,

  // 聊天加载状态
  chatLoading: false,

  // 预览侧边栏
  openPreview: false,

  // 生成的代码的部分
  fragment: {},

  // 预览地址
  codeResult: {},

  // 当前选中index
  itemIndex: 0,
  
  // tab
  currentTab: 'code',

  //mcp弹窗
  mcpServerOpen: false,
});

var counterSlice = createAppSlice({
  name: 'chat',
  initialState: { ...initState() },
  reducers: (create) => ({
    setState(state, action) {
      return { ...state, ...action.payload };
    },
    init(state, action) {
      return { ...initState(), ...action.payload };
    },
  }),
});

export default counterSlice;
