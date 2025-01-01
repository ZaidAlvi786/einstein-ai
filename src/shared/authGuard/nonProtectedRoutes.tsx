import { storagekeysEnum } from "@enums/storage.enum";
import { AuthLayout } from "@layouts/AuthLayout";
import { Navigate } from "react-router-dom";

const NonProtectedRoutes = () => {
	const localStorageToken = localStorage.getItem(storagekeysEnum.AUTH_TOKEN);

	return !localStorageToken ? <AuthLayout /> : <Navigate to="/"  replace />;
	// return <AuthLayout />;
};

export default NonProtectedRoutes;