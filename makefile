ARTIFACT_REGISTRY=asia-southeast1-docker.pkg.dev/xpg-gke-sg/xpg/
PROJECT_NAME=xpg-front
TAG=latest

.PHONY: all
all: build push

build:
	docker buildx build --platform linux/amd64 --build-arg stage=singapore-dev -t $(ARTIFACT_REGISTRY)$(PROJECT_NAME):$(TAG) .

push:
	docker push $(ARTIFACT_REGISTRY)$(PROJECT_NAME):$(TAG)

rollout:
	kubectl rollout restart deploy $(PROJECT_NAME) --namespace=default

start:
	docker run --rm -p 8080:80 -d --name $(PROJECT_NAME) $(ARTIFACT_REGISTRY)$(PROJECT_NAME):$(TAG)

clean:
	rm -rf ./dist
	rm -rf ./node_modules
	rm ./dist.tar.gz
	docker rm -f $(PROJECT_NAME)
	docker rmi $$(docker images '$(ARTIFACT_REGISTRY)$(PROJECT_NAME):$(TAG)' -a -q)