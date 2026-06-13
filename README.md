# repo-intents

`repo-intents` is a CLI for organizing common repository actions by intent.
It provides a consistent format for scripts and shell commands to list, intelligently search, and execute reusable shell actions.

## Concepts 

- Intent: An aim of *actions*.
- Action: a specific and deterministic thing done.
- Steps: granular description of actions.

`intent -> actions -> steps`

The point of `repo-intents` is to abstract actions and steps to *intents*.
Then details of how to do an action are not needed in daily work on a repository, or generally in the shell.
A script can be said to do the same thing except it abstracts actions to a filename, rather than an intent.

## CLI usage
The current commands:

- `repo-intents init`
- `repo-intents init --global`
- `repo-intents list`

## Implementation

Initializing `repo-intents` in a repository creates a new hidden subdirectory in the current working directory of this shape:

```text
.repo-intents/
  intents/
```

The command `repo-intents init --global` does the same in the home directory. 
Note that intents are always searched through the whole parent path, with closer to the current working directory prioritized.
Therefore, global intents can be saved when not specific to a repository, and subdirectories can have their own intents that are discoverable from any path contained within it.

In the code, each such directory with a `.repo-intents/` folder is called a `Workspace`. 

Intents are saved at the repo-level when added like so:

```text
.repo-intents/
  intents/
    {some-intent-id}/
      intent.json
```

## Design Principles for 1.x

Keeping it simple:
- actions are deterministic shell commands
- the environment available to action steps is the immediately previous prompt inputs, there's no long-running environment over action steps. 
This means if you want to use the output from one command in another you need to write it as one action step. I.e. *actions are not functions*, they don't return data.