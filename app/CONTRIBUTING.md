From https://github.com/containous/traefik/blob/master/MAINTAINER.md

	
# Proposal

## Labels

If we open/look an issue/PR, we must add a `kind/*`, an `area/*` and a `status/*`.

### Contributor

* `contributor/need-more-information`: we need more information from the contributor in order to analyze a problem.
* `contributor/waiting-for-feedback`: we need the contributor to give us feedback.
* `contributor/waiting-for-corrections`: we need the contributor to take actions in order to move forward with a PR. **(only for PR)** _[bot, humans]_
* `contributor/needs-resolve-conflicts`: use it only when there is some conflicts (and an automatic rebase is not possible). **(only for PR)** _[bot, humans]_

### Kind

* `kind/enhancement`: a new or improved feature.
* `kind/question`: It's a question. **(only for issue)**
* `kind/proposal`: proposal PR/issues need a public debate.
  * _Proposal issues_ are design proposal that need to be refined with multiple contributors.
  * _Proposal PRs_ are technical prototypes that need to be refined with multiple contributors.

* `kind/bug/possible`: if we need to analyze to understand if it's a bug or not. **(only for issues)**
* `kind/bug/confirmed`: we are sure, it's a bug. **(only for issues)**
* `kind/bug/fix`: it's a bug fix. **(only for PR)**

### Resolution

* `resolution/duplicate`: it's a duplicate issue/PR.
* `resolution/declined`: Rule #1 of open-source: no is temporary, yes is forever.
* `WIP`: Work In Progress. **(only for PR)**

### Platform

* `platform/windows`: Windows related.

### Area

* `area/acme`: ACME related.
* `area/api`: Traefik API related.
* `area/authentication`: Authentication related.
* `area/cluster`: Traefik clustering related.
* `area/documentation`: regards improving/adding documentation.
* `area/infrastructure`: related to CI or Traefik building scripts.
* `area/healthcheck`: Health-check related.
* `area/logs`: Traefik logs related.
* `area/middleware`: Middleware related.
* `area/middleware/metrics`: Metrics related. (Prometheus, StatsD, ...)
* `area/oxy`: Oxy related.
* `area/provider`: related to all providers.
* `area/provider/boltdb`: Boltd DB related.
* `area/provider/consul`: Consul related.
* `area/provider/docker`: Docker and Swarm related.
* `area/provider/ecs`: ECS related.
* `area/provider/etcd`: Etcd related.
* `area/provider/eureka`: Eureka related.
* `area/provider/file`: file provider related.
* `area/provider/k8s`: Kubernetes related.
* `area/provider/marathon`: Marathon related.
* `area/provider/mesos`: Mesos related.
* `area/provider/rancher`: Rancher related.
* `area/provider/zk`: Zoo Keeper related.
* `area/sticky-session`: Sticky session related.
* `area/tls`: TLS related.
* `area/websocket`: WebSocket related.
* `area/webui`: Web UI related.

### Priority

* `priority/P0`: needs hot fix. **(only for issue)**
* `priority/P1`: need to be fixed in next release. **(only for issue)**
* `priority/P2`: need to be fixed in the future. **(only for issue)**
* `priority/P3`: maybe. **(only for issue)**

### PR size

* `size/S`: small PR. **(only for PR)** _[bot only]_
* `size/M`: medium PR. **(only for PR)** _[bot only]_
* `size/L`: Large PR. **(only for PR)** _[bot only]_

### Status - Workflow

The `status/*` labels represent the desired state in the workflow.

* `status/0-needs-triage`: all new issue or PR have this status. _[bot only]_
* `status/1-needs-design-review`: need a design review. **(only for PR)**
* `status/2-needs-review`: need a code/documentation review. **(only for PR)**
* `status/3-needs-merge`: ready to merge. **(only for PR)**
* `status/4-merge-in-progress`: merge in progress. _[bot only]_
