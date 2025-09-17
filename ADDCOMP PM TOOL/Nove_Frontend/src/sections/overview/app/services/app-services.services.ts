import { AxiosResponse } from "axios";
import moment from "moment";
import { IPrivateLead } from "src/redux";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api"

const getCount = (respose: PromiseSettledResult<AxiosResponse<any, any>>): number => {
    if (respose.status !== 'fulfilled') return 0
    return respose?.value.data.data?.length > 0 ? respose?.value.data.data[0].count : 0
}

export const fetchGeneralRecordCountAsync = () => new Promise<{ leadsCount: number, customerCount: number, userCount: number, }>(async (resolve, reject) => {
    try {
        const [leadsRes, customerRes, userRes] = await Promise.allSettled([
            axios_base_api.get(`${server_base_endpoints.general.get_record_counts}?table_name=latest_leads`),
            axios_base_api.get(`${server_base_endpoints.general.get_record_counts}?table_name=latest_customer_personal_information`),
            axios_base_api.get(`${server_base_endpoints.general.get_record_counts}?table_name=latest_user`),
        ]);
        resolve({
            leadsCount: getCount(leadsRes),
            customerCount: getCount(customerRes),
            userCount: getCount(userRes)
        })
    } catch (error) {
        reject(error)
    } finally {
        resolve({
            leadsCount: 0,
            customerCount: 0,
            userCount: 0,
        })
    }
})



export const fetchGeneralRecordCountAsyncV2 = () => new Promise<{
    leads: {
        count: number,
        growth: number
    }, customers: {
        count: number,
        growth: number
    }, users: {
        count: number,
        growth: number
    },
    pending_invoices: { count: number, growth: number },
    paid_invoices: { count: number, growth: number },
    partially_paid_invoices: { count: number, growth: number },
}>((resolve, reject) => {
    const sevenDaysBefore = moment().subtract(7, 'days').format("YYYY-MM-DD");
    const toDate = moment().add(1, 'days').format("YYYY-MM-DD")
    axios_base_api.get(`${server_base_endpoints.analytics.get_analytics}?from_date=${sevenDaysBefore}&to_date=${toDate}`).then((res) => {
        const data = res.data.data
        resolve({
            leads: {
                count: data[0].count_leads,
                growth: data[0].growth
            },
            customers: {
                count: data[1].count_customer,
                growth: data[1].growth
            },
            users: {
                count: data[2].count_user,
                growth: data[2].growth
            },
            pending_invoices: { count: data[3].customer_invoice_PENDING ?? 0, growth: data[3].growth },
            partially_paid_invoices: { count: data[4].customer_invoice_PARTIALLY_PAID ?? 0, growth: data[4].growth },
            paid_invoices: { count: data[5].customer_invoice_PAID ?? 0, growth: data[5].growth },
        })
    }).catch((error) => {
        reject(error)
    }).finally(() => {
        resolve({
            leads: {
                count: 0,
                growth: 0
            }, customers: {
                count: 0,
                growth: 0
            }, users: {
                count: 0,
                growth: 0
            },
            pending_invoices: { count: 0, growth: 0 },
            paid_invoices: { count: 0, growth: 0 },
            partially_paid_invoices: { count: 0, growth: 0 },
        })
    })
})

export const fetchLatestLeadsAsync = () => new Promise<IPrivateLead[]>(async (resolve, reject) => {
    axios_base_api.get(`${server_base_endpoints.leads.leads.get_private_leads}?pageNo=1&itemPerPage=3`).then((res) => {
        resolve(res.data.data)
    }).catch(error => {
        reject(error)
    }).finally(() => {
        resolve([])
    })
})