import React from "react";
import Image from "next/image";
import styles from "../styles/Footer.module.css";

type FooterProps = {};

export const Footer: React.FC<FooterProps> = ({}) => {
	return (
		<div className={styles.footer}>
			<a
				href="https://nextjs.org/"
				target="_blank"
				rel="noopener noreferrer"
			>
				Powered by Next.js by
				<span className={styles.logo}>
					<Image
						src="/vercel.svg"
						alt="Vercel Logo"
						width={72}
						height={16}
					/>
				</span>
			</a>
		</div>
	);
};
