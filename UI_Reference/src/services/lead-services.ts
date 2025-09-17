import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api"




export const downloadLeadReportPdfAync = async (uuid: string) => {
    try {
        const response = await axios_base_api.get(`${server_base_endpoints.leads.leads.get_private_lead_reports}?leads_uuid=${uuid}&is`, {
            responseType: "arraybuffer", // Ensure the response is in a binary format
        })
        const blob = new Blob([response.data], {
            type: "application/pdf",
        });
        // const blob = new Blob([res.data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);

        // Create a link element and simulate a click to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.pdf"); // Set the desired file name and extension
        document.body.appendChild(link);
        link.click();

        // Clean up by revoking the URL object
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    } catch (error) {
        alert(error?.message)
    }
}