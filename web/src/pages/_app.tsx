import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import { createClient, Provider } from "urql";
import theme from "../theme";

const client = createClient({
	url: "http://localhost:4000/graphql",
	fetchOptions: {
		credentials: "include",
	},
	exchanges: [multipartFetchExchange],
});

function MyApp({ Component, pageProps }) {
	return (
		<Provider value={client}>
			<ChakraProvider resetCSS theme={theme}>
				<ColorModeProvider
					options={{
						useSystemColorMode: true,
					}}
				>
					<Component {...pageProps} />
				</ColorModeProvider>
			</ChakraProvider>
		</Provider>
	);
}

export default MyApp;
