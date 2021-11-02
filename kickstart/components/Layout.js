import React from "react";
import { Container } from "semantic-ui-react";
import Header from "../components/Header";

const Layout = (props) => {
	return (
		<Container style={{ marginTop: "10px" }}>
			<Header />
			{props.children}
		</Container>
	);
};

export default Layout;
