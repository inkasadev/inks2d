# Contributing to inks2d

Thanks for taking the time to contribute! inks2d is a volunteer-run project and we couldn't do it without your help.

This document includes a set of guidelines for contributing to inks2d. These are guidelines, not rules. If something seems off, please feel free to propose changes to this document in a pull request.

## Table of Contents

- [Contributing to inks2d](#contributing-to-inks2d)
  - [Table of Contents](#table-of-contents)
  - [How Can I Contribute?](#how-can-i-contribute)
    - [Bug Reports](#bug-reports)
    - [Suggestions](#suggestions)
    - [Documentation](#documentation)
    - [Code](#code)
  - [Setup - Git, GitHub, and Node](#setup---git-github-and-node)
      - [Installation](#installation)
  - [Linting and Building](#linting-and-building)
      - [Linting](#linting)
      - [Building](#building)
  - [Pull Requests](#pull-requests)
  - [Updating Your Branch](#updating-your-branch)

## How Can I Contribute?

### Bug Reports

This section guides you through submitting a bug report for inks2d. Following these guidelines helps others understand your report and resolve the issue.

Before creating a bug report please check [this list][bugs] to see if it has already been reported. If the issue is closed, please open a new issue and link it to the original issue.

When creating a bug report, explain the problem and include as much additional information as necessary to help maintainers to reproduce it. Ideally, provide an example project which highlights the problem.

-   **Use a clear and descriptive title** for the issue to identify the problem
-   **Describe your project setup**. The easier it is for maintainers to reproduce your problem, the more likely it is to be quickly fixed.
-   **Explain what you expected to see instead and why**

### Suggestions

This section guides you through submitting an enhancement suggestion for inks2d.

Before creating a feature request, please check [this list][suggestions] to see if it has already been requested.

When creating an enhancement request, explain your use case and ultimate goal. This will make it possible for contributors to suggest existing alternatives which may already meet your requirements.

-   **Use a clear and descriptive title** for the issue to identify the suggestion.
-   **Provide an example where this enhancement would improve inks2d**
-   **If possible, list another documentation generator where this feature exists**

### Documentation

inks2d is documented in 2 primary areas.

-   This repo's [README.md](https://github.com/inkasadev/inks2d/blob/master/README.md)
-   Doc comments of source files which are rendered in the [api docs](https://github.com/inkasadev/inks2d/tree/main/packages/lib/docs)

If you would like to improve the documentation in any of these areas, please open an issue if there isn't one already to discuss what you would like to improve. Then submit a [Pull Request](#pull-requests) to this repo.

### Code

Unsure of where to begin contributing to inks2d? You can start by looking through the issues labeled [good-first-issue] and [help-wanted]. Issues labeled with [good-first-issue] should only require changing a few lines of code and a test or two. Issues labeled with [help-wanted] can be considerably more involved and may require changing multiple files.

For instructions on setting up your environment, see the [setup](#setup---git-github-and-node) instructions in this document.

If you have started work on an issue and get stuck or want a second opinion on your implementation feel free to reach out through [Discussions].

## Setup - Git, GitHub, and Node

If you don't already have [Git] installed, install it first. You will need it to contribute to inks2d. You will also need to install [Node]. inks2d requires at least npm 4, so if you are running Node 7.3.0 or older you will need to upgrade npm using `npm install --global npm@^4`.

#### Installation

1. Fork the inks2d repository - https://github.com/inkasadev/inks2d/fork
1. Open a terminal, or "Git Bash" on Windows.
1. Use `cd` to move to the directory that you want to work in.
1. Clone your repository, replace USER with your GitHub username:
    ```bash
    git clone https://github.com/USER/inks2d
    ```
1. Add the inks2d repo as a remote repository
    ```bash
    git remote add inks2d https://github.com/inkasadev/inks2d
    ```
1. Install dependencies:
    ```bash
    npm install
    ```
1. Build:
    ```bash
    npm run build
    ```
1. Open the inks2d folder in your favorite editor. If you don't have one, try [Visual Studio Code][vscode].

## Linting and Building

Once you have cloned inks2d, you can lint, build, and test the code from your terminal.

#### Linting

To lint the inks2d code, run `npm run validate`. This will start prettier, eslint and check all files for stylistic problems. You can also install an eslint plugin for your editor to show most style problems as you type.

#### Building

To compile the inks2d source, run `npm run build`. This will start the TypeScript compiler and output the compiled JavaScript to the `dist` folder.

## Pull Requests

Once you have finished working on an issue, you can submit a pull request to have your changes merged into the inks2d repository and included in the next release.

Before submitting a pull request, make sure that there are no linting problems (`npm run validate`), all the examples are running without any problems (`npm run examples`), and your branch is up to date.

If your change is user facing, consider updating `CHANGELOG.md` to describe the change you have made. If you don't, the maintainer who merges your pull request will do it for you.

## Updating Your Branch

If the inks2d repository has changed since you originally forked it, you will need to update your repository with the latest changes before submitting a pull request. To pull the latest changes from the inks2d repo, run `git pull inks2d main`.

[bugs]: https://github.com/inkasadev/inks2d/labels/bug
[suggestions]: https://github.com/inkasadev/inks2d/labels/enhancement
[good-first-issue]: https://github.com/inkasadev/inks2d/labels/good%20first%20issue
[help-wanted]: https://github.com/inkasadev/inks2d/labels/help%20wanted
[discussions]: https://github.com/inkasadev/inks2d/discussions
[github]: https://github.com
[git]: https://git-scm.com
[node]: https://nodejs.org/en/
[vscode]: https://code.visualstudio.com/