/**
 * layout js
 */
import { io } from 'socket.io-client';
import $ from 'jquery';

/* ---- socket.io ---- */
const socket = io();
socket
    .on('connect', () => {
        console.log('socket connect', socket.id);
    })
    .on('disconnect', () => {
        console.log('socket disconnect', socket.id);
    })
    .on('update flay', (flay) => {
        console.log('socket on update flay', flay);
        showNotice('[Flay]', flay.opus, Date.now());
        if (typeof flayBroadcastReceiver === 'function') {
            flayBroadcastReceiver(flay);
        }
    })
    .on('update actress', (actress) => {
        console.log('socket on update actress', actress);
        showNotice('[Actress]', actress.name, Date.now());
        if (typeof actressBroadcastReceiver === 'function') {
            actressBroadcastReceiver(actress);
        }
    })
    .on('update tag', (tag) => {
        console.log('socket on update tag', tag);
        showNotice('[Tag]', tag.name, Date.now());
        if (typeof tagBroadcastReceiver === 'function') {
            tagBroadcastReceiver(tag);
        }
    })
    .on('chat room', (id, message, time) => {
        console.log('chat room', id, message, time);
        showNotice('[Chat]', message, time);
    });

$('#chatInput').on('keyup', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
        socket.emit('chat room', $(e.target).val());
        $(e.target).val('');
    }
})

const showNotice = (title, message, time) => {
    const $notice = $(`
		<div class="notice">
			<div>
				<small class="notice-time">${DateUtils.format(time, 'hh:mi')}</small>
				<span class="notice-title">${title}</span>
			</div>
			<div class="notice-message">${message}</div>
		</div>`).appendTo($('.notice-container'));

    setTimeout(() => {
        $notice.hide();
    }, 1000 * 5);
};
