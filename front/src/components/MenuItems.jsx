import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems(props) {
  return (
    <Menu
      theme="light"
      mode="horizontal"
      selectable={false}
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "right",
        maxWidth: "500px",
      }}
    >
      <Menu.Item key="/">
        <NavLink to="/">Home</NavLink>
      </Menu.Item>
      {props.isLogged && <>
        <Menu.Item key="/create-funding">
          <NavLink to="/create-funding">Create-Funding</NavLink>
        </Menu.Item>
        <Menu.Item key="/fund">
          <NavLink to="/fund">Fund Page</NavLink>
        </Menu.Item>
        </>
      }
      {!props.isLogged && <>
        <Menu.Item key="/connect">
          Sign in
        </Menu.Item>
        </>
      }
    </Menu>
  );
}

export default MenuItems;
