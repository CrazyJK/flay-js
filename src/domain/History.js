function format(date) {
	function zf(n) {
		return n < 10 ? '0' + n : n;
	}
	return 'yyyy-mm-dd hh:mi:ss'.replace(/(yyyy|mm|dd|hh|mi|ss)/gi, function ($1) {
		switch ($1) {
			case 'yyyy':
				return date.getFullYear();
			case 'mm':
				return zf(date.getMonth() + 1);
			case 'dd':
				return zf(date.getDate());
			case 'hh':
				return zf(date.getHours());
			case 'mi':
				return zf(date.getMinutes());
			case 'ss':
				return zf(date.getSeconds());
			default:
				return $1;
		}
	});
}

export default class History {
	constructor(date, opus, action, desc) {
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

	matchAll(keyword) {
		return this.matchDate(keyword) || this.matchOpus(keyword) || this.matchAction(keyword) || this.matchDesc(keyword);
	}

	matchDate(date) {
		return this.date.startsWith(date);
	}

	matchOpus(opus) {
		return this.opus === opus;
	}

	matchAction(action) {
		return this.action.toLowerCase() === action.toLowerCase();
	}

	matchDesc(desc) {
		return this.desc.indexOf(desc) > -1;
	}

	toString() {
		return `${this.date}, ${this.opus}, ${this.action}, ${this.desc}`;
	}
}
