import React from "react";
import { LinearProgress } from "@mui/material";
import { ILoadState } from "src/redux/store.enums";
import { useAppDispatch } from "src/redux";
import axios_base_api from "src/utils/axios-base-api";

interface IAppConfigContext {
    companyName: string;
    logo: string;
    favIcon: string;
}

export const AppConfigurationContext = React.createContext<IAppConfigContext>({
    companyName: "",
    logo: "",
    favIcon: "",
});

export const useAppConfiguration = () => React.useContext(AppConfigurationContext);

export const AppConfigurationProvider: React.FC<{ children: React.ReactNode }> = (
    props
) => {
    const [companyName, setCompanyName] = React.useState<string>("");
    const [logo, setLogo] = React.useState<string>("");
    const [favIcon, setFavIcon] = React.useState<string>("");
    const [loading, setLoading] = React.useState<ILoadState>(ILoadState.idle);
    // const { user } = useAuthContext();
    const dispatch = useAppDispatch();

    const fetchAppConfig = async () => {
        const localConfig = localStorage.getItem("config");

        if (localConfig) {
            const { companyName, logo, favIcon } = JSON.parse(localConfig);
            console.log("#logo1", logo);
            setCompanyName(companyName);
            setLogo(logo);
            setFavIcon(favIcon);
            setLoading(ILoadState.succeeded);
        }
        try {
            setLoading(ILoadState.pending);
            const response = await axios_base_api.get(
                "/companyInformation/get-public-company-information"
            );

            const companyData = response.data.data[0];

            const configData = {
                companyName: companyData.company_name,
                logo: companyData.preview_logo,
                favIcon: companyData.preview_fav_icon,
            };

            setCompanyName(configData.companyName);
            setLogo(configData.logo);
            setFavIcon(configData.favIcon);
            localStorage.setItem("config", JSON.stringify(configData));
            setLoading(ILoadState.succeeded);
        } catch (err: any) {
            setLoading(ILoadState.failed);
            //   dispatch(
            //     showMessage({
            //       type: "error",
            //       message: err.response.data.message,
            //       displayAs: "snackbar",
            //     })
            //   );
        }
    };

    React.useEffect(() => {
        fetchAppConfig();
    }, []);

    // if (!user.isLogin) {
    //   return <>{props.children}</>;
    // }

    // if (loading !== ILoadState.succeeded) {
    //     return <LinearProgress />;
    // }

    return (
        <AppConfigurationContext.Provider value={{ companyName, logo, favIcon }}>
            {props.children}
        </AppConfigurationContext.Provider>
    );
};
