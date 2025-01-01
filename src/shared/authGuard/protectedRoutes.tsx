import { storagekeysEnum } from "@enums/storage.enum";
import { MainLayout } from "@layouts/MainLayout";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
	const localStorageToken = localStorage.getItem(storagekeysEnum.AUTH_TOKEN);

	return localStorageToken ? <MainLayout /> : <Navigate to="/login"  replace />;
	// return  <MainLayout />
};

export default ProtectedRoutes;