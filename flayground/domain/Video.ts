import { Tag } from './Tag';

export interface Video {
	opus: string;
	rank: number;
	play: number;
	lastAccess: number;
	titie: string | null;
	description: string | null;
	tags: Tag[];
}
