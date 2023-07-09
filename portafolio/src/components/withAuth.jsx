import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const withAuthAndRole = (WrappedComponent) => {
  class WithAuthAndRole extends React.Component {
    render() {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const user = token ? jwt_decode(token) : null;
      const roleId = user ? user.rol_id : null; // Retrieve the role ID from the decoded token
      // Check if both token and roleId are present and roleId is equal to 1
      if (token && roleId && roleId === 1) {
        return <WrappedComponent {...this.props} />;
      } else {
        if (token && roleId && roleId === 2) {
          return <Navigate to="/orders" />; // Redirect to the orders page if roleId is equal to 2
        }
      }
    }
  }

  WithAuthAndRole.displayName = `withAuthAndRole(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithAuthAndRole;
};

export default withAuthAndRole;
