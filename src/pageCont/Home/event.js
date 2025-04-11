function initEvent(event, parentThis) {
  //新会话
  event.on('newChat', async function () {
    const { changeState } = parentThis;
    changeState({ 
      selectedChat: null, 
      selectedItem: null, 
      messages:[],
      openPreview:false,
    });
    if (window) {
      window.localStorage.setItem('selectedChat', '');
    }

    parentThis.inputFocus();
  });

  //选中回话
  event.on('onChatClick', async function (data) {
    parentThis.changeState({ messages: data });
    parentThis.inputFocus();

    setTimeout(() => {
      parentThis.scrollToBottom();
    }, 30);
  });
}

export { initEvent };
export default { initEvent };
