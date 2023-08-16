function getCookie(sKey) {
  if (!sKey) {
    return null;
  }
  return (
    decodeURIComponent(
      document.cookie.replace(
        new RegExp(
          "(?:(?:^|.*;)\\s*" +
            encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
            "\\s*\\=\\s*([^;]*).*$)|^.*$"
        ),
        "$1"
      )
    ) || null
  );
}

const userData = JSON.parse(getCookie("user"));
const senderId = userData._id;
const socket = io("/chat-namespace", {
  auth: {
    token: senderId,
  },
});
let receiverId = "";
$(document).ready(function () {
  $(".user-list").click(function () {
    receiverId = $(this).attr("data-id");
    $(".start-head").hide();
    $(".chat-section").show();
    socket.emit("existChat", { senderId: senderId, receiverId: receiverId });
  });
});
//socket code here //

socket.on("getUserOnline", function (data) {
  $("#" + data.user_id + "-status").text("Online");
  $("#" + data.user_id + "-status").removeClass("offline-status");
  $("#" + data.user_id + "-status").addClass("online-status");
});
socket.on("getUserOffline", function (data) {
  $("#" + data.user_id + "-status").text("Offline");
  $("#" + data.user_id + "-status").removeClass("online-status");
  $("#" + data.user_id + "-status").addClass("offline-status");
});

// load chat via socket
socket.on("loadChat", function (data) {
  let html = `<div class="other-user-chat"><h5>${data?.message} </h5></div>`;
  $("#chat-container").append(html);
});
socket.on("loadChats", function (data) {
  $("#chat-container").html("");
  let html = "";
  const chatData = data.chats;
  let addClass = "";
  for (let oldChat of chatData) {
    if (oldChat.sender_id === senderId) {
      addClass = "current-user-chat";
    } else {
      addClass = "other-user-chat";
    }
    html += `<div class=${addClass}><h5>${oldChat.message} </h5></div>`;
  }
  $("#chat-container").append(html);
});
