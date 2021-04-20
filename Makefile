ifneq (,$(wildcard ./.env))
	include .env
	export
endif

.DEFAULT_GOAL := help
photos := $(wildcard app/assets/images/photos/*)
placeholders := $(patsubst %.jpeg,%.md,$(addprefix app/content/photos/,$(notdir $(photos))))

$(placeholders):
	@touch $@

.PHONY: start
start: $(placeholders) ## Runs the full application stack locally
	@docker-compose up hugo

.PHONY: build
build: $(placeholders) ## Generate compiled application files to prepare for a deployment
	@docker-compose run hugo --

.PHONY: deploy
deploy: ## 🔒 Deploys compiled application files to static host
	@HUGO_ENV=production docker-compose run hugo deploy --maxDeletes -1

.PHONY: photos-download
photos-download: ## 🔒 Downloads any photos to the local directory from remote
	@docker-compose run aws s3 sync s3://${DOMAIN}-storage/photos/ /app/assets/images/photos/ && \
		echo ✨ All files are downloaded!

.PHONY: photos-upload
photos-upload: ## 🔒 Uploads any photos from the local directory to remote
	@docker-compose run aws s3 sync --exclude "*" --include "*.jpeg" /app/assets/images/photos/ s3://${DOMAIN}-storage/photos/ && \
		echo ✨ All files are uploaded!

.PHONY: tfsec
tfsec: ## Runs tfsec to scan for security issues
	@docker-compose run tfsec /terraform

.PHONY: terraform-init
terraform-init: ## 🔒 Runs terraform init
	@docker-compose run terraform init -backend-config="bucket=${DOMAIN}-terraform" -backend-config="region=${AWS_DEFAULT_REGION}"

.PHONY: terraform-plan
terraform-plan: ## 🔒 Runs terraform plan
	@docker-compose run terraform plan -out=tmp/plan

.PHONY: terraform-apply
terraform-apply: ## 🔒 Runs terraform apply
	@docker-compose run terraform apply tmp/plan

.PHONY: help
help:
	@echo "Usage: make [task]\n\nAvailable tasks:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo "\n\033[33m(🔒) These tasks require AWS credentials configured via environment variables.\033[0m"
