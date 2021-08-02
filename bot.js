const { VK, Keyboard, getRandomId } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const bot = new HearManager()
const vk = new VK({
    token: 'Токен'
})

vk.updates.on('message_new', bot.middleware);

bot.hear(/кб/i, msg => {
    const kb = Keyboard
    .keyboard([[
        Keyboard.callbackButton({
            label: 'Тест',
            payload: {
                id: msg.senderId
            }
        })
    ]])
    .inline()
    msg.send({ keyboard: kb, message: 'a' })
})

bot.hear(/профиль/i, msg => {
    const kb = Keyboard //Делаем callback клавиатуру, ивенты которой отлавливаются ниже (vk.updates.on('message_event'))
    .keyboard([[
        Keyboard.callbackButton({
            label: 'Кикнуть',
            payload: {
                id: msg.replyMessage.senderId,
                cmd: 'kick'
            }
        }),
        Keyboard.callbackButton({
            label: 'Забанить',
            payload: {
                id: msg.replyMessage.senderId,
                cmd: 'ban'
            }
        })
    ]])
    .inline()
    msg.send({ keyboard: kb, message: 'Представим что тут профиль...' })
})

bot.hear(/инлайн/i, msg => {
    const kb = Keyboard
    .keyboard([[
        Keyboard.textButton({
            label: 'Тест',
            payload: {
                id: msg.senderId
            }
        })
    ]])
    .inline()
    msg.send({ keyboard: kb, message: 'a' })
})

bot.hear(/тест/i, msg => {
    if(!msg.messagePayload) return //Если пейлоада нет, то команда не вызывается
    msg.send(`Пейлоад кнопки - ${msg.messagePayload.id}`)
})

vk.updates.on('message_event', msg => {
    if(msg.eventPayload.cmd == 'kick') return vk.api.messages.send({ message: `@id${msg.eventPayload.id} был кикнут`, random_id: 1, peer_id: msg.peerId })
    if(msg.eventPayload.cmd == 'ban') return vk.api.messages.send({ message: `@id${msg.eventPayload.id} был забанен`, random_id: 1, peer_id: msg.peerId })
})

vk.updates.start()