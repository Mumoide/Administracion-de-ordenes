import Login from "./pages/Login/Login";
import ForgotPasswordForm from "./pages/Login/ForgotPasswordForm";
import ResetPasswordForm from "./pages/Login/ResetPasswordForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./style.css";
import Menu from "./pages/Menu/Menu";
import User from "./pages/User/User";
import Home from "./pages/Home/Home";
import Order from "./pages/Orders/Order";
import CreateUser from "./pages/User/CreateUser";
import EditUser from "./pages/User/EditUser";
import CreateOrder from "./pages/Orders/CreateOrder";
import EditOrder from "./pages/Orders/EditOrder";
import Stages from "./pages/Stages/Stages";
import EditStages from "./pages/Stages/EditStages";
import CreateStage from "./pages/Stages/CreateStage";
import ViewUser from "./pages/User/ViewUser";
import ViewOrder from "./pages/Orders/ViewOrder";
import ViewStages from "./pages/Stages/ViewStages";
import Error404 from "./pages/Errors/error404";
import RelatedUser from "./pages/RelatedUser/RelatedUser";
import ViewRelatedUser from "./pages/RelatedUser/ViewRelatedUser";
import EditRelateduser from "./pages/RelatedUser/EditRelatedUser";

import withAuthAndRole from "./components/withAuth";

function App() {
  const UserWithAuth = withAuthAndRole(User);
  const ViewUserWithAuth = withAuthAndRole(ViewUser);
  const CreateUserWithAuth = withAuthAndRole(CreateUser);
  const EditUserWithAuth = withAuthAndRole(EditUser);
  // const OrderWithAuth = withAuthAndRole(Order);
  // const ViewOrderWithAuth = withAuthAndRole(ViewOrder);
  const CreateOrderWithAuth = withAuthAndRole(CreateOrder);
  const EditOrderWithAuth = withAuthAndRole(EditOrder);
  // const StagesWithAuth = withAuthAndRole(Stages);
  // const ViewStagesWithAuth = withAuthAndRole(ViewStages);
  // const EditStagesWithAuth = withAuthAndRole(EditStages);
  const CreateStageWithAuth = withAuthAndRole(CreateStage);
  // const MenuWithAuth = withAuthAndRole(Menu);
  const HomeWithAuth = withAuthAndRole(Home);
  const RelatedUserWithAuth = withAuthAndRole(RelatedUser);
  const ViewRelatedUserWithAuth = withAuthAndRole(ViewRelatedUser);
  const EditRelatedUserWithAuth = withAuthAndRole(EditRelateduser);

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Menu />}>
          <Route path="" element={<HomeWithAuth />}></Route>
          <Route path="*" element={<Error404 />} /> {/* Route default */}
          <Route path="/users" element={<UserWithAuth />}></Route>
          <Route path="/viewUser/:id" element={<ViewUserWithAuth />}></Route>
          <Route path="/createuser" element={<CreateUserWithAuth />}></Route>
          <Route path="/userEdit/:id" element={<EditUserWithAuth />}></Route>
          <Route path="/orders" element={<Order />}></Route>
          <Route path="viewOrder/:id" element={<ViewOrder />}></Route>
          <Route path="/createorder" element={<CreateOrderWithAuth />}></Route>
          <Route path="/orderEdit/:id" element={<EditOrderWithAuth />}></Route>
          <Route path="/stages/:id" element={<Stages />}></Route>
          <Route path="/viewStage/:id" element={<ViewStages />}></Route>
          <Route path="/editStages/:id" element={<EditStages />}></Route>
          <Route
            path="/createStage/:id/:number"
            element={<CreateStageWithAuth />}
          ></Route>
          <Route path="/relatedUsers" element={<RelatedUserWithAuth />}></Route>
          <Route
            path="/viewRelatedUser/:id"
            element={<ViewRelatedUserWithAuth />}
          ></Route>
          <Route
            path="relatedUserEdit/:id"
            element={<EditRelatedUserWithAuth />}
          ></Route>
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgotPassword" element={<ForgotPasswordForm />}></Route>
        <Route path="/resetPassword" element={<ResetPasswordForm />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
