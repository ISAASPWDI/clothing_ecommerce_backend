import { MercadoPagoConfig, Order }  from "mercadopago";
import { envs } from "./envs";

const client = new MercadoPagoConfig({
    accessToken: envs.MERCADOPAGO_ACCESS_TOKEN,
    options: {
        timeout: 5000,
        idempotencyKey: 'abc'
    }
})

const order = new Order(client);

const body = {
	type: "online",
	processing_mode: "automatic",
	total_amount: "1000.00",
	external_reference: "ext_ref_1234",
	payer: {
		email: "<PAYER_EMAIL>",
	},
	transactions: {
		payments: [
			{
				amount: "1000.00",
				payment_method: {
					id: "master",
					type: "credit_card",
					token: "<CARD_TOKEN>",
					installments: 1,
					statement_descriptor: "Store name",
				},
			},
		],
	},
};
const requestOptions = {
	idempotencyKey: "<IDEMPOTENCY_KEY>",
};

// Step 6: Make the request
order.create({ body, requestOptions }).then(console.log).catch(console.error);