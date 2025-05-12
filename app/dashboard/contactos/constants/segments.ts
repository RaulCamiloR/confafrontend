interface SegmentConstants {
    pagesSize: number;
    channelTypes: string[]
}

export const segmentConstants: SegmentConstants = {
    pagesSize: 9,
    channelTypes: ['EMAIL', 'SMS', "VOICE"]
}

export type ChannelType = 'EMAIL' | 'VOICE' | 'SMS'
