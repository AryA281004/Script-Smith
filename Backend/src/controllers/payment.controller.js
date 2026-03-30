const Stripe = require('stripe')
const userModel = require("../models/user.model");
const { CREDIT_MAP } = require('../models/payment.model');


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCreditOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const {amount} = req.body;

        if(!CREDIT_MAP[amount]){
            return res.status(400).json({error: "Invalid credit plan"});
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card','upi'],
            success_url: `${process.env.CLIENT_URL}/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${CREDIT_MAP[amount]} Credits for ScriptSmith`,
                            description: `Purchase ${CREDIT_MAP[amount]} credits to use on ScriptSmith`
                        },
                        unit_amount: amount * 100, // Stripe expects amount in paise
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                userId,
                credits: CREDIT_MAP[amount],
                amount
            }

        })

        res.status(200).json({url: session.url});

    } catch (error) {
        console.error("Error creating credit order:", error);
        res.status(500).json({error: "Failed to create credit order"});
    }
};

const stripeWebhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            console.error("Stripe webhook signature verification failed", err);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata.userId;
            const creditsToAdd = Number(session.metadata.credits);
            const planAmount = Number(session.metadata.amount);

            if (!userId || !creditsToAdd) {
               return res.status(400).send("Invalid metadata in webhook");
            }

            // Determine badge based on selected plan amount
            const BADGE_MAP = {
                50: 'Starter',
                100: 'Intermediate',
                150: 'Pro'
            };

            const badgeToAdd = BADGE_MAP[planAmount];

            // Update user: increment credits, set credit flag, and add badge (only once)
            const user = await userModel.findByIdAndUpdate(
                userId,
                {
                    $inc: { credits: creditsToAdd },
                    $set: { isCreditAvailable: true },
                    ...(badgeToAdd ? { $addToSet: { badges: badgeToAdd } } : {})
                },
                { new: true }
            );

            if (!user) {
                return res.status(404).send('User not found');
            }

            res.status(200).send("Credits and badge (if any) added successfully");

        }
    }
    catch (err) {
        console.error("Stripe webhook error", err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
}

module.exports = {
    createCreditOrder,
    stripeWebhook
}