import { supabase } from './supabase-client'

class RealtimeService {
    constructor() {
        this.channels = new Map()
    }

    subscribe(tableName, filterColumn, filterValue, callback) {
        const channelName = `${tableName}-realtime-${filterColumn}-${filterValue}`
        if (this.channels.has(channelName)) this.unsubscribe(channelName)

        const channel = supabase
            .channel(channelName)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: tableName,
                filter: `${filterColumn}=eq.${filterValue}`
            }, (payload) => {
                const event = {
                    type: tableName,
                    event: payload.eventType,
                    data: payload.new || payload.old,
                    old: payload.old,
                    new: payload.new,
                    timestamp: new Date().toISOString()
                }
                callback && callback(event)
            })
            .subscribe()

        this.channels.set(channelName, channel)
        return channel
    }

    subscribeToAll(tableName, callback) {
        const channelName = `${tableName}-realtime-all`
        if (this.channels.has(channelName)) this.unsubscribe(channelName)
        const channel = supabase
            .channel(channelName)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: tableName
            }, (payload) => {
                const event = {
                    type: tableName,
                    event: payload.eventType,
                    data: payload.new || payload.old,
                    old: payload.old,
                    new: payload.new,
                    timestamp: new Date().toISOString()
                }
                callback && callback(event)
            })
            .subscribe()
        this.channels.set(channelName, channel)
        return channel
    }

    unsubscribe(channelName) {
        const channel = this.channels.get(channelName)
        if (channel) {
            channel.unsubscribe()
            this.channels.delete(channelName)
        }
    }

    unsubscribeAll() {
        for (const [name, ch] of this.channels) ch.unsubscribe()
        this.channels.clear()
    }
}

export const realtimeService = new RealtimeService()


