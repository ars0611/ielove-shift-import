export type CalendarEventItem = {
    id?: string;
    extendedProperties?: {
        private?: {
            source?: string;
        };
    };
};

export type CalendarEventsListResponse = {
    items?: Array<CalendarEventItem>
}

export type CalendarEventIdSourcePair = {
    id?: string;
    source?: string;
};
