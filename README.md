## GCloud Configurations

Install the kubectl component for gcloud

```bash
gcloud components install kubectl
```
Initialized gcloud
```bash
gcloud init
```
Connect to our cluster
```bash
gcloud container clusters get-credentials <cluster name>
```

If you receive this error `no endpoints available for service "ingress-nginx-controller-admission`

```bash
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
```

Ingress-Nginx Namespace and Service
```bash
kubectl get services -n ingress-nginx
```
Forward the port

```bash
kubectl  <id-pod> <port>:<port>
```
