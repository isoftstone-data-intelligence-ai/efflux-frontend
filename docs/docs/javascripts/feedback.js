document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("feedback-yes").addEventListener("click", function () {
        sendFeedback("yes");
    });

    document.getElementById("feedback-no").addEventListener("click", function () {
        sendFeedback("no");
    });

    function sendFeedback(response) {
        // 这里可以改成发送数据到 Google Analytics、Firebase 或其他后端服务
        console.log("Feedback received:", response);
        
        // 显示感谢消息
        document.getElementById("feedback-message").style.display = "block";
        
        // 隐藏按钮
        document.getElementById("feedback-yes").style.display = "none";
        document.getElementById("feedback-no").style.display = "none";
    }
});

# Collect feedback through issue
function sendFeedback(response) {
    let issueTitle = encodeURIComponent("Feedback for " + document.title);
    let issueBody = encodeURIComponent(
        `User feedback: **${response.toUpperCase()}**\n\nPage URL: ${window.location.href}`
    );

    let githubIssueUrl = `https://github.com/YOUR_USERNAME/YOUR_REPO/issues/new?title=${issueTitle}&body=${issueBody}`;

    window.open(githubIssueUrl, "_blank");
}