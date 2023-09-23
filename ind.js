const player = {
    host: false,
    playedCell: "",
    roomId: null,
    username: "",
    socketId: "",
    symbol: "X",
    turn: false,
    win: false
};

const socket = io();
// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const roomId = urlParams.get('room');

// if (roomId) {
//     document.getElementById('start').innerText = "Rejoindre";
// }

const usernameInput = document.getElementById('username');

$("#form").on('submit', function(e){
    e.preventDefault();

    player.username = usernameInput.value;
})


// const joinRoom = function () {
//     if (usernameInput.value !== "") {
//         player.username = usernameInput.value;
//         player.socketId = socket.id;
//         player.roomId = this.dataset.room;

//         socket.emit('playerData', player);

//         userCard.hidden = true;
//         waitingArea.classList.remove('d-none');
//         roomsCard.classList.add('d-none');
//     }
// }