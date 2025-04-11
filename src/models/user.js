import { createAppSlice } from "@/utils/redux/createAppSlice";

let initState = () => ({
  //权限
  authority: [],

  // 用户信息
  user: {
    name: "",
    email: "",
    id: 1,
  },
});

var counterSlice = createAppSlice({
  name: "user",
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

export default counterSlice