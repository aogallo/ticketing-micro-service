## Stripe Setup
create an account in stripe.com

create a secret
```bash
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=<value>
```
