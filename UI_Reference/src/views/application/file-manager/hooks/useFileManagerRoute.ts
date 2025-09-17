import { useLocation } from "react-router";
import { main_app_routes } from "src/routes/paths";



export const useFileManagerRoute = () => {
    const location = useLocation();
    const s3Path = location.pathname.replace("/file-manager", "").replace(/^\/+/, "")
    const breadcrumbSlices = location.pathname.replace("/file-manager", "").split("/").filter(item => item.trim() !== "")
    const breadcrumbs = breadcrumbSlices.map((path, p_idx) => {
        return { name: path, href: `${main_app_routes.app.fileManager}/${breadcrumbSlices.slice(0, p_idx + 1).join("/")}` }

    })
    console.log("breadcrumbs ==>", breadcrumbs)

    return { s3Path, breadcrumbs: [{ name: "root", href: main_app_routes.app.fileManager }].concat(breadcrumbs) }
}