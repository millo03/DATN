export function handle_socket_event(io) {
    io.on("connect", (socket) => {
        console.log(`Client ID ${socket.id} connect to socket!`);
        socket.on("send_message_delete_item", (data) => {
            io.emit('res_message_delete_item', data)
        })

        socket.on('confirm_granting_premission_account', (data) => {
            io.emit('notification_granting_premission_account', data)
        })

        socket.on('create_seller_message', (data) => {
            io.emit('res_seller_message', data)
        })

        socket.on('send_status_item_order_to_user', (data) => {
            io.emit('res_status_item_order_to_user', data)
        })

        socket.on("disconnect", () => {
            console.log('Client disconnected!')
        })
    })
}