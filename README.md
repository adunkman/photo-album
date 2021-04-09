# photo-album

This project generates a private photo album website from your photos. Captions for the photo album are generated from the photo’s embedded metadata, which can be set from your photo editing application of choice.

- The site is generated with [Hugo](https://gohugo.io/).
- The infrastructure needed to store, protect, and host your photos and this application is provisioned in AWS using [Terraform](https://www.terraform.io/).
- The deployment pipeline runs in [GitHub Actions](https://github.com/features/actions).

## Getting started locally

### Prerequisites

- Docker version 1.10.0+ (required)
- Make 3.81+

### Starting the application

The repository comes with a few example photos with embedded captions. To render the website and start the development server, run:

```bash
make start
```

Once you see "Web Server is available at…", the photo album is ready at http://localhost:1313/.

Use <kbd>CONTROL</kbd> + <kbd>C</kbd> to stop the application.

### Additional development commands

To see all available commands, run:

```bash
make
```

## Using your own photos

This repository contains a method to replace the example images with ones stored in a separate S3 bucket using an automated process in [GitHub Actions](https://github.com/features/actions).
