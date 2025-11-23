import { supabase } from './supabase-client'

class RealtimeService {
    constructor() {
        this.channels = new Map()
    }

    subscribe(tableName, filterColumn, filterValue, callback) {
        // Đảm bảo filterValue là string để so sánh đúng
        const filterValueString = String(filterValue).trim()
        const channelName = `${tableName}-realtime-${filterColumn}-${filterValueString}`

        // Unsubscribe channel cũ nếu đã tồn tại
        if (this.channels.has(channelName)) {
            console.log(`🔌 [REALTIME] Unsubscribing existing channel: ${channelName}`)
            this.unsubscribe(channelName)
        }

        console.log(`📡 [REALTIME] Subscribing to ${tableName} where ${filterColumn}=${filterValueString} (type: ${typeof filterValueString})`)

        const channel = supabase
            .channel(channelName)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: tableName,
                filter: `${filterColumn}=eq.${filterValueString}`
            }, (payload) => {
                console.log(`📡 [REALTIME] Event received for ${tableName}:`, {
                    eventType: payload.eventType,
                    new: payload.new,
                    old: payload.old
                })

                const event = {
                    type: tableName,
                    event: payload.eventType,
                    data: payload.new || payload.old,
                    old: payload.old,
                    new: payload.new,
                    timestamp: new Date().toISOString()
                }

                if (callback) {
                    callback(event)
                } else {
                    console.warn(`📡 [REALTIME] No callback provided for ${channelName}`)
                }
            })
            .subscribe((status) => {
                console.log(`📡 [REALTIME] Subscription status for ${channelName}:`, status)
                if (status === 'SUBSCRIBED') {
                    console.log(`✅ [REALTIME] Successfully subscribed to ${channelName}`)
                } else if (status === 'CHANNEL_ERROR') {
                    console.error(`❌ [REALTIME] Channel error for ${channelName}`)
                } else if (status === 'TIMED_OUT') {
                    console.warn(`⏱️ [REALTIME] Subscription timed out for ${channelName}`)
                } else if (status === 'CLOSED') {
                    console.log(`🔌 [REALTIME] Channel closed for ${channelName}`)
                }
            })

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


