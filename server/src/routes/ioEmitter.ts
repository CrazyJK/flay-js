import EventEmitter from 'events';

const flayEmitter = new EventEmitter();
const actressEmitter = new EventEmitter();
const tagEmitter = new EventEmitter();

export default {
	flay: flayEmitter,
	actress: actressEmitter,
	tag: tagEmitter,
};