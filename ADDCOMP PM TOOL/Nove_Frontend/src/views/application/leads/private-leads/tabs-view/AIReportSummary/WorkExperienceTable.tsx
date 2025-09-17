import React from "react";

interface WorkExperience {
    country: string | null;
    to_date: string | null;
    from_date: string | null;
    designation: string | null;
    company_name: string | null;
    location_type: string | null;
    employment_type: string | null;
    company_location: string | null;
    work_description: string | null;
    currently_working: boolean | null;
}

interface Props {
    data: WorkExperience[][];
}

const WorkExperienceTable: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) return <p>No data available</p>;

    return (
        <div className="overflow-x-auto border rounded-md shadow-md">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">From</th>
                        <th className="border p-2">To</th>
                        <th className="border p-2">Designation</th>
                        <th className="border p-2">Company</th>
                        <th className="border p-2">Country</th>
                        <th className="border p-2">Location Type</th>
                        <th className="border p-2">Employment Type</th>
                        <th className="border p-2">Company Location</th>
                        <th className="border p-2">Work Description</th>
                        <th className="border p-2">Currently Working</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((innerArray, i) =>
                        innerArray.map((item, j) => (
                            <tr key={`${i}-${j}`} className="hover:bg-gray-50">
                                <td className="border p-2">{item.from_date || "-"}</td>
                                <td className="border p-2">{item.to_date || "-"}</td>
                                <td className="border p-2">{item.designation || "-"}</td>
                                <td className="border p-2">{item.company_name || "-"}</td>
                                <td className="border p-2">{item.country || "-"}</td>
                                <td className="border p-2">{item.location_type || "-"}</td>
                                <td className="border p-2">{item.employment_type || "-"}</td>
                                <td className="border p-2">{item.company_location || "-"}</td>
                                <td className="border p-2">{item.work_description || "-"}</td>
                                <td className="border p-2">
                                    {item.currently_working ? "Yes" : "No"}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default WorkExperienceTable;
