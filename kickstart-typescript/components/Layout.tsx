import React from "react";
import { Container } from "semantic-ui-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type LayoutProps = {
	children?: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<Container>
			<Header />
			{children}
			<Footer />
		</Container>
	);
};
