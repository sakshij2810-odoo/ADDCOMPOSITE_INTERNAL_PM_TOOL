import calendly_base_api from "src/utils/calendly-base-api";

interface ICalendlyUser {
    avatar_url: string | null,
    created_at: string, // "2025-03-18T14:57:35.825754Z",
    current_organization: string, // "https://api.calendly.com/organizations/c08b3e3d-cabc-4235-8cbe-c458c59f63e5",
    email: string, // "ramesh@edgenroots.com",
    locale: string, // "en",
    name: string, // "Ramesh",
    resource_type: string, // "User",
    scheduling_url: string, // "https://calendly.com/ramesh-edgenroots",
    slug: string, // "ramesh-edgenroots",
    timezone: string, // "America/New_York",
    updated_at: string, // "2025-03-29T12:34:08.749188Z",
    uri: string, // "https://api.calendly.com/users/da7fa1bc-869a-44cb-bc22-d6732908fb9c"
}



export interface CalendarEvent {
    external_id: string
    kind: string
}

export interface EventMembership {
    buffered_end_time: string
    buffered_start_time: string
    user: string
    user_email: string
    user_name: string
}

export interface InviteesCounter {
    active: number
    limit: number
    total: number
}

export interface EventLocation {
    join_url: string,
    type: string,
}

export interface IUserAppointmentData {
    calendar_event: CalendarEvent
    created_at: string
    end_time: string
    event_guests: any[]
    event_memberships: EventMembership[]
    event_type: string
    invitees_counter: InviteesCounter
    location: EventLocation
    meeting_notes_html: any
    meeting_notes_plain: any
    name: string
    start_time: string
    status: string
    updated_at: string
    uri: string
}

export interface IUserAppointment extends EventMembership, EventLocation {
    calendar_event: CalendarEvent
    created_at: string
    end_time: string
    event_guests: any[]
    event_memberships: EventMembership[]
    event_type: string
    invitees_counter: InviteesCounter
    location: EventLocation
    meeting_notes_html: any
    meeting_notes_plain: any
    name: string
    start_time: string
    status: string
    updated_at: string
    uri: string
}

export const calendlyFetchCurrentUserInfoAsync = () => new Promise<ICalendlyUser>(async (resolve, reject) => {
    try {
        const response = await calendly_base_api.get(`/users/me`);
        resolve(response.data.resource);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        reject(error)
    }
})


const convertCalendlyDataAppointmentDataToUserAppointment = (calendlyData: IUserAppointmentData[]): IUserAppointment[] => {
    return calendlyData.map(data => ({
        ...data,
        join_url: data.location.join_url,
        type: data.location.type,
        ...data.event_memberships
    } as any))
}

export const calendlyFetchUserAppointmentsUsingEmail = (email: string) => new Promise<IUserAppointment[]>(async (resolve, reject) => {
    try {
        const { uri: user } = await calendlyFetchCurrentUserInfoAsync()
        const response = await calendly_base_api.get(`/scheduled_events?user=${user}&invitee_email=${email}`);
        const res_data = response.data.collection as IUserAppointmentData[]

        resolve(convertCalendlyDataAppointmentDataToUserAppointment(res_data))
    } catch (error) {
        console.error("Error fetching appointments:", error);
        reject(error)
    }
})