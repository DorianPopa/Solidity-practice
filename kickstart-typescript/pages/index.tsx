import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

type HomeProps = {};

const Home: NextPage<HomeProps> = ({}) => {
	return (
		<div className={styles.container}>
			<main className={styles.main}>
				<h1 className={styles.title}>
					Welcome to <a href="/">CrowdCoin!</a>
				</h1>

				<p className={styles.description}>
					The superior version, made with{" "}
					<code className={styles.code}>Typescript and Next.js</code>
				</p>

				<div className={styles.grid}>
					<a href="/campaigns" className={styles.card}>
						<h2>Campaigns</h2>
						<p>Find a great project to contribute to</p>
					</a>

					<a href="https://nextjs.org/learn" className={styles.card}>
						<h2>Learn</h2>
						<p>
							Learn about Next.js in an interactive course with
							quizzes!
						</p>
					</a>

					<a
						href="https://github.com/vercel/next.js/tree/master/examples"
						className={styles.card}
					>
						<h2>Examples</h2>
						<p>
							Discover and deploy boilerplate example Next.js
							projects.
						</p>
					</a>

					<a
						href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
						className={styles.card}
					>
						<h2>Deploy</h2>
						<p>
							Instantly deploy your Next.js site to a public URL
							with Vercel.
						</p>
					</a>
				</div>
			</main>
		</div>
	);
};

export default Home;
