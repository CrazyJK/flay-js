function format(date: Date) {
	function zf(n: number): string {
		return n < 10 ? '0' + n : String(n);
	}

	return 'yyyy-mm-dd hh:mi:ss'
		.replace(/(yyyy)/gi, date.getFullYear().toString())
		.replace(/(mm)/gi, zf(date.getMonth() + 1))
		.replace(/(dd)/gi, zf(date.getDate()))
		.replace(/(hh)/gi, zf(date.getHours()))
		.replace(/(mi)/gi, zf(date.getMinutes()))
		.replace(/(ss)/gi, zf(date.getSeconds()));
}

export enum Action {
	PLAY = 'PLAY',
	DELETE = 'DELETE',
}

export default class History {
	date: string;
	opus: string;
	action: Action;
	desc: string;

	constructor(date: string | Date, opus: string, action: Action, desc: string) {
		if (date instanceof Date) {
			this.date = format(date);
		} else if (typeof date === 'number') {
			this.date = format(new Date(date));
		} else {
			this.date = date;
		}

		this.opus = opus;
		this.action = action;
		this.desc = desc;
	}

	matchAll(keyword: string | Action) {
		return this.matchDate(keyword) || this.matchOpus(keyword) || this.matchAction(keyword) || this.matchDesc(keyword);
	}

	matchDate(date: string) {
		return this.date.startsWith(date);
	}

	matchOpus(opus: string) {
		return this.opus === opus;
	}

	matchAction(action: Action | string) {
		return this.action.toLowerCase() === action.toLowerCase();
	}

	matchDesc(desc: string) {
		return this.desc.indexOf(desc) > -1;
	}

	toString() {
		return `${this.date}, ${this.opus}, ${this.action}, ${this.desc}`;
	}
}
