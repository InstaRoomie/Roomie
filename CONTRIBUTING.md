# Contributing Guidelines

Here are the basic conventions for contributing to this project.

### General

Please make sure that there are not existing pull requests attempting to address the issue mentioned. Likewise, please check for issues related to update, as someone else may be working on the issue in a branch or fork.

* Non-trivial changes should be discussed in an issue first
* Develop in a topic branch, not master
* Squash your commits

### Commit Message Format

Each commit message should include a **type**, a **scope** and a **subject**:

```
  [feature]: <Subject> + <description>
```

Lines should not exceed 100 characters. This allows the message to be easier to read on github as well as in various git tools and produces a nice, neat commit log.
For example:

```
#443  [chore]: updates to Ionicons v2
#510  [feature]: adds home page controller
```

#### Type

Must be one of the following:

* **bug**: bug fixes
* **feature**: feature addition
* **refactor**: code refactor
* **styling**: styling changes
* **doc**: document changes
* **chore**: general chore

#### Subject

* use the present tense: "Changes" not "Changed" nor "Change"
* do not capitalize first letter
* no dot (.) or any punctuation at the end
