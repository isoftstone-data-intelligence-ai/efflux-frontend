import { createAppSlice } from "@/utils/redux/createAppSlice";

let initState = () => ({
  sidebarOpen:true,
  language:'en-US',
});

export default createAppSlice({
  name: "global",
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

