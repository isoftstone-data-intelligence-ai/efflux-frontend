document.addEventListener("DOMContentLoaded", function () {
    // 绑定 Yes 按钮 - 仅显示感谢消息
    document.getElementById("feedback-yes")?.addEventListener("click", function () {
        handleFeedbackUI(); // 更新 UI
    });

    // 绑定 No 按钮 - 显示消息并跳转 GitHub
    document.getElementById("feedback-no")?.addEventListener("click", function () {
        handleFeedbackUI();
        createGitHubIssue(); // 跳转 GitHub
    });
});

// 统一处理 UI 变化
function handleFeedbackUI() {
    document.getElementById("feedback-message").style.display = "block";
    document.getElementById("feedback-yes").style.display = "none";
    document.getElementById("feedback-no").style.display = "none";
}

// 仅 No 按钮触发 GitHub Issue 跳转
function createGitHubIssue() {
    const issueTitle = encodeURIComponent("Feedback for " + document.title);
    const issueBody = encodeURIComponent(
        `Feedback: **No**\nPage URL: ${window.location.href}\n问题描述（可选）：`
    );
    const githubIssueUrl = `https://github.com/isoftstone-data-intelligence-ai/efflux-frontend/issues/new?title=${issueTitle}&body=${issueBody}`;
    window.open(githubIssueUrl, "_blank");
}

// 绑定 Yes 按钮 - 发送反馈
function sendFeedback(response) {
  // 更新 UI
  document.getElementById("feedback-message").style.display = "block";
  document.getElementById("feedback-yes").style.display = "none";
  document.getElementById("feedback-no").style.display = "none";

  // 发送到 Google Analytics（仅 Yes 时）
  if (response === "yes") {
    gtag('event', 'feedback', {
      'event_category': 'page_helpfulness',
      'event_label': 'yes',
      'value': 1
    });
  }
}