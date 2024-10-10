import { IEventInfo } from './event.type';

export type EventHandler = (eventRecord: IEventInfo) => Promise<void>;
