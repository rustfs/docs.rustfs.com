---
title: "Kubernetes Upgrade"
description: "Upgrade RustFS deployments managed by the Helm chart or RustFS Operator and verify each rollout."
---

Upgrade a Kubernetes deployment through the tool that owns its resources. Use Helm for a direct RustFS Helm chart installation. For an Operator installation, upgrade the Operator release and each Tenant through their respective declarative configurations.

## Before you upgrade

Read the RustFS, chart, and Operator release notes that apply to your deployment. Confirm that the cluster has enough capacity to replace pods and that all current workloads are ready:

```bash
kubectl get nodes
kubectl -n <namespace> get pods,pvc
```

Do not delete PersistentVolumeClaims (PVCs) during an upgrade or rollback. Keep the existing deployment values and manifests under version control, including any image tags, storage topology, scheduling rules, and Secret references.

## Upgrade a Helm chart deployment

This workflow applies to RustFS installed directly with the [RustFS Helm chart](/installation/cloud-native/helm-chart/installation). It does not apply to a Tenant created by RustFS Operator.

Record the current release revision, chart version, application version, and effective user-supplied values:

```bash
helm status rustfs --namespace rustfs
helm history rustfs --namespace rustfs
helm get values rustfs --namespace rustfs -o yaml > rustfs-values.previous.yaml
```

Prepare the target chart in the same way as the installation. If you use the chart repository, update its index and set the chart reference:

```bash
helm repo update rustfs
export RUSTFS_CHART=rustfs/rustfs
```

If you use a source checkout, check out the target RustFS release and point `RUSTFS_CHART` at its chart directory:

```bash
export RUSTFS_CHART=./helm/rustfs
```

Update your maintained values file for any release-specific changes. Set `image.rustfs.tag` to the explicit RustFS version you intend to run, then apply the upgrade:

```bash
helm upgrade rustfs "$RUSTFS_CHART" \
	--namespace rustfs \
	-f <values-file> \
	--set-string image.rustfs.tag=<target-version> \
	--wait \
	--timeout 10m
```

Helm performs a rolling update. Monitor the release and pods until the rollout completes:

```bash
helm status rustfs --namespace rustfs
kubectl -n rustfs get pods,pvc,services
```

Distributed mode creates a StatefulSet:

```bash
kubectl -n rustfs rollout status statefulset/rustfs --timeout=10m
```

Standalone mode creates a Deployment:

```bash
kubectl -n rustfs rollout status deployment/rustfs --timeout=10m
```

Verify the S3 API after the rollout. If it is not exposed outside the cluster, start the port forward documented in the installation guide first:

```bash
curl -fsS http://localhost:9000/health/ready
```

### Roll back a Helm release

List the release history, identify the last working revision, and let Helm restore its chart, values, and image configuration:

```bash
helm history rustfs --namespace rustfs
helm rollback rustfs <previous-revision> \
	--namespace rustfs \
	--wait \
	--timeout 10m
```

Check the workload and readiness endpoint again after rollback. Do not uninstall the release or delete its PVCs.

## Upgrade an Operator deployment

An Operator deployment has two independent upgrade surfaces:

- The RustFS Operator and Operator Console run from the `rustfs-operator` Helm release.
- Each Tenant runs the RustFS image declared in that Tenant's `spec.image` field.

Upgrade and validate the Operator control plane before changing Tenant images. Do not combine an Operator upgrade with multiple Tenant upgrades in one maintenance step.

### Upgrade the Operator release

Record the current release and save its values:

```bash
helm status rustfs-operator --namespace rustfs-system
helm history rustfs-operator --namespace rustfs-system
helm get values rustfs-operator --namespace rustfs-system -o yaml \
	> rustfs-operator-values.previous.yaml
```

Update the Operator source checkout to the target release and review changes to its chart values and CustomResourceDefinitions (CRDs). Helm does not upgrade CRDs stored in a chart's `crds/` directory, so apply both target CRDs before upgrading the controller:

```bash
kubectl apply --server-side --force-conflicts \
	--field-manager=rustfs-operator-crd-upgrade \
	-f deploy/rustfs-operator/crds/tenant.yaml
kubectl apply --server-side --force-conflicts \
	--field-manager=rustfs-operator-crd-upgrade \
	-f deploy/rustfs-operator/crds/policybinding-crd.yaml
```

The CRDs are cluster-scoped and shared by every Tenant namespace. Applying them first allows the Kubernetes API server to accept fields introduced by the new controller. After both commands succeed, upgrade the Operator with your maintained values file:

```bash
helm upgrade rustfs-operator deploy/rustfs-operator/ \
	--namespace rustfs-system \
	-f <operator-values-file> \
	--set-string operator.image.tag=<target-operator-version> \
	--set-string console.image.tag=<target-operator-version> \
	--wait \
	--timeout 10m
```

Verify the CRDs and all control-plane components before upgrading a Tenant:

```bash
kubectl get crd tenants.rustfs.com
kubectl -n rustfs-system rollout status deployment/rustfs-operator --timeout=10m
kubectl -n rustfs-system rollout status deployment/rustfs-operator-console --timeout=10m
kubectl get tenants --all-namespaces
```

CRD changes are not part of Helm release history and `helm rollback` does not restore them. Review the target release's compatibility and migration notes before considering a controller rollback. If that release explicitly supports downgrading, restore the previous Helm revision without applying older CRD files:

```bash
helm history rustfs-operator --namespace rustfs-system
helm rollback rustfs-operator <previous-revision> \
	--namespace rustfs-system \
	--wait \
	--timeout 10m
```

Do not downgrade across a documented one-way workload or security migration. Roll forward to a fixed Operator release instead.

### Upgrade a Tenant

The Operator owns each Tenant's StatefulSets. Do not change their container images directly because reconciliation restores the image declared by the Tenant.

Record the current Tenant image and confirm its `Ready` condition:

```bash
kubectl -n storage-a get tenant tenant-a \
	-o jsonpath='{.spec.image}{"\n"}'
kubectl -n storage-a get tenant tenant-a
kubectl -n storage-a get pods,pvc -l rustfs.tenant=tenant-a
```

In the complete `tenant.yaml` used to install the Tenant, change only `spec.image` to `rustfs/rustfs:<target-version>`. Leave its pools, PVC templates, credentials, and other settings unchanged. Apply the complete manifest and wait for the Operator to reconcile the new generation:

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a wait tenant/tenant-a \
	--for=condition=Ready \
	--timeout=10m
kubectl -n storage-a get pods -l rustfs.tenant=tenant-a
```

Upgrade one Tenant at a time. Confirm its S3 API and [cluster status](/operations/status-check) before updating another Tenant.

### Roll back a Tenant

Restore the previously recorded image in `spec.image`, apply the complete Tenant manifest, and wait for `Ready` again:

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a wait tenant/tenant-a \
	--for=condition=Ready \
	--timeout=10m
```

The Operator reuses the Tenant's existing PVCs. Do not delete the Tenant, its StatefulSets, or its PVCs during rollback.

## Next steps

Review [Status Check](/operations/status-check) and [Observability](/operations/observability) to validate the deployment after the rollout.